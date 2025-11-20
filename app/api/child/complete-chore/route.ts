// pages/api/child/complete-chore.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { access_key, chore_id, child_id } = await req.json();

  if (!access_key || !chore_id || !child_id) {
    return NextResponse.json(
      { error: "Access key, chore ID, and child ID are required" },
      { status: 400 }
    );
  }

  const { error } = await serviceClient
    .from("chores")
    .update({ status: "pending_approval" })
    .match({ id: chore_id, assigned_child: child_id })
    .in("status", ["assigned", "rejected"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
