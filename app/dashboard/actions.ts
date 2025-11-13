// app/dashboard/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper function to check auth and chore ownership
async function getChoreAndValidateAuth(choreId: string, userId: string) {
  const supabase = await createClient();
  const { data: chore } = await supabase
    .from("chores")
    .select("id, parent, reward, assigned_child")
    .eq("id", choreId)
    .single();

  if (!chore) throw new Error("Chore not found");

  if (chore.parent !== userId) {
    throw new Error("Unauthorized");
  }

  return {
    choreId: chore.id,
    childId: chore.assigned_child,
    rewardAmount: chore.reward,
  };
}

export async function approveChore(choreId: string, userId: string) {
  const supabase = await createClient();
  try {
    const { childId, rewardAmount } = await getChoreAndValidateAuth(
      choreId,
      userId
    );

    const { error: updateError } = await supabase
      .from("chores")
      .update({ status: "complete" })
      .match({ id: choreId, status: "pending_approval" });

    if (updateError) throw updateError;

    // RPC functions are supabase's way of running custom SQL queries on the server
    const { error: rpcError } = await supabase.rpc("increment_child_reward", {
      child_id_to_reward: childId,
      amount_to_add: rewardAmount,
    });

    if (rpcError) throw rpcError;

    revalidatePath("/dashboard"); // Refresh the parent's dashboard after approval
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function rejectChore(choreId: string, userId: string) {
  const supabase = await createClient();
  try {
    await getChoreAndValidateAuth(choreId, userId);

    const { error } = await supabase
      .from("chores")
      .update({ status: "rejected" })
      .match({ id: choreId, status: "pending_approval" });

    if (error) throw error;
    revalidatePath("/dashboard"); // Refresh the parent's dashboard after rejection
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: String(error) };
  }
}
