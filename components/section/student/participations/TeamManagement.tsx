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
                  <Button onClick={generateQRCode} disabled={qrGenerating}>
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
                    <Button variant="outline" size="sm" onClick={downloadQRCode}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchQRCode}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      Show this QR code to organizers at the hackathon for check-in and attendance tracking. Make sure to save a copy on your device.
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

                  <div className="flex items-center gap-4">
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
                  </div>

                  {isTeamOwner && (
                    <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-green-400 mr-2" />
                        <div>
                          <p className="text-green-700 font-medium text-sm">Team Lead Privileges</p>
                          <p className="text-green-600 text-xs">
                            You can invite members and manage the team.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Team Management Component - Only show management features for team leads */}
            {isTeamOwner ? (
              <TeamMemberInvitation
                team={team}
                isTeamMember={true}
                isTeamOwner={isTeamOwner}
                studentId={studentId}
                pendingInvites={[]}
                mutate={mutate}
              />
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

            {isTeamOwner ? (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Submission</CardTitle>
                  <CardDescription>
                    Submissions will be opened after the hackathon ends. You can submit only once.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...submissionsForm}>
                    <form>
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
