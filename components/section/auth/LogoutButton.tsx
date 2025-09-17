"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showConfirmation?: boolean;
}

export function LogoutButton({ 
  variant = "ghost", 
  size = "default", 
  className,
  showConfirmation = true 
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const supabase = createClient();
      
      // Sign out the user
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        // Still redirect to login even if there's an error
      }

      // Redirect directly to login page
      router.push('/login?error=user_initiated');
      
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      // Fallback redirect to login
      router.push('/login?error=logout_failed');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const LogoutContent = () => (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {size !== "icon" && (
        <span className="ml-2">
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </span>
      )}
    </Button>
  );

  if (!showConfirmation) {
    return <LogoutContent />;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isLoggingOut}
        >
          <LogOut className="h-4 w-4" />
          {size !== "icon" && <span className="ml-2">Sign out</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign Out</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out? You will need to log in again to access your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing out...
              </>
            ) : (
              "Sign out"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
