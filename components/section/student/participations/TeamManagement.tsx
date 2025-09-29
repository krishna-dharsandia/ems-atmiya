"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, ArrowLeft, Users, QrCode, Download, RefreshCw } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { TeamMemberInvitation } from "@/components/section/student/hackathons/TeamMemberInvitation";
import Link from "next/link";
import { Hackathon, HackathonTeam, User } from "@/types/hackathon";
import { KeyedMutator } from "swr";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submissionsAction } from "./submissionsAction";
import { Input } from "@/components/ui/input";

interface TeamManagementProps {
  hackathon: Hackathon;
  team: HackathonTeam;
  isTeamOwner: boolean;
  studentId: string;
  currentUser: User;
  mutate: KeyedMutator<any>;
}

export const submissionsSchema = z.object({
  url: z.string().url("Please enter a valid URL")
})

export type SubmissionsFormValues = z.infer<typeof submissionsSchema>;

export function TeamManagement({
  hackathon,
  team,
  isTeamOwner,
  studentId,
  currentUser,
  mutate
}: TeamManagementProps) {
  const [qrData, setQrData] = useState<{
    qrCode: string;
    qrCodeData: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  } | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrGenerating, setQrGenerating] = useState(false);

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const time = new Date(timeString);
    date.setHours(time.getHours(), time.getMinutes());
    return format(date, "PPP 'at' p");
  };

  // Fetch QR code when component mounts
  useEffect(() => {
    if (team && studentId) {
      fetchQRCode();
    }
  }, [team.id, studentId]);

  // Fetch user's QR code for this team
  const fetchQRCode = async () => {
    // For disqualified teams, we still allow fetching existing QR codes
    // but we'll disable the buttons for generating/downloading
    setQrLoading(true);
    try {
      const response = await fetch(`/api/student/team-member/qr-code?teamId=${team.id}`);
      if (response.ok) {
        const data = await response.json();
        setQrData(data);
      } else if (response.status === 404) {
        // QR code doesn't exist yet
        setQrData(null);
      } else {
        console.error("Failed to fetch QR code");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    } finally {
      setQrLoading(false);
    }
  };

  // Generate QR code for this team member
  const generateQRCode = async () => {
    // Prevent QR code generation for disqualified teams
    if (team.disqualified) {
      toast.error("QR code generation is disabled for disqualified teams");
      return;
    }

    setQrGenerating(true);
    try {
      const response = await fetch('/api/student/team-member/qr-code', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          teamId: team.id,
          hackathonId: hackathon.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setQrData(data);
        toast.success("QR code generated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setQrGenerating(false);
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!qrData) return;

    // Prevent QR code download for disqualified teams
    if (team.disqualified) {
      toast.error("QR code download is disabled for disqualified teams");
      return;
    }

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${qrData.qrCode}`;
    link.download = `${hackathon.name}-team-qr-code.png`;
    link.click();
  };

  const submissionsForm = useForm({
    resolver: zodResolver(submissionsSchema),
    defaultValues: {
      url: ""
    }
  })

  const submissionsOnSubmit = async (data: SubmissionsFormValues) => {
    // Prevent submissions for disqualified teams
    if (team.disqualified) {
      toast.error("Submissions are disabled for disqualified teams");
      return;
    }

    const response = await submissionsAction(data, hackathon.id, team.id);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Submission URL updated successfully");
      mutate();
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <Link href="/student/participations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Team Management</h1>
            <p className="text-muted-foreground">
              Manage your team for {hackathon.name}
            </p>
          </div>
        </div>
      </div>

       {/* Disqualification Notice - Show if team is disqualified */}
      {team.disqualified && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-300">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Team Disqualified</h3>
              <div className="mt-2 text-red-700 dark:text-red-200">
                <p>Your team has been disqualified from this hackathon. Some actions are restricted.</p>
                <p className="text-sm mt-1">Please contact the hackathon organizers for more information.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Hackathon Info and QR Code */}
        <div className="lg:col-span-1 space-y-6">
          {/* Hackathon Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Hackathon Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <img
                  src={getImageUrl(hackathon.poster_url, "hackathon-posters")}
                  alt={hackathon.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant={
                    hackathon.status === "UPCOMING"
                      ? "default"
                      : hackathon.status === "COMPLETED"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {hackathon.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">{hackathon.name}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {hackathon.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Start Date</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(hackathon.start_date, hackathon.start_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(hackathon.end_date, hackathon.end_time)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Mode</p>
                    <p className="text-xs text-muted-foreground">
                      {hackathon.mode} {hackathon.location && `- ${hackathon.location}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Team Size Limit:</span>
                  <Badge variant="outline">
                    {hackathon.team_size_limit || 5} members
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal QR Code Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Your Hackathon QR Code
              </CardTitle>
              <CardDescription>
                Use this QR code for event check-in and identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : !qrData ? (
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You don't have a QR code for this hackathon yet.
                  </p>
                  <Button
                    onClick={generateQRCode}
                    disabled={qrGenerating || team.disqualified}
                    title={team.disqualified ? "QR code generation is disabled for disqualified teams" : ""}
                  >
                    {qrGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </>
                    )}
                  </Button>
                  {team.disqualified && (
                    <p className="text-xs text-red-500 mt-2">
                      QR code generation is disabled for disqualified teams
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">Team Member</Badge>
                    <Badge variant="secondary" className="text-xs">Hackathon: {hackathon.name}</Badge>
                  </div>

                  <div className="bg-white p-6 rounded-lg inline-block border-2 border-dashed border-primary/20">
                    <Image
                      width={200}
                      height={200}
                      src={`data:image/png;base64,${qrData.qrCode}`}
                      alt="Personal QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">{qrData.user.firstName} {qrData.user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{qrData.user.email}</p>
                  </div>

                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadQRCode}
                      disabled={team.disqualified}
                      title={team.disqualified ? "Download is disabled for disqualified teams" : ""}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchQRCode}
                      disabled={team.disqualified}
                      title={team.disqualified ? "Refresh is disabled for disqualified teams" : ""}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  {team.disqualified && (
                    <p className="text-xs text-red-500 mt-2 text-center">
                      QR code actions are disabled for disqualified teams
                    </p>
                  )}

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      {team.disqualified
                        ? "Your team has been disqualified. This QR code is no longer valid for check-in."
                        : "Show this QR code to organizers at the hackathon for check-in and attendance tracking. Make sure to save a copy on your device."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Team Management */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Team Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Team Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Team Name</h3>
                    <p className="text-lg">{team.teamName}</p>
                  </div>

                  {team.problemStatement && (
                    <div>
                      <h3 className="font-medium mb-2">Selected Problem Statement</h3>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="font-medium">
                          {team.problemStatement.code}: {team.problemStatement.title}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Your Role:</span>
                      <Badge variant={isTeamOwner ? "default" : "secondary"} className="ml-2">
                        {isTeamOwner ? "Team Lead" : "Team Member"}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Team Size:</span>
                      <span className="ml-2 font-medium">
                        {team.members.length} / {hackathon.team_size_limit || 5}
                      </span>
                    </div>
                    {team.disqualified && (
                      <div>
                        <Badge variant="destructive" className="ml-2">Disqualified</Badge>
                      </div>
                    )}
                  </div>

                  {team.disqualified && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded dark:bg-red-900/20 dark:border-red-800 mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 mr-2 dark:text-red-300">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <div>
                          <p className="text-red-700 font-medium text-sm dark:text-red-300">Team Disqualified</p>
                          <p className="text-red-600 text-xs dark:text-red-200">
                            This team has been disqualified from the hackathon. Certain features are restricted.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isTeamOwner && !team.disqualified && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded dark:bg-green-900/20 dark:border-green-800">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-green-400 mr-2 dark:text-green-300" />
                        <div>
                          <p className="text-green-700 font-medium text-sm dark:text-green-300">Team Lead Privileges</p>
                          <p className="text-green-600 text-xs dark:text-green-200">
                            You can invite members and manage the team.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isTeamOwner && team.disqualified && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded dark:bg-amber-900/20 dark:border-amber-800">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 mr-2 dark:text-amber-300">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                          <line x1="12" y1="9" x2="12" y2="13"></line>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <div>
                          <p className="text-amber-700 font-medium text-sm dark:text-amber-300">Limited Team Lead Privileges</p>
                          <p className="text-amber-600 text-xs dark:text-amber-200">
                            Due to disqualification, some team management features are restricted.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team Management Component - Only show management features for team leads and non-disqualified teams */}
            {isTeamOwner && !team.disqualified ? (
              <TeamMemberInvitation
                team={team}
                isTeamMember={true}
                isTeamOwner={isTeamOwner}
                studentId={studentId}
                pendingInvites={[]}
                mutate={mutate}
              />
            ) : isTeamOwner && team.disqualified ? (
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>
                    Team management features are restricted for disqualified teams.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Members Table - Read Only */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Current Members</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 font-medium">Name</th>
                              <th className="text-left p-3 font-medium">Email</th>
                              <th className="text-left p-3 font-medium">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {team.members.map((member) => (
                              <tr key={member.id} className="border-t">
                                <td className="p-3">
                                  {member.student.user.firstName} {member.student.user.lastName}
                                </td>
                                <td className="p-3 text-muted-foreground">
                                  {member.student.user.email}
                                </td>
                                <td className="p-3">
                                  <Badge variant={
                                    member.student.id === studentId ? "default" :
                                      team.members.indexOf(member) === 0 ? "default" :
                                        "secondary"
                                  }>
                                    {member.student.id === studentId ? "You" :
                                      team.members.indexOf(member) === 0 ? "Team Lead" :
                                        "Member"}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded dark:bg-red-900/20 dark:border-red-800">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 mr-2 dark:text-red-300">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <div>
                          <p className="text-red-700 font-medium dark:text-red-300">Team Management Restricted</p>
                          <p className="text-red-600 text-sm mt-1 dark:text-red-200">
                            You cannot invite new members or manage the team because your team has been disqualified. Please contact the hackathon organizers for assistance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    You are a team member. Only team leads can manage the team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Team Members Table - Read Only */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Current Members</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="text-left p-3 font-medium">Name</th>
                              <th className="text-left p-3 font-medium">Email</th>
                              <th className="text-left p-3 font-medium">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {team.members.map((member) => (
                              <tr key={member.id} className="border-t">
                                <td className="p-3">
                                  {member.student.user.firstName} {member.student.user.lastName}
                                </td>
                                <td className="p-3 text-muted-foreground">
                                  {member.student.user.email}
                                </td>
                                <td className="p-3">
                                  <Badge variant={
                                    member.student.id === studentId ? "default" :
                                      team.members.indexOf(member) === 0 ? "default" :
                                        "secondary"
                                  }>
                                    {member.student.id === studentId ? "You" :
                                      team.members.indexOf(member) === 0 ? "Team Lead" :
                                        "Member"}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pending Invitations - Read Only */}
                    {team.invites.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium mb-2">Pending Invitations</h3>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-muted">
                              <tr>
                                <th className="text-left p-3 font-medium">Name</th>
                                <th className="text-left p-3 font-medium">Email</th>
                                <th className="text-left p-3 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {team.invites.map((invite) => (
                                <tr key={invite.id} className="border-t">
                                  <td className="p-3">
                                    {invite.student.user.firstName} {invite.student.user.lastName}
                                  </td>
                                  <td className="p-3 text-muted-foreground">
                                    {invite.student.user.email}
                                  </td>
                                  <td className="p-3">
                                    <Badge variant={
                                      invite.status === "PENDING" ? "secondary" :
                                        invite.status === "ACCEPTED" ? "default" :
                                          "destructive"
                                    }>
                                      {invite.status}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Team Info */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <div className="flex items-start">
                        <Users className="h-5 w-5 text-blue-400 mr-2" />
                        <div>
                          <p className="text-blue-700 font-medium">Team Member View</p>
                          <p className="text-blue-600 text-sm">
                            You can view team information but cannot invite members or manage the team.
                            Contact your team lead for team management tasks.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {isTeamOwner && !team.disqualified ? (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Submission</CardTitle>
                  <CardDescription>
                    Submissions will be opened after the hackathon ends. You can submit only once.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...submissionsForm}>
                    <form onSubmit={submissionsForm.handleSubmit(submissionsOnSubmit)}>
                      <div className="flex gap-2 items-center">
                        <FormField
                          control={submissionsForm.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Submission URL</FormLabel>
                              <FormControl>
                                <Input
                                  className="flex-grow"
                                  type="url"
                                  placeholder="https://github.com/your-repo"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Solution submissions must be public repositories on GitHub, GitLab, or Bitbucket.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={team.submissionUrl !== "" || hackathon.open_submissions === false}>
                          Submit
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : isTeamOwner && team.disqualified ? (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Submission</CardTitle>
                  <CardDescription>
                    Submissions are disabled for disqualified teams.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 mr-2 dark:text-red-300">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      <div>
                        <p className="text-red-700 font-medium dark:text-red-300">Submissions Restricted</p>
                        <p className="text-red-600 text-sm mt-1 dark:text-red-200">
                          You cannot submit solutions because your team has been disqualified from the hackathon. Please contact the organizers for more information.
                        </p>
                      </div>
                    </div>
                  </div>

                  {team.submissionUrl && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">Previous Submission</h3>
                      <div className="p-3 bg-muted rounded-lg">
                        <a href={team.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {team.submissionUrl}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Submission</CardTitle>
                  <CardDescription>
                    Only team leads can submit solutions on behalf of the team.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-yellow-400 mr-2" />
                      <div>
                        <p className="text-yellow-700 font-medium">Team Member Notice</p>
                        <p className="text-yellow-600 text-sm">
                          As a team member, you cannot submit solutions. Please coordinate with your team lead to ensure your team's submission is completed on time.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
