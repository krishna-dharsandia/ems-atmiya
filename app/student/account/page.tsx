import { AccountProfile } from "@/components/section/account/AccountProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function StudentAccountPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your student profile and account preferences
          </p>
        </div>
      </div>

      <AccountProfile role="STUDENT" />
    </div>
  );
}
