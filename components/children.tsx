import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CopyButton } from "./ui/shadcn-io/copy-button";

const Children = ({
  childrenData,
}: {
  childrenData: {
    id: string;
    name: string;
    current_rewards: number;
    lifetime_rewards: number;
    access_key: string;
  }[];
}) => {
  return (
    <div className='flex flex-wrap gap-2 justify-start'>
      {childrenData.map((child) => (
        <Card key={child.id} className='w-full sm:max-w-md'>
          <CardHeader>
            <CardTitle>{child.name}</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>Child ID: {child.id}</p>
            <p className='text-sm'>Unspent Rewards: {child.current_rewards}</p>
            <p className='text-sm'>
              Lifetime Earnings: {child.lifetime_rewards}
            </p>
            <div className='flex gap-2 items-center w-fit my-2 p-2 rounded-xl border'>
              <p className='text-sm'>Copy Access Link</p>
              <CopyButton
                content={`localhost:3000/child/${child.access_key}`}
                // content={`https://chorebank.vercel.app/child/${child.access_key}`}
                size='sm'
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Children;
