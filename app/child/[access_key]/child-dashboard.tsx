"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

const ChildDashboardClient = ({
  child,
  choresToDo,
  choresPending,
  access_key,
}: {
  child: {
    id: string;
    name: string;
    current_rewards: number;
    lifetime_rewards: number;
    parent: string;
  };
  choresToDo: Array<{
    id: string;
    title: string;
    description: string;
    reward: number;
    child: string;
  }>;
  choresPending: Array<{
    id: string;
    title: string;
    description: string;
    reward: number;
    child: string;
  }>;
  access_key: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteChore = async (choreId: string) => {
    setIsLoading(true);
    await fetch("/api/child/complete-chore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: access_key,
        chore_id: choreId,
      }),
    });

    window.location.reload();
  };

  return (
    <div className='w-full flex flex-col gap-4 my-8'>
      <h1 className='font-bold text-xl mb-4'>Hi, {child.name}!</h1>
      <div className='flex justify-start gap-8 mb-4'>
        <p>Lifetime Awards Earned: ${child.lifetime_rewards}</p>
        <p>Awards Balance: ${child.current_rewards}</p>
      </div>

      <h2 className='font-bold text-lg'>Your Chores:</h2>
      <h3 className='font-bold text-md'>Chores To Do:</h3>

      {choresToDo.length === 0 ? (
        <div className='w-full'>
          <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
            <InfoIcon size='16' strokeWidth={2} />
            There are no chores to do at the moment.
          </div>
        </div>
      ) : (
        choresToDo.map((chore) => (
          <div className='flex flex-wrap gap-2 justify-start' key={chore.id}>
            <Card className='w-full sm:max-w-md p-4'>
              <CardHeader>
                <CardTitle>{chore.title}</CardTitle>
                <CardDescription>{chore.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-md'>Reward: ${chore.reward}</p>

                <Button
                  onClick={() => handleCompleteChore(chore.id)}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Mark as Done!"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ))
      )}

      <h3 className='font-bold text-md'>Chores Pending Approval:</h3>
      {choresPending.length === 0 ? (
        <div className='w-full'>
          <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
            <InfoIcon size='16' strokeWidth={2} />
            There are no chores pending approval at the moment.
          </div>
        </div>
      ) : (
        choresPending.map((chore) => (
          <div className='flex flex-wrap gap-2 justify-start' key={chore.id}>
            <Card className='w-full sm:max-w-md p-4'>
              <CardHeader>
                <CardTitle>{chore.title}</CardTitle>
                <CardDescription>{chore.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-md'>Reward: ${chore.reward}</p>
              </CardContent>
            </Card>
          </div>
        ))
      )}
    </div>
  );
};
export default ChildDashboardClient;
