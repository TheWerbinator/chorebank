// app/child/[access_key]/page.tsx
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ChildDashboardClient from "./child-dashboard"; // We'll create this next

// This is a server-only Supabase client.
// It uses the SERVICE_ROLE key to bypass RLS, as the child is not logged in.
// Ensure these .env variables are NOT prefixed with NEXT_PUBLIC_
const serviceClient = createClient(
  process.env.SUPABASE_URL!, // Use SUPABASE_URL, not NEXT_PUBLIC_...
  process.env.SUPABASE_SERVICE_KEY!
);

// This is the main page component
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

  // 1. Find the child by the access key
  const { data: child } = await serviceClient
    .from("children")
    .select("id, name, current_rewards, lifetime_rewards, parent")
    .eq("access_key", access_key)
    .single();

  if (!child) {
    console.error("Child not found for access key:", access_key);
    notFound(); // Triggers the 404 page
  }

  // 2. Fetch their chores
  const { data: chores } = await serviceClient
    .from("chores")
    .select("*")
    .eq("assigned_child", child.id)
    .eq("isComplete", false);

  // 4. Pass all data to a Client Component for interactivity
  return (
    <div className='w-3/4 flex flex-col mx-auto gap-12'>
      <ChildDashboardClient
        child={child}
        chores={chores || []}
        access_key={access_key}
      />
    </div>
  );
};

export default ChildDashboardPage;
