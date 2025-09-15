"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { respondToInvitationAction } from "@/components/section/student/hackathons/respondToInvitationAction";
import { toast } from "sonner";
import Link from "next/link";
import { Participation, PendingInvitation, User } from "@/types/hackathon";

interface MyParticipationsProps {
  participations: Participation[];
  pendingInvitations: PendingInvitation[];
  currentUser: User;
  studentId: string;
}

export function MyParticipations({
  participations,
  pendingInvitations,
  currentUser,
  studentId,
}: MyParticipationsProps) {
  const [activeTab, setActiveTab] = useState("participations");
  const [isResponding, setIsResponding] = useState(false);

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const time = new Date(timeString);
    date.setHours(time.getHours(), time.getMinutes());
    return format(date, "PPP 'at' p");
  };

  const handleRespondToInvitation = async (teamId: string, accept: boolean) => {
    setIsResponding(true);
    try {
      const response = await respondToInvitationAction(teamId, accept);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(
          accept
            ? "You have joined the team!"
            : "You have declined the invitation."
        );
        // Refresh the page after response
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error responding to invitation:", error);
      toast.error("Failed to respond to invitation");
    } finally {
      setIsResponding(false);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Hackathon Participations</h1>
        <p className="text-muted-foreground">
          Manage your hackathon teams and view your participation history
        </p>
      </div>

      <Tabs defaultValue="participations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participations">
            My Participations ({participations.length})
          </TabsTrigger>
          <TabsTrigger value="invitations">
            Pending Invitations ({pendingInvitations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participations" className="mt-6">
          {participations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Participations Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't joined any hackathon teams yet.
                  </p>
                  <Link href="/events">
                    <Button>Browse Hackathons</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {participations.map((participation) => (
                <Card key={participation.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <img
                          src={getImageUrl(participation.hackathon.poster_url, "hackathon-posters")}
                          alt={participation.hackathon.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <CardTitle className="text-xl mb-2">
                            {participation.hackathon.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(participation.hackathon.status)}
                            <Badge variant="outline">
                              {participation.isTeamOwner ? "Team Lead" : "Team Member"}
                            </Badge>
                            {participation.attended && (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Attended
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {participation.hackathon.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Team</p>
                        <p className="font-medium">{participation.team.teamName}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(participation.hackathon.start_date, participation.hackathon.start_time)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">End Date</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(participation.hackathon.end_date, participation.hackathon.end_time)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Mode</p>
                          <p className="text-xs text-muted-foreground">
                            {participation.hackathon.mode} {participation.hackathon.location && `- ${participation.hackathon.location}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {participation.team.problemStatement && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Selected Problem Statement</p>
                        <p className="text-sm text-muted-foreground">
                          {participation.team.problemStatement.code}: {participation.team.problemStatement.title}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link href={`/hackathons/${participation.hackathon.id}`}>
                        <Button variant="outline" size="sm">
                          View Hackathon
                        </Button>
                      </Link>
                      <Link href={`participations/${participation.hackathon.id}/manage`}>
                        <Button size="sm">
                          {participation.isTeamOwner ? "Manage Team" : "View Team"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="invitations" className="mt-6">
          {pendingInvitations.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Invitations</h3>
                  <p className="text-muted-foreground">
                    You don't have any pending team invitations.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingInvitations.map((invitation) => (
                <Card key={invitation.inviteId}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <img
                          src={getImageUrl(invitation.hackathon.poster_url, "hackathon-posters")}
                          alt={invitation.hackathon.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <CardTitle className="text-lg mb-1">
                            {invitation.hackathon.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(invitation.hackathon.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            You've been invited to join team: <span className="font-medium">{invitation.team.teamName}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <p>Start: {format(new Date(invitation.hackathon.start_date), "PPP")}</p>
                        <p>Mode: {invitation.hackathon.mode}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRespondToInvitation(invitation.team.id, false)}
                          disabled={isResponding}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRespondToInvitation(invitation.team.id, true)}
                          disabled={isResponding}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
