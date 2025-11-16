import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, MessageCircleWarningIcon, PlusIcon } from "lucide-react";
import CreateChore from "@/components/create-chore";
import AddChild from "@/components/add-child";
import Children from "@/components/children";
import ApprovalList from "@/components/approval-list";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData) {
    redirect("/auth/login");
  }

  const { data, error: childrenError } = await supabase
    .from("children")
    .select("id, name, current_rewards, lifetime_rewards, access_key");

  const { data: pendingChores, error: pendingChoresError } = await supabase
    .from("chores")
    .select("id, title, description, reward, assigned_child ( name )")
    .eq("status", "pending_approval");

  if (childrenError || pendingChoresError) {
    console.error("Error fetching children:", childrenError);
    return (
      <div className="w-full flex flex-col gap-12">
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <MessageCircleWarningIcon size={16} strokeWidth={2} />
            There has been an error fetching your children data. Please try
            again later or contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex flex-col mx-auto gap-12">
      {/* Info */}
      <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size={16} strokeWidth={2} />
          This is a protected page that you can only see as an authenticated user
        </div>
      </div>

      {/* Children Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg mb-4">Children</h2>

          {/* Use <details> as toggle */}
          <details className="relative">
            <summary className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
              <PlusIcon size={20} />
            </summary>
            <div className="absolute z-50 top-10 right-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
              <AddChild userId={claimsData.claims.sub} />
            </div>
          </details>
        </div>

        <Children childrenData={data} />
      </div>

      {/* Approval List */}
      <ApprovalList
        userId={claimsData.claims.sub}
        chores={(pendingChores ?? []).map((chore) => {
          const assigned = Array.isArray(chore.assigned_child)
            ? chore.assigned_child[0]?.name
            : (chore.assigned_child as { name: string })?.name;
          return {
            id: chore.id,
            title: chore.title,
            description: chore.description,
            reward: chore.reward,
            assigned_child: assigned,
          };
        })}
      />

      {/* Actions Section */}
      <div className="flex flex-col">
        <h2 className="font-bold text-lg mb-4">Actions</h2>
        <div className="flex flex-wrap gap-4">
          <CreateChore userId={claimsData.claims.sub} childrenData={data} />
          {/* Removed inline AddChild since it now lives in the toggle */}
        </div>
      </div>
    </div>
  );
}
