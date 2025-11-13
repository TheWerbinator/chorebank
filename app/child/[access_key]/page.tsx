// app/child/[access_key]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ChildDashboardClient from "../../../components/child-dashboard";

// This is a server-only Supabase client.
// It uses the SERVICE_ROLE key to bypass RLS, as the child is not logged in.
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // Use SUPABASE_URL, not NEXT_PUBLIC_...
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ChildDashboardPage = async ({
  params,
}: {
  params: { access_key: string };
}) => {
  const { access_key } = await params;

  if (!access_key) {
    console.error("No access key provided");
    notFound(); // Triggers the 404 page
  }

  const { data: child } = await serviceClient
    .from("children")
    .select("id, name, current_rewards, lifetime_rewards, parent")
    .eq("access_key", access_key)
    .single();

  if (!child) {
    console.error("Child not found for access key:", access_key);
    notFound(); // Triggers the 404 page
  }

  const { data: choresToDo } = await serviceClient
    .from("chores")
    .select("*")
    .eq("assigned_child", child.id)
    .in("status", ["assigned", "rejected"]);

  const { data: choresPending } = await serviceClient
    .from("chores")
    .select("*")
    .eq("assigned_child", child.id)
    .eq("status", "pending_approval");

  return (
    <div className='w-3/4 flex flex-col mx-auto gap-12'>
      <ChildDashboardClient
        child={child}
        choresToDo={choresToDo || []}
        choresPending={choresPending || []}
        access_key={access_key}
      />
    </div>
  );
};

export default ChildDashboardPage;
