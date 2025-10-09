"use client";

import { useSetAtom } from "jotai";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/global/heading/Heading";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, CalendarRange, MapPin, Tags, QrCode } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DataTable } from "@/components/global/data-table/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface HackathonAttendanceSchedule {
  id: string;
  day: number;
  checkInTime: string;
  description: string | null;
}

interface Hackathon {
  id: string;
  name: string;
  description: string;
  location: string;
  poster_url: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  registration_start_date: string;
  registration_end_date: string;
  mode: string;
  status: string;
  tags: string[];
  organizer_name: string;
  organizer_contact: string | null;
  attendanceSchedules: HackathonAttendanceSchedule[];
}

export default function HackathonDetails() {
  const setCurrentBreadcrumbs = useSetAtom(sidebarBreadcrumbs);
  const router = useRouter();
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const params = useParams<{ id: string }>();

  const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch");
    return response.json();
  };

  const { data, error, isLoading } = useSWR<any>(
    `/api/hackathons/${params.id}`,
    fetcher
  );

  useEffect(() => {
    if (data && data.hackathon) {
      setHackathon(data.hackathon);
    }
  }, [data]);

  useEffect(() => {
    setCurrentBreadcrumbs([
      { label: "Dashboard", href: "/admin" },
      { label: "Hackathons", href: "/admin/hackathons" },
      {
        label: hackathon?.name || "Hackathon Details",
        href: `/admin/hackathons/${params.id}`,
      },
    ]);
  }, [setCurrentBreadcrumbs, params.id, hackathon?.name]);

  const columns: ColumnDef<HackathonAttendanceSchedule>[] = [
    {
      accessorKey: "day",
      header: "Day",
      cell: ({ row }) => <span>Day {row.original.day}</span>,
    },
    {
      accessorKey: "checkInTime",
      header: "Check-in Time",
      cell: ({ row }) => {
        const time = new Date(row.original.checkInTime);
        return <span>{format(time, "h:mm a")}</span>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span>{row.original.description || "No description"}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const schedule = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/admin/hackathons/${params.id}/schedules/${schedule.id}`
                )
              }
            >
              Take Attendance
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Error loading hackathon</h2>
        <Button onClick={() => router.push("/admin/hackathons")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hackathons
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/hackathons")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hackathons
          </Button>
          <Heading
            title={hackathon.name}
            description="Hackathon details and attendance management."
          />
        </div>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Hackathon Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <CalendarRange className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Date and Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(hackathon.start_date), "MMMM d, yyyy")} -{" "}
                    {format(new Date(hackathon.end_date), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(hackathon.start_time), "h:mm a")} -{" "}
                    {format(new Date(hackathon.end_time), "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">
                    {hackathon.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hackathon.mode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Tags className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {hackathon.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Organizer</p>
                <p className="text-sm text-muted-foreground">
                  {hackathon.organizer_name}
                </p>
              </div>

              {hackathon.organizer_contact && (
                <div>
                  <p className="font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">
                    {hackathon.organizer_contact}
                  </p>
                </div>
              )}

              <div>
                <p className="font-medium">Registration Period</p>
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(hackathon.registration_start_date),
                    "MMMM d, yyyy"
                  )}{" "}
                  -{" "}
                  {format(
                    new Date(hackathon.registration_end_date),
                    "MMMM d, yyyy"
                  )}
                </p>
              </div>

              <div>
                <p className="font-medium">Status</p>
                <Badge
                  variant={
                    hackathon.status === "UPCOMING"
                      ? "default"
                      : hackathon.status === "COMPLETED"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {hackathon.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Heading
          title="Attendance Schedules"
          description="Manage attendance for hackathon check-in schedules."
        />
      </div>

      {hackathon.attendanceSchedules &&
      hackathon.attendanceSchedules.length > 0 ? (
        <DataTable columns={columns} data={hackathon.attendanceSchedules} />
      ) : (
        <Card className="text-center p-8">
          <CardDescription className="text-lg">
            No attendance schedules found for this hackathon.
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
