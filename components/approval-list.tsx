// app/dashboard/ApprovalList.tsx
"use client";

import { useTransition } from "react";
import { approveChore, rejectChore } from "@/lib/parent_actions"; // Import the actions
import { InfoIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ApprovalList = ({
  userId,
  chores,
}: {
  userId: string;
  chores: {
    id: string;
    title: string;
    description: string;
    assigned_child: { name: string } | string;
  }[];
}) => {
  const [isPending, startTransition] = useTransition();

  const onApprove = (id: string, userId: string) => {
    startTransition(async () => {
      await approveChore(id, userId).then(() => window.location.reload());
    });
  };

  const onReject = (id: string, userId: string) => {
    startTransition(async () => {
      await rejectChore(id, userId).then(() => window.location.reload());
    });
  };

  if (chores.length === 0) {
    return (
      <div className='flex flex-col'>
        <h2 className='font-bold text-lg'>Approval List</h2>
        <div className='w-fit'>
          <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
            <InfoIcon size='16' strokeWidth={2} />
            There are no chores to approve at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <h2 className='font-bold text-lg'>Approval List</h2>
      {chores.map((chore) => (
        <Card key={chore.id} className='w-fit'>
          <CardHeader>
            <CardTitle>{chore.title}</CardTitle>
            <CardDescription>
              (
              {typeof chore.assigned_child === "string"
                ? chore.assigned_child
                : chore.assigned_child.name}
              )
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='mb-4'>{chore.description}</p>
            <div className='flex gap-4'>
              <Button
                variant={"outline"}
                onClick={() => onApprove(chore.id, userId)}
                disabled={isPending}
              >
                {isPending ? "..." : "Approve"}
              </Button>
              <Button
                variant={"destructive"}
                onClick={() => onReject(chore.id, userId)}
                disabled={isPending}
              >
                {isPending ? "..." : "Reject"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApprovalList;
