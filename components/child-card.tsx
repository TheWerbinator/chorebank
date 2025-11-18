"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CopyButton } from "./ui/shadcn-io/copy-button";
import { Eye, EyeOff } from "lucide-react";

type ChildData = {
  id: string;
  name: string;
  current_rewards: number;
  lifetime_rewards: number;
  access_key: string;
};

type ChildCardProps = {
  child: ChildData;
};

export default function ChildCard({ child }: ChildCardProps) {
  const [showId, setShowId] = useState(false);

  return (
    <Card className='flex-shrink-0 w-full sm:w-[45%] lg:w-[30%]'>
      <CardHeader>
        <CardTitle>{child.name}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-2 text-sm'>
          <span>Child ID: {showId ? child.id : "••••••••"}</span>
          <button
            type='button'
            onMouseDown={() => setShowId(true)}
            onMouseUp={() => setShowId(false)}
            onMouseLeave={() => setShowId(false)}
            className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors'
          >
            {showId ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <p className='text-sm'>Unspent Rewards: {child.current_rewards}</p>
        <p className='text-sm'>Lifetime Earnings: {child.lifetime_rewards}</p>

        <div className='flex gap-2 items-center w-fit my-2 p-2 rounded-xl border'>
          <p className='text-sm'>Copy Access Link</p>

          <CopyButton
            //! For local development
            // content={`localhost:3000/child/${child.access_key}`}
            content={`https://chorebank.vercel.app/child/${child.access_key}`}
            size='sm'
          />
        </div>

        <p className='text-xs italic text-foreground/70 dark:text-foreground-dark/70 mt-1'>
          A child does not need to create an account — they can use this link to
          automatically get their own dashboard.
        </p>
      </CardContent>
    </Card>
  );
}
