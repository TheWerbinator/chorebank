"use client";
import { Button } from "./ui/button";

const handleSubmitChore = () => {
  console.log("put handler for submitting chores here");
};

const CreateChore = () => {
  return (
    <div className='max-w-4xl'>
      <h2>Create a Chore</h2>
      <Button onClick={handleSubmitChore}>Submit</Button>
    </div>
  );
};

export default CreateChore;
