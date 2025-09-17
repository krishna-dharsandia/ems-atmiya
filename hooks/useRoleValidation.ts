"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface RoleValidationResult {
  isValid: boolean;
  isLoading: boolean;
  error?: string;
  autoFixed?: boolean;
}

export function useRoleValidation() {
  const [result, setResult] = useState<RoleValidationResult>({
    isValid: false,
    isLoading: true,
  });
  const router = useRouter();

  useEffect(() => {
    const validateRole = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setResult({ isValid: false, isLoading: false, error: "Not authenticated" });
          return;
        }

        // Call the role validation API
        const response = await fetch('/api/auth/validate-role');
        const data = await response.json();

        if (response.ok) {
          if (data.autoFixed) {
            setResult({ isValid: true, isLoading: false, autoFixed: true });
          } else {
            setResult({ isValid: true, isLoading: false });
          }
        } else {
          // Role mismatch detected - redirect to login
          const loginUrl = new URL('/login', window.location.origin);
          loginUrl.searchParams.set('error', 'role_mismatch');
          loginUrl.searchParams.set('redirect', window.location.pathname);
          
          // Clear auth cookies
          document.cookie = 'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'sb-refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'supabase-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'supabase.auth.token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          
          router.push(loginUrl.toString());
        }
      } catch (error) {
        console.error("Error validating role:", error);
        setResult({ isValid: false, isLoading: false, error: "Validation failed" });
      }
    };

    validateRole();
  }, [router]);

  return result;
}
