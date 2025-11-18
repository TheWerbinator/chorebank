// app/dashboard/ApprovalList.tsx
"use client";

import { useTransition } from "react";
import { approveChore, rejectChore } from "@/lib/parent_actions";
import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ApprovalList = ({
  userId,
  chores,
}: {
  userId: string;
  chores: {
    id: string;
    title: string;
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
      <div className='flex flex-col w-full'>
        <h2 className='font-bold text-lg mb-2'>Approval List</h2>
        <div className='w-fit'>
          <div className='bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center'>
            <InfoIcon size={16} strokeWidth={2} />
            There are no chores to approve at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-wrap gap-4 w-full'>
      <h2 className='w-full font-bold text-lg mb-2'>Approval List</h2>
      {chores.map((chore) => (
        <Card
          key={chore.id}
          className='flex-1 min-w-[200px] sm:max-w-[30%] md:max-w-[22%]'
        >
          <CardHeader>
            <CardTitle className='text-sm'>{chore.title}</CardTitle>
            <p className='text-xs text-gray-500'>
              {typeof chore.assigned_child === "string"
                ? chore.assigned_child
                : chore.assigned_child.name}
            </p>
          </CardHeader>
          <CardContent className='flex justify-between gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onApprove(chore.id, userId)}
              disabled={isPending}
            >
              {isPending ? "..." : "Approve"}
            </Button>
            <Button
              size='sm'
              onClick={() => onReject(chore.id, userId)}
              disabled={isPending}
            >
              {isPending ? "..." : "Reject"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApprovalList;
