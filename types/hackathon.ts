import { EventMode, EventStatus, InviteStatus } from "@prisma/client";

export interface ProblemStatement {
  id: string;
  code: string;
  title: string;
  description: string;
}

export interface Rule {
  id: string;
  rule: string;
}

export interface TeamMember {
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

export interface TeamInvite {
  id: string;
  studentId: string;
  status: InviteStatus;
  student: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface HackathonTeam {
  id: string;
  teamName: string;
  teamId: string | null;
  leaderId?: string | null;
  leader?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  } | null;
  members: TeamMember[];
  invites: TeamInvite[];
  submissionUrl?: string;
  problemStatement?: {
    id: string;
    code: string;
    title: string;
  } | null;
  hackathon?: {
    team_size_limit: number | null;
  };
}

export interface Hackathon {
  id: string;
  name: string;
  description: string;
  poster_url: string;
  location: string;
  mode: EventMode;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  registration_start_date?: string;
  registration_end_date?: string;
  registration_limit?: number | null;
  status: EventStatus;
  team_size_limit: number | null;
  tags: string[];
  organizer_name: string;
  organizer_contact: string | null;
  evaluationCriteria?: string[];
  rules?: Rule[];
  problemStatements?: ProblemStatement[];
  created_at: string;
  open_submissions: boolean;
}

export interface Participation {
  id: string;
  hackathon: Hackathon;
  team: HackathonTeam;
  isTeamOwner: boolean;
  attended: boolean;
}

export interface PendingInvitation {
  id: string;
  hackathon: Hackathon;
  team: {
    id: string;
    teamName: string;
    teamId: string | null;
  };
  inviteId: string;
  status: InviteStatus;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Student {
  id: string;
  user: User;
}
