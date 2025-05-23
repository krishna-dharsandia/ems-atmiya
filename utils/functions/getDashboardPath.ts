import { Role } from "@prisma/client";

export function getDashboardPath(role?: Role): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "MASTER":
      return "/master";
    case "STUDENT":
      return "/student";
    default:
      return "/student";
  }
}
