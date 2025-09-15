"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, ArrowLeft, Users } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { TeamMemberInvitation } from "@/components/section/student/hackathons/TeamMemberInvitation";
import Link from "next/link";
import { Hackathon, HackathonTeam, User } from "@/types/hackathon";

interface TeamManagementProps {
  hackathon: Hackathon;
  team: HackathonTeam;
  isTeamOwner: boolean;
  studentId: string;
  currentUser: User;
}

export function TeamManagement({
  hackathon,
  team,
  isTeamOwner,
  studentId,
  currentUser,
}: TeamManagementProps) {
  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const time = new Date(timeString);
    date.setHours(time.getHours(), time.getMinutes());
    return format(date, "PPP 'at' p");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return <Badge variant="default">Upcoming</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

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
        {/* Left column - Hackathon Info */}
        <div className="lg:col-span-1">
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
                      <div className="flex items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
}
