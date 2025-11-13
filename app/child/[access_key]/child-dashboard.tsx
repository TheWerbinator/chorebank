"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

const ChildDashboardClient = ({
  child,
  chores,
  access_key,
}: {
  child: {
    id: string;
    name: string;
    current_rewards: number;
    lifetime_rewards: number;
    parent: string;
  };
  chores: Array<{
    id: string;
    title: string;
    description: string;
    reward: number;
    child: string;
  }>;
  access_key: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteChore = async (choreId: string, reward: number) => {
    setIsLoading(true);
    await fetch("/api/child/complete-chore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: access_key,
        chore_id: choreId,
        reward: reward,
      }),
    });
    // Refresh the page data
    window.location.reload();
  };

  return (
    <div className='w-full flex flex-col gap-4 my-8'>
      <h1 className='font-bold text-xl mb-4'>Hi, {child.name}!</h1>
      <div className='flex justify-evenly mb-4'>
        <p>Lifetime Awards Earned: ${child.lifetime_rewards}</p>
        <p>Awards Balance: ${child.current_rewards}</p>
      </div>

      <h2 className='font-bold text-lg'>Your Chores:</h2>
      {chores.map((chore) => (
        <div className='flex flex-wrap gap-2 justify-start' key={chore.id}>
          <Card className='w-full sm:max-w-md p-4'>
            <CardHeader>
              <CardTitle>{chore.title}</CardTitle>
              <CardDescription>{chore.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-md'>Reward: ${chore.reward}</p>

              <Button
                onClick={() => handleCompleteChore(chore.id, chore.reward)}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Mark as Done!"}
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
export default ChildDashboardClient;
