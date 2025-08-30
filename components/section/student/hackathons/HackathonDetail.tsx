"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon, UserIcon, Users } from "lucide-react";
import { CreateTeamForm } from "./CreateTeamForm";
import { TeamMemberInvitation } from "./TeamMemberInvitation";
import { Student, User } from "@prisma/client";
import { getImageUrl } from "@/lib/utils";

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

export interface Team {
  id: string;
  teamName: string;
  teamId: string;
  members: {
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
  }[];
  invites: {
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
  }[];
  problemStatement?: {
    id: string;
    code: string;
    title: string;
  };
}

export interface HackathonDetailProps {
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
  };
  currentUser: (User & {
    students: Student[];
  }) | null;
  userTeam: Team | null;
  pendingInvites: { teamId: string; teamName: string }[];
}

export default function HackathonDetail({
  hackathon,
  currentUser,
  userTeam,
  pendingInvites,
}: HackathonDetailProps) {
  const [activeTab, setActiveTab] = useState("details");

  const formatDateTime = (dateString: string, timeString: string) => {
    const date = new Date(dateString);
    const time = new Date(timeString);
    date.setHours(time.getHours(), time.getMinutes());
    return format(date, "PPP 'at' p");
  };

  const isStudent = currentUser?.role === "STUDENT";
  const studentId = currentUser?.students?.[0]?.id;
  const isTeamMember = userTeam !== null;

  // Determine if the current user is the team owner (first member)
  const isTeamOwner = userTeam && userTeam.members.length > 0
    ? userTeam.members[0].studentId === studentId
    : false;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative">
            <img
              src={getImageUrl(hackathon.poster_url, "hackathon-posters")}
              alt={hackathon.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge
              className="absolute top-4 right-4"
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
            <h1 className="text-3xl font-bold mb-2">{hackathon.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {hackathon.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="problems">Problem Statements</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              {isStudent && !isTeamMember && pendingInvites.length === 0 && <TabsTrigger value="register">Register</TabsTrigger>}
              {isStudent && !isTeamMember && pendingInvites.length > 0 && <TabsTrigger value="invitations">Invitations</TabsTrigger>}
              {isTeamMember && <TabsTrigger value="team">My Team</TabsTrigger>}
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <p className="text-muted-foreground whitespace-pre-wrap">
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
                      className={`border rounded-lg p-4 ${
                        index !== hackathon.problemStatements.length - 1 ? "mb-4" : ""
                      }`}
                    >
                      <h3 className="text-lg font-medium mb-1">
                        {problem.code}: {problem.title}
                      </h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
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
                      <li key={rule.id} className="text-muted-foreground">
                        {rule.rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            {isStudent && !isTeamMember && pendingInvites.length === 0 && (
              <TabsContent value="register" className="mt-4">
                <CreateTeamForm
                //@ts-ignore
                  hackathon={hackathon as any}
                  userIsRegistered={isTeamMember}
                />
              </TabsContent>
            )}

            {isStudent && !isTeamMember && pendingInvites.length > 0 && (
              <TabsContent value="invitations" className="mt-4">
                <TeamMemberInvitation
                  team={null}
                  isTeamMember={false}
                  isTeamOwner={false}
                  studentId={studentId || ""}
                  pendingInvites={pendingInvites}
                />
              </TabsContent>
            )}

            {isTeamMember && (
              <TabsContent value="team" className="mt-4">
                <TeamMemberInvitation
                team={userTeam as any}
                isTeamMember={isTeamMember}
                isTeamOwner={isTeamOwner}
                studentId={studentId || ""}
                pendingInvites={[]}
                />
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Registration status */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Registration Status</h3>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">
                  {hackathon.registration_limit
                    ? `Limited to ${hackathon.registration_limit} teams`
                    : "No team limit"}
                </span>
                <Badge variant="outline">{hackathon.team_size_limit || 5} members per team</Badge>
              </div>

              {isStudent && !isTeamMember && pendingInvites.length > 0 && (
                <div className="mb-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setActiveTab("invitations")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Team Invitations ({pendingInvites.length})
                  </Button>
                </div>
              )}

              {isStudent && !isTeamMember && pendingInvites.length === 0 && (
                <Button
                  className="w-full"
                  onClick={() => setActiveTab("register")}
                >
                  Create Team
                </Button>
              )}

              {isStudent && isTeamMember && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Your Team:</span>
                    <Badge>{userTeam?.teamName}</Badge>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setActiveTab("team")}
                  >
                    Manage Team
                  </Button>
                </div>
              )}

              {!isStudent && (
                <div className="bg-muted p-3 rounded-md text-sm text-muted-foreground">
                  Only students can register for hackathons.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick info */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-2">Hackathon Information</h3>
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
