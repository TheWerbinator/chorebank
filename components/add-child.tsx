"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  childName: z
    .string()
    .min(3, "Child name must be at least 3 characters.")
    .max(32, "Child name must be at most 32 characters."),
});

const AddChild = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { data: supabaseData, error } = await supabase
      .from("children")
      .insert({
        name: data.childName,
        parent: userId,
      })
      .select();
    if (error) {
      console.error(supabaseData, error);
      toast("Failed to create child", {
        description: error.message,
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
      setLoading(false);
      return;
    }
    toast("You submitted the following values:", {
      description: (
        <pre className='bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4'>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
    router.replace("/dashboard");
    router.refresh();
    setLoading(false);
  };
  return (
    <Card className='w-full h-fit sm:max-w-md shadow-none border-none'>
      <CardHeader>
        <CardTitle>Add Your Child</CardTitle>
        <CardDescription>Think of all the chores they can do!</CardDescription>
      </CardHeader>
      <CardContent>
        <form id='form-create-child' onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='childName'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-childName'>Child Name</FieldLabel>
                  <Input
                    {...field}
                    id='form-childName'
                    aria-invalid={fieldState.invalid}
                    placeholder='Enter child name.'
                    autoComplete='off'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation='horizontal'>
          <Button type='button' variant='outline' onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type='submit' form='form-create-child' disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default AddChild;
