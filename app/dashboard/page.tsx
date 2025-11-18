import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageCircleWarningIcon, PlusIcon } from "lucide-react";

import CreateChore from "@/components/create-chore";
import AddChild from "@/components/add-child";
import Children from "@/components/children";
import ApprovalList from "@/components/approval-list";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData) redirect("/auth/login");

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
      <div className='w-full flex flex-col gap-12'>
        <div className='w-full'>
          <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
            <MessageCircleWarningIcon size={16} strokeWidth={2} />
            There has been an error fetching your children data. Please try
            again later or contact support.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full md:w-3/4 flex flex-col mx-auto gap-12'>
      {/* Info + Create Chore */}
      <div className='w-full flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center flex-1'>
          {/* <InfoIcon size={16} strokeWidth={2} /> */}
          Welcome to your dashboard! Here you can manage your children&apos;s
          chores and rewards. Use the &quot;Create Chore&quot; button to assign
          new tasks to your children.
        </div>

        {/* CreateChore Modal */}
        <input
          type='checkbox'
          id='createChoreModalToggle'
          className='hidden peer'
        />
        <label
          htmlFor='createChoreModalToggle'
          className='bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-600 transition'
        >
          Create Chore
        </label>

        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 opacity-0 pointer-events-none transition-opacity duration-200 peer-checked:opacity-100 peer-checked:pointer-events-auto p-4 scroll-m-4'>
          <div className='bg-white dark:bg-card dark:border p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative'>
            {/* Close button */}
            <label
              htmlFor='createChoreModalToggle'
              className='absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-900 text-xl'
            >
              ✕
            </label>
            <CreateChore userId={claimsData.claims.sub} childrenData={data} />
          </div>
        </div>
      </div>

      {/* Children Section */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2 mb-4'>
          <h2 className='font-bold text-lg'>Children</h2>

          {/* AddChild Modal */}
          <input
            type='checkbox'
            id='addChildModalToggle'
            className='hidden peer'
          />
          <label
            htmlFor='addChildModalToggle'
            className='p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer flex items-center'
          >
            <PlusIcon size={20} />
          </label>

          <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 opacity-0 pointer-events-none transition-opacity duration-200 peer-checked:opacity-100 peer-checked:pointer-events-auto p-4'>
            <div className='bg-white dark:bg-card dark:border p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto relative'>
              <label
                htmlFor='addChildModalToggle'
                className='absolute top-2 right-3 cursor-pointer text-gray-500 hover:text-gray-900 text-xl'
              >
                ✕
              </label>
              <AddChild userId={claimsData.claims.sub} />
            </div>
          </div>
        </div>

        {/* Children cards side by side */}
        <div className='w-full max-w-full mx-auto'>
          <Children childrenData={data} />
        </div>
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
    </div>
  );
}
