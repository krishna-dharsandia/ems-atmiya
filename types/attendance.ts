export interface AttendanceRecord {
  id: string;
  attendanceScheduleId: string;
  teamMemberId: string;
  isPresent: boolean;
  checkedInAt: string;
  checkedInBy: string;
  created_at: string;
  updated_at: string;
  teamMember?: TeamMember;
  checkedInByUser?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AttendanceSchedule {
  id: string;
  hackathonId: string;
  day: number;
  checkInTime: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  attendanceRecords: AttendanceRecord[];
}

export interface CreateAttendanceSchedulePayload {
  hackathonId: string;
  day: number;
  checkInTime: string;
  description?: string | null;
}

export interface UpdateAttendanceSchedulePayload {
  day: number;
  checkInTime: string;
  description?: string | null;
}

export interface MarkAttendancePayload {
  teamMemberId: string;
  scheduleId: string;
  isPresent: boolean;
}

export interface TeamMember {
  id: string;
  teamId: string;
  studentId: string;
  attended: boolean;
  qrCode?: string | null;
  qrCodeData?: string | null;
  student: {
    id: string;
    enrollment?: string;
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
  team?: {
    id: string;
    teamName: string;
    teamId?: string;
  };
  attendanceRecords?: AttendanceRecord[];
}

export interface AttendanceStats {
  totalMembers: number;
  presentCount: number;
  absentCount: number;
  attendancePercentage: number;
}
