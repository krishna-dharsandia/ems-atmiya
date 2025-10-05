import { toast } from "sonner";

export async function deleteAttendanceSchedule(scheduleId: string): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch(`/api/hackathons/attendance-schedule/${scheduleId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete attendance schedule");
    }

    return {
      success: true,
      message: "Attendance schedule deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting attendance schedule:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while deleting the schedule"
    };
  }
}

export async function getAttendanceDetails(scheduleId: string) {
  try {
    const response = await fetch(`/api/hackathons/attendance-details/${scheduleId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch attendance details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching attendance details:", error);
    toast.error("Failed to fetch attendance details");
    return { success: false, error: "Failed to load attendance data" };
  }
}
