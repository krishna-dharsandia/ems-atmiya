"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  Users,
  Edit,
  Download,
  FileSpreadsheet,
  Eye,
  Award,
  FileText,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  exportToCSV,
  exportToXLSX,
  exportToPDF,
  formatTeamData,
  ExportData
} from "@/utils/functions/exportUtils";
import { Input } from "@/components/ui/input";

interface ProblemStatement {
  id: string;
  code: string;
  title: string;
  description: string;
}

interface Rule {
  id: string;
  rule: string;
}

interface TeamMember {
  id: string;
  studentId: string;
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    department: {
      name: string;
    };
    enrollment: string;
  };
  attended: boolean;
}

interface HackathonTeam {
  id: string;
  teamName: string;
  teamId: string;
  members: TeamMember[];
  problemStatement?: {
    id: string;
    code: string;
    title: string;
  };
  submissionUrl?: string | null;
}

export interface MasterHackathonDetailProps {
  hackathon: {
    id: string;
    name: string;
    description: string;
    poster_url: string;
    location: string;
    mode: "ONLINE" | "OFFLINE";
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    registration_start_date: string;
    registration_end_date: string;
    registration_limit: number | null;
    status: "UPCOMING" | "COMPLETED" | "CANCELLED" | "OTHER";
    team_size_limit: number | null;
    tags: string[];
    organizer_name: string;
    organizer_contact: string | null;
    evaluationCriteria: string[];
    rules: Rule[];
    problemStatements: ProblemStatement[];
    created_at: string;
    teams: HackathonTeam[];
    qrCode?: string;
    qrCodeData?: string;
  };
  onTeamClick?: (team: HackathonTeam) => void;
  onEditTeamClick?: (team: HackathonTeam) => void; // <-- add this prop
}

