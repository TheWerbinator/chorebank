// pages/api/child/complete-chore.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Again, use the service-role client
const serviceClient = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 }
    );
  }

  const { access_key, chore_id, reward } = await req.json();

  // 1. Validate the access key and find the child
  const { data: child } = await serviceClient
    .from("children")
    .select("id, lifetime_rewards, current_rewards")
    .eq("access_key", access_key)
    .single();

  if (!child) {
    return NextResponse.json({ error: "Invalid access key" }, { status: 401 });
  }

  // 2. Update the chore, BUT only if it belongs to this child
  // This match ({ id: chore_id, child_id: child.id }) is the critical security check.
  const { error } = await serviceClient
    .from("chores")
    .update({ isComplete: true })
    .match({ id: chore_id, assigned_child: child.id });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error: updateError } = await serviceClient
      .from("children")
      .update({
        lifetime_rewards: child.lifetime_rewards + reward,
        current_rewards: child.current_rewards + reward,
      })
      .eq("access_key", access_key);

    if (updateError) {
      return NextResponse.json(
        { error: "Invalid access key" },
        { status: 401 }
      );
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
