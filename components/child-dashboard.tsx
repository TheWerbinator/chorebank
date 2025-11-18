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
  const [expandedChores, setExpandedChores] = useState<string[]>([]);

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

  const toggleDescription = (choreId: string) => {
    setExpandedChores((prev) =>
      prev.includes(choreId)
        ? prev.filter((id) => id !== choreId)
        : [...prev, choreId]
    );
  };

  const renderChoreCard = (chore: typeof choresToDo[0]) => {
    const isExpanded = expandedChores.includes(chore.id);
    const shouldTruncate = chore.description.length > 50 && !isExpanded;
    const displayedDescription = shouldTruncate
      ? `${chore.description.slice(0, 50)}...`
      : chore.description;

    return (
      <Card key={chore.id} className="w-full p-4">
        <CardHeader>
          <CardTitle>{chore.title}</CardTitle>
          <CardDescription className="break-words whitespace-pre-wrap">
              {displayedDescription}
              {chore.description.length > 50 && (
                <Button
                  variant="link"
                  size="sm"
                  className="ml-1 p-0"
                  onClick={() => toggleDescription(chore.id)}
                >
                  {isExpanded ? "Show less" : "See full description"}
                </Button>
              )}
            </CardDescription>

        </CardHeader>
        <CardContent>
          <p className="text-md">Reward: ${chore.reward}</p>
          {choresToDo.find((c) => c.id === chore.id) && (
            <Button
              onClick={() => handleCompleteChore(chore.id)}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Mark as Done!"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 my-8">
      <h1 className="font-bold text-xl mb-4">Hi, {child.name}!</h1>
      <div className="flex justify-start gap-8 mb-4">
        <p>Lifetime Awards Earned: ${child.lifetime_rewards}</p>
        <p>Awards Balance: ${child.current_rewards}</p>
      </div>
      <h2 className="font-bold text-md">Chores To Do:</h2>

      {choresToDo.length === 0 ? (
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size={16} strokeWidth={2} />
            There are no chores to do at the moment.
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {choresToDo.map(renderChoreCard)}
        </div>
      )}

      <h3 className="font-bold text-md">Chores Pending Approval:</h3>
      {choresPending.length === 0 ? (
        <div className="w-full">
          <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
            <InfoIcon size={16} strokeWidth={2} />
            There are no chores pending approval at the moment.
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {choresPending.map(renderChoreCard)}
        </div>
      )}
    </div>
  );
};

export default ChildDashboardClient;
