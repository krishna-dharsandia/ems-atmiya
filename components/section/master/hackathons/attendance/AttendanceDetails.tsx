"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, formatDate } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ChevronLeft, Download, FileDown, Loader2, Search, X } from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@/fetcher";

interface TeamMember {
  id: string;
  studentId: string;
  student: {
    id: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    department?: {
      name: string;
    };
  };
  attendanceRecords: {
    id: string;
    isPresent: boolean;
    checkedInAt: string;
    checkedInByUser: {
      firstName: string;
      lastName: string;
    };
  }[];
}

interface Team {
  id: string;
  teamName: string;
  teamId: string;
  members: TeamMember[];
}

interface AttendanceScheduleData {
  id: string;
  day: number;
  checkInTime: string;
  description: string | null;
  hackathon: {
    id: string;
    name: string;
    start_date: string;
    teams: Team[];
  };
  attendanceRecords: any[];
}

interface Stats {
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}

interface AttendanceDetailsProps {
  scheduleId: string;
  scheduleInfo: any;
}

export default function AttendanceDetails({ scheduleId }: AttendanceDetailsProps) {
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceScheduleData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [exportLoading, setExportLoading] = useState(false);
  const router = useRouter();

  interface AttendanceDetailsResponse {
    success: boolean;
    attendanceSchedule: AttendanceScheduleData;
    stats: Stats;
    error?: string;
  }

  const { data, error, isLoading } = useSWR<AttendanceDetailsResponse>(
    `/api/hackathons/attendance-details/${scheduleId}`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      if (data.success) {
        setAttendanceData(data.attendanceSchedule);
        setStats(data.stats);
      } else {
        toast.error(data.error || "Failed to load attendance data");
      }
    }
    if (error) {
      console.error("Error fetching attendance data:", error);
      toast.error("Something went wrong while fetching attendance data");
    }
    setLoading(isLoading);
  }, [data, error, isLoading]);

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (!attendanceData) return;

    setExportLoading(true);

    try {
      // Format data for export
      const exportData = attendanceData.hackathon.teams.flatMap(team =>
        team.members.map(member => {
          const attendanceRecord = member.attendanceRecords[0];
          return {
            "Team Name": team.teamName,
            "Team ID": team.teamId || "-",
            "Student Name": `${member.student.user.firstName} ${member.student.user.lastName}`,
            "Department": member.student.department?.name || "-",
            "Email": member.student.user.email,
            "Status": attendanceRecord?.isPresent ? "Present" : "Absent",
            "Check-in Time": attendanceRecord?.isPresent
              ? formatDate(new Date(attendanceRecord.checkedInAt), "PPp")
              : "-",
            "Checked By": attendanceRecord?.isPresent
              ? `${attendanceRecord.checkedInByUser.firstName} ${attendanceRecord.checkedInByUser.lastName}`
              : "-"
          };
        })
      );

      const filename = `attendance_${attendanceData.hackathon.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_day${attendanceData.day}_${new Date().toISOString().split('T')[0]}`;

      if (format === 'csv') {
        toast.success("Attendance data exported to CSV successfully");
      } else {
        toast.success("Attendance data exported to Excel successfully");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export attendance data");
    } finally {
      setExportLoading(false);
    }
  };

  // Filter and search functions
  const getFilteredMembers = () => {
    if (!attendanceData) return [];

    const filteredMembers: { team: Team; member: TeamMember }[] = [];

    attendanceData.hackathon.teams.forEach(team => {
      if (teamFilter === "all" || team.id === teamFilter) {
        team.members.forEach(member => {
          const attendanceRecord = member.attendanceRecords[0];
          const status = attendanceRecord?.isPresent ? "present" : "absent";

          if (statusFilter === "all" || statusFilter === status) {
            // Check if matches search query
            const fullName = `${member.student.user.firstName} ${member.student.user.lastName}`.toLowerCase();
            const email = member.student.user.email.toLowerCase();
            const teamName = team.teamName.toLowerCase();
            const query = searchQuery.toLowerCase();

            if (
              query === "" ||
              fullName.includes(query) ||
              email.includes(query) ||
              teamName.includes(query)
            ) {
              filteredMembers.push({ team, member });
            }
          }
        });
      }
    });

    return filteredMembers;
  };

  const renderScheduleDate = () => {
    if (!attendanceData) return "";

    const scheduleDate = addDays(
      new Date(attendanceData.hackathon.start_date),
      attendanceData.day - 1
    );

    return format(scheduleDate, "EEEE, MMMM d, yyyy");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p>Loading attendance details...</p>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-destructive">Failed to load attendance data</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const filteredMembers = getFilteredMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance Details</h1>
          <p className="text-muted-foreground">
            {attendanceData.hackathon.name} - Day {attendanceData.day} ({renderScheduleDate()})
          </p>
          <p className="text-sm">
            Schedule: {format(new Date(attendanceData.checkInTime), "h:mm a")}
            {attendanceData.description && ` - ${attendanceData.description}`}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Hackathon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            <p className="text-sm text-muted-foreground">Total Participants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats?.presentCount || 0}</div>
            <p className="text-sm text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">{stats?.absentCount || 0}</div>
            <p className="text-sm text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stats?.attendancePercentage || 0}%</div>
              <Progress value={stats?.attendancePercentage || 0} className="h-2 w-20" />
            </div>
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance List</CardTitle>
          <CardDescription>
            View and filter attendance records for this schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or enrollment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={teamFilter}
                onValueChange={setTeamFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {attendanceData.hackathon.teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.teamName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="hidden lg:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Check-in Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(({ team, member }) => {
                    const attendanceRecord = member.attendanceRecords[0];
                    const isPresent = attendanceRecord?.isPresent || false;

                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <Badge variant={isPresent ? "default" : "destructive"}>
                            {isPresent ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {member.student.user.firstName} {member.student.user.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground lg:hidden">
                            {member.student.department?.name || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{team.teamName}</span>
                          <div className="text-xs text-muted-foreground">
                            ID: {team.teamId || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {member.student.department?.name || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {isPresent ? (
                            <div>
                              <div>{format(new Date(attendanceRecord.checkedInAt), "h:mm a")}</div>
                              <div className="text-xs text-muted-foreground">
                                by {attendanceRecord.checkedInByUser.firstName} {attendanceRecord.checkedInByUser.lastName}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No records match your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {stats?.totalMembers || 0} participants
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('xlsx')}
              disabled={exportLoading}
            >
              {exportLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Export Excel
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
