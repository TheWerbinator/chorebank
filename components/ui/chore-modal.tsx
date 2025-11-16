"use client";

import { useEffect } from "react";

export default function CreateChoreModalWrapper({
  userId,
  childrenData,
}: {
  userId: string;
  childrenData: Array<{ id: string; name: string }>;
}) {
  useEffect(() => {
    const form = document.getElementById("form-create-chore") as HTMLFormElement | null;
    const modalToggle = document.getElementById("createChoreModalToggle") as HTMLInputElement | null;

    if (form && modalToggle) {
      const handler = () => setTimeout(() => { modalToggle.checked = false }, 100);
      form.addEventListener("submit", handler);
      return () => form.removeEventListener("submit", handler);
    }
  }, []);

  const CreateChore = require("@/components/create-chore").default;

  return <CreateChore userId={userId} childrenData={childrenData} />;
}
