"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { inviteTeamMemberAction } from "./inviteTeamMemberAction";
import { respondToInvitationAction } from "./respondToInvitationAction";
import { PlusCircle, X, Check } from "lucide-react";
import { KeyedMutator } from "swr";

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
  };
  attended: boolean;
}

interface TeamInvite {
  id: string;
  studentId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

interface HackathonTeam {
  id: string;
  teamName: string;
  teamId: string | null;
  members: TeamMember[];
  invites: TeamInvite[];
  hackathon?: {
    team_size_limit: number | null;
  };
}

interface TeamMemberInvitationProps {
  team: HackathonTeam | null;
  isTeamMember: boolean;
  studentId: string;
  pendingInvites?: { teamId: string; teamName: string }[];
  mutate: KeyedMutator<any>;
}

export function TeamMemberInvitation({
  team,
  isTeamMember,
  studentId,
  pendingInvites = [],
  mutate
}: TeamMemberInvitationProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  // Only calculate these values if team is not null
  const maxTeamSize = team?.hackathon?.team_size_limit || 5; // Default to 5 if not specified
  const currentTeamSize = team?.members?.length || 0;
  const canInviteMore = team ? currentTeamSize < maxTeamSize : false;

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !isTeamMember || !team) return;

    setIsInviting(true);
    try {
      const response = await inviteTeamMemberAction(team.id, inviteEmail);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Invitation sent successfully!");
        setInviteEmail("");
        mutate(); // Refresh the team data after inviting
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
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

  // If the user is not a team member, show pending invitations
  if (!isTeamMember && pendingInvites.length > 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Invitations</CardTitle>
          <CardDescription>
            You have pending invitations to join hackathon teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingInvites.map((invite) => (
              <div
                key={invite.teamId}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{invite.teamName}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRespondToInvitation(invite.teamId, false)}
                    disabled={isResponding}
                  >
                    <X className="w-4 h-4 mr-1" /> Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRespondToInvitation(invite.teamId, true)}
                    disabled={isResponding}
                  >
                    <Check className="w-4 h-4 mr-1" /> Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If not a team member and no invites, don't show this component
  if (!isTeamMember && pendingInvites.length === 0) {
    return null;
  }

  // If team exists, show team details
  if (!team) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Your team currently has {currentTeamSize} out of {maxTeamSize} members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Team Members Table */}
          <div>
            <h3 className="text-lg font-medium mb-2">Current Members</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.student.user.firstName} {member.student.user.lastName}
                    </TableCell>
                    <TableCell>{member.student.user.email}</TableCell>
                    <TableCell>
                      <Badge variant={member.student.id === studentId ? "default" : "secondary"}>
                        {member.student.id === studentId ? "You" : "Member"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.attended ? (
                        <Badge variant="default" className="bg-green-600">
                          Attended
                        </Badge>
                      ) : (
                        <Badge variant="destructive" >
                          Not Attended
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pending Invitations */}
          {team.invites.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Pending Invitations</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell>
                        {invite.student.user.firstName} {invite.student.user.lastName}
                      </TableCell>
                      <TableCell>{invite.student.user.email}</TableCell>
                      <TableCell>
                        <Badge variant={invite.status === "PENDING" ? "secondary" : invite.status === "ACCEPTED" ? "default" : "destructive"}>
                          {invite.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Invite Form - Only show if team member and can invite more */}
          {isTeamMember && canInviteMore && (
            <div>
              <h3 className="text-lg font-medium mb-2">Invite Members</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter student email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-grow"
                />
                <Button
                  onClick={handleInvite}
                  disabled={isInviting || !inviteEmail.trim()}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  {isInviting ? "Inviting..." : "Invite"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Invited students will receive an email with instructions to join your team.
              </p>
            </div>
          )}

          {/* Message when team is full */}
          {isTeamMember && !canInviteMore && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-700">
                Your team has reached the maximum size of {maxTeamSize} members.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

