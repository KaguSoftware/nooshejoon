import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  });
}
