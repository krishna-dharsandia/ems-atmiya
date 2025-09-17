"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Secure logout action that clears the user session
 * and redirects directly to the login page
 */
export async function logoutAction(reason?: 'role_mismatch' | 'validation_error' | 'user_initiated') {
  try {
    const supabase = await createClient();
    
    // Sign out the user
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, we should still redirect to login
    }

    // Redirect directly to login page with error message
    const loginUrl = new URL('/login', process.env.BASE_URL || 'http://localhost:3000');
    if (reason) {
      loginUrl.searchParams.set('error', reason);
    }
    
    redirect(loginUrl.toString());
    
  } catch (error) {
    console.error("Unexpected error during logout:", error);
    // Fallback redirect to login
    redirect('/login?error=logout_failed');
  }
}

/**
 * Force logout for security reasons (role mismatch, validation errors, etc.)
 */
export async function forceLogoutForSecurity(reason: 'role_mismatch' | 'validation_error', redirectPath?: string) {
  try {
    const supabase = await createClient();
    
    // Sign out the user
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Error during forced logout:", error);
    }

    // Redirect directly to login page with security reason
    const loginUrl = new URL('/login', process.env.BASE_URL || 'http://localhost:3000');
    loginUrl.searchParams.set('error', reason);
    if (redirectPath) {
      loginUrl.searchParams.set('redirect', redirectPath);
    }
    
    redirect(loginUrl.toString());
    
  } catch (error) {
    console.error("Unexpected error during forced logout:", error);
    // Fallback redirect to login
    redirect('/login?error=security_logout_failed');
  }
}
