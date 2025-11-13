import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InfoIcon, MessageCircleWarningIcon } from "lucide-react";
import CreateChore from "@/components/create-chore";
import AddChild from "@/components/add-child";
import Children from "@/components/children";
import ApprovalList from "@/components/approval-list";
// import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

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
    .select("id, title, description, reward, assigned_child ( name )") // Also get child's name!
    .eq("status", "pending_approval");
  if (childrenError || pendingChoresError) {
    console.error("Error fetching children:", childrenError);
    return (
      <div className='w-full flex flex-col gap-12'>
        <div className='w-full'>
          <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
            <MessageCircleWarningIcon size='16' strokeWidth={2} />
            There has been an error fetching your children data. Please try
            again later or contact support.
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className='w-3/4 flex flex-col mx-auto gap-12'>
        <div className='w-full'>
          <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
            <InfoIcon size='16' strokeWidth={2} />
            This is a protected page that you can only see as an authenticated
            user
          </div>
        </div>

        <div className='flex flex-col'>
          <h2 className='font-bold text-lg mb-4'>Children</h2>
          <Children childrenData={data} />
        </div>
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
        <div className='flex flex-col'>
          <h2 className='font-bold text-lg mb-4'>Actions</h2>
          <div className='flex flex-wrap gap-4'>
            <CreateChore userId={claimsData.claims.sub} childrenData={data} />
            <AddChild userId={claimsData.claims.sub} />
          </div>
        </div>
        {/* <div className='flex flex-col gap-2 items-start w-full'>
          <h2 className='font-bold text-2xl mb-4'>Your user details</h2>
          <pre className='text-xs font-mono p-3 rounded border max-h-32 overflow-auto w-full'>
            {JSON.stringify(claimsData.claims, null, 2)}
          </pre>
        </div> */}
        {/* <div>
        <h2 className='font-bold text-2xl mb-4'>Next steps</h2>
        <FetchDataSteps />
      </div> */}
      </div>
    );
  }
}
