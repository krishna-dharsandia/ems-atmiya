"use client";

import { useRoleValidation } from "@/hooks/useRoleValidation";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RoleValidationWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleValidationWrapper({ children, fallback }: RoleValidationWrapperProps) {
  const { isValid, isLoading, error, autoFixed } = useRoleValidation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
            <CardTitle>Validating Session</CardTitle>
            <CardDescription>
              Please wait while we verify your account security...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Session Validation Failed</CardTitle>
            <CardDescription>
              There was an issue validating your session. You will be redirected to login.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {error || "Your session could not be validated. Please log in again."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show success message if role was auto-fixed
  if (autoFixed) {
    return (
      <div className="space-y-4">
        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your session has been automatically updated for security.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
