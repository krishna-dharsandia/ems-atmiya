import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "@/lib/security/roleValidation";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate user role
    const roleValidation = await validateUserRole(user.id);

    if (!roleValidation.isValid) {
      if (roleValidation.autoFixed) {
        return NextResponse.json({ 
          success: true, 
          message: "Role mismatch auto-fixed",
          autoFixed: true 
        });
      } else {
        return NextResponse.json({ 
          error: "Role mismatch detected",
          details: {
            supabaseRole: roleValidation.supabaseRole,
            databaseRole: roleValidation.databaseRole
          }
        }, { status: 403 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Role validation passed",
      role: roleValidation.databaseRole 
    });

  } catch (error) {
    console.error("Error in role validation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
