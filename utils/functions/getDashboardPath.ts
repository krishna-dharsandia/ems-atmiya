export function getDashboardPath(role?: string): string {
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