export default function MasterHackathonDetail({
  hackathon,
  onTeamClick,
  onEditTeamClick, // <-- add to props
}: MasterHackathonDetailProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isExporting, setIsExporting] = useState(false);
  const [teamSearch, setTeamSearch] = useState(""); // <-- search state
  const router = useRouter();

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const time = new Date(timeString);
    date.setHours(time.getHours(), time.getMinutes());
    return format(date, "PPP 'at' p");
  };

  const editHackathon = () => {
    router.push(`/master/hackathons/edit/${hackathon.id}`);
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    if (!hackathon.teams || hackathon.teams.length === 0) {
      toast.error("No team data available to export");
      return;
    }

    setIsExporting(true);

    try {
      // Format team data for export
      const formattedTeams = formatTeamData(hackathon.teams as unknown as Record<string, unknown>[]);

      const exportData: ExportData = {
        teams: formattedTeams
      };

      const filename = `${hackathon.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_teams_${new Date().toISOString().split('T')[0]}`;

      switch (format) {
        case 'csv':
          await exportToCSV(exportData, filename, 'teams');
          toast.success("Team data exported to CSV successfully!");
          break;
        case 'xlsx':
          await exportToXLSX(exportData, filename, 'teams');
          toast.success("Team data exported to Excel successfully!");
          break;
        case 'pdf':
          await exportToPDF(exportData, filename, 'teams', hackathon.name);
          toast.success("Team data exported to PDF successfully!");
          break;
        default:
          throw new Error('Unsupported export format');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export team data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadHackathonQR = async () => {
    try {
      let qrCodeBase64 = hackathon.qrCode;

      // If QR code doesn't exist, generate it
      if (!qrCodeBase64) {
        toast.loading("Generating QR code...");

        const response = await fetch(`/api/hackathons/${hackathon.id}/qr-code`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to generate QR code');
        }

        const data = await response.json();
        qrCodeBase64 = data.qrCode;
        toast.dismiss();
      }

      // Create a downloadable link for the QR code
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${qrCodeBase64}`;
      link.download = `${hackathon.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_qr_code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("QR code downloaded successfully");
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.dismiss();
      toast.error("Failed to download QR code");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto py-8 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold break-words">{hackathon.name}</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={editHackathon} className="w-full sm:w-auto">
            <Edit className="mr-2 h-4 w-4" />
            Edit Hackathon
          </Button>
          <Button variant="outline" onClick={handleDownloadHackathonQR} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download QR
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExporting || !hackathon.teams || hackathon.teams.length === 0} className="w-full sm:w-auto">
                {isExporting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </div>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Teams
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <FileText className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative">
            <img
              src={hackathon.poster_url}
              alt={hackathon.name}
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
            <Badge
              className="absolute top-4 right-4"
              variant={getStatusColor(hackathon.status)}
            >
              {hackathon.status}
            </Badge>
          </div>

            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList
              className="flex flex-nowrap overflow-x-auto gap-2 md:gap-0 md:flex-wrap"
            >
              <TabsTrigger value="details" className="flex-shrink-0">
              Details
              </TabsTrigger>
              <TabsTrigger value="problems" className="flex-shrink-0">
              Problem Statements
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex-shrink-0">
              Rules
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex-shrink-0">
              Teams
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex-shrink-0">
              Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-muted-foreground whitespace-pre-wrap break-words">
                      {hackathon.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Start Date & Time</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(hackathon.start_date, hackathon.start_time)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">End Date & Time</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(hackathon.end_date, hackathon.end_time)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Mode</p>
                          <p className="text-sm text-muted-foreground">
                            {hackathon.mode} {hackathon.location && `- ${hackathon.location}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Organizer</p>
                          <p className="text-sm text-muted-foreground">
                            {hackathon.organizer_name}
                            {hackathon.organizer_contact && ` - ${hackathon.organizer_contact}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Evaluation Criteria</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {hackathon.evaluationCriteria.map((criterion, index) => (
                          <li key={index} className="text-muted-foreground">
                            {criterion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Registration Period</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">Registration Opens</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(hackathon.registration_start_date), "PPP")}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Registration Closes</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(hackathon.registration_end_date), "PPP")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="problems" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {hackathon.problemStatements.map((problem, index) => (
                    <div
                      key={problem.id}
                      className={`border rounded-lg p-4 ${index !== hackathon.problemStatements.length - 1 ? "mb-4" : ""}`}
                    >
                      <h3 className="text-lg font-medium mb-1 break-words">
                        {problem.code}: {problem.title}
                      </h3>
                      <p className="text-muted-foreground whitespace-pre-wrap break-words">
                        {problem.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Hackathon Rules</h3>
                  <ul className="list-decimal list-inside space-y-2">
                    {hackathon.rules.map((rule) => (
                      <li key={rule.id} className="text-muted-foreground break-words">
                        {rule.rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <CardTitle>Registered Teams</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isExporting || !hackathon.teams || hackathon.teams.length === 0}
                          className="w-full md:w-auto"
                        >
                          {isExporting ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                              Exporting...
                            </div>
                          ) : (
                            <>
                              <FileSpreadsheet className="mr-2 h-4 w-4" />
                              Export
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleExport('csv')}>
                          <FileText className="mr-2 h-4 w-4" />
                          CSV
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>
                          <Download className="mr-2 h-4 w-4" />
                          PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Search input for team name */}
                  <div className="mt-4">
                    <Input
                      placeholder="Search by team name..."
                      value={teamSearch}
                      onChange={e => setTeamSearch(e.target.value)}
                      className="max-w-xs w-full"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {hackathon.teams && hackathon.teams.length > 0 ? (
                    <div className="rounded-md border overflow-x-auto">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Team Name</TableHead>
                            <TableHead>Problem Statement</TableHead>
                            <TableHead>Members</TableHead>
                            <TableHead>Submission</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(hackathon.teams.filter(team =>
                            team.teamName.toLowerCase().includes(teamSearch.toLowerCase())
                          )).map((team) => (
                            <TableRow key={team.id}>
                              <TableCell className="font-medium">
                                {team.teamName}
                              </TableCell>
                              <TableCell>
                                {team.problemStatement ?
                                  `${team.problemStatement.code}: ${team.problemStatement.title}` :
                                  "Not selected"}
                              </TableCell>
                              <TableCell>{team.members.length}</TableCell>
                              <TableCell>
                                {team.submissionUrl ? (
                                  <Button variant="link" asChild size="sm" className="p-0 h-auto">
                                    <a href={team.submissionUrl} target="_blank" rel="noopener noreferrer">
                                      View Submission
                                    </a>
                                  </Button>
                                ) : (
                                  <span className="text-muted-foreground">No submission yet</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button variant="ghost" size="sm" onClick={() => onTeamClick && onTeamClick(team)}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Team
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => onEditTeamClick && onEditTeamClick(team)}>
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit Team
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">
                        No teams have registered for this hackathon yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Registration Statistics</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Total Teams:</span>
                          <Badge variant="outline">{hackathon.teams?.length || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Total Participants:</span>
                          <Badge variant="outline">
                            {hackathon.teams?.reduce(
                              (acc, team) => acc + team.members.length, 0
                            ) || 0}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Teams with Submissions:</span>
                          <Badge variant="outline">
                            {hackathon.teams?.filter(team => team.submissionUrl).length || 0}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h3 className="text-lg font-medium mb-4">Problem Statement Distribution</h3>
                      {hackathon.problemStatements.map(problem => (
                        <div key={problem.id} className="flex justify-between items-center mb-2">
                          <span className="truncate max-w-[70%]">{problem.code}: {problem.title}</span>
                          <Badge variant="outline">
                            {hackathon.teams?.filter(
                              team => team.problemStatement?.id === problem.id
                            ).length || 0} teams
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6 mt-6 md:mt-0">
          {/* Hackathon status */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Hackathon Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <Badge variant={getStatusColor(hackathon.status)}>{hackathon.status}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Registration:</span>
                  <Badge variant="outline">
                    {new Date() < new Date(hackathon.registration_start_date)
                      ? "Not Started"
                      : new Date() > new Date(hackathon.registration_end_date)
                        ? "Closed"
                        : "Open"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Teams:</span>
                  <Badge variant="outline">
                    {hackathon.teams?.length || 0}
                    {hackathon.registration_limit
                      ? ` / ${hackathon.registration_limit}`
                      : ""}
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <Button className="w-full" onClick={editHackathon}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Hackathon
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Attendance
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Award className="mr-2 h-4 w-4" />
                  Manage Winners
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleDownloadHackathonQR}>
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={isExporting || !hackathon.teams || hackathon.teams.length === 0}
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Export Team Data
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('pdf')}>
                      <Download className="mr-2 h-4 w-4" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {/* Quick info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Hackathon Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mode:</span>
                  <span className="font-medium">{hackathon.mode}</span>
                </div>
                {hackathon.location && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Location:</span>
                    <span className="font-medium">{hackathon.location}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Team Size Limit:</span>
                  <span className="font-medium">{hackathon.team_size_limit || "No limit"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration Limit:</span>
                  <span className="font-medium">{hackathon.registration_limit || "No limit"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {Math.ceil(
                      (new Date(hackathon.end_date).getTime() -
                        new Date(hackathon.start_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
