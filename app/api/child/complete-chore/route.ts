// pages/api/child/complete-chore.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { access_key, chore_id } = await req.json();

  const { data: child } = await serviceClient
    .from("children")
    .select("id, lifetime_rewards, current_rewards")
    .eq("access_key", access_key)
    .single();

  if (!child) {
    return NextResponse.json({ error: "Invalid access key" }, { status: 401 });
  }

  const { error } = await serviceClient
    .from("chores")
    .update({ status: "pending_approval" })
    .match({ id: chore_id, assigned_child: child.id })
    .in("status", ["assigned", "rejected"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
