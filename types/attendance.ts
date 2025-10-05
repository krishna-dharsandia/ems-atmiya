export interface AttendanceRecord {
  id: string;
  attendanceScheduleId: string;
  teamMemberId: string;
  isPresent: boolean;
  checkedInAt: string;
  checkedInBy: string;
  created_at: string;
  updated_at: string;
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
