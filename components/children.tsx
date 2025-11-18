import ChildCard from "./child-card";

type ChildData = {
  id: string;
  name: string;
  current_rewards: number;
  lifetime_rewards: number;
  access_key: string;
};

const Children = ({ childrenData }: { childrenData: ChildData[] }) => {
  return (
    <div className='flex flex-wrap justify-start gap-4'>
      {childrenData.map((child) => {
        return <ChildCard key={child.id} child={child} />;
      })}
    </div>
  );
};

export default Children;
