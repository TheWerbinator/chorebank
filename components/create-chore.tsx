"use client";
import { useState } from "react";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Chore title must be at least 5 characters.")
    .max(32, "Chore title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
  reward: z.number(),
  child: z.string(),
});

const CreateChore = ({
  userId,
  childrenData,
}: {
  userId: string;
  childrenData: Array<{ id: string; name: string }>;
}) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      reward: 0,
      child: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { data: supabaseData, error } = await supabase
      .from("chores")
      .insert({
        title: data.title,
        description: data.description,
        reward: data.reward,
        assigned_child: data.child,
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
    setLoading(false);
  };
  return (
    <div className='max-w-4xl'>
      <Card className='w-full sm:max-w-md'>
        <CardHeader>
          <CardTitle>Create A Chore</CardTitle>
          <CardDescription>
            All work and no play makes Jack a dull boy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id='form-create-chore' onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name='title'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-title'>Chore Title</FieldLabel>
                    <Input
                      {...field}
                      id='form-title'
                      aria-invalid={fieldState.invalid}
                      placeholder='Clean your room...'
                      autoComplete='off'
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='reward'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-reward'>Reward</FieldLabel>
                    <div className='flex gap-1 items-center'>
                      <span>$</span>
                      <Input
                        {...field}
                        id='form-reward'
                        aria-invalid={fieldState.invalid}
                        type='number'
                        autoComplete='off'
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  </Field>
                )}
              />
              <Controller
                name='description'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-description'>
                      Description
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
                        id='form-description'
                        placeholder="...and don't just shove everything under the bed."
                        rows={6}
                        className='min-h-24 resize-none'
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon align='block-end'>
                        <InputGroupText className='tabular-nums'>
                          {field.value.length}/100 characters
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldDescription>
                      It may be helpful to include steps to complete the chore.
                      Be creative!
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name='child'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor='form-child'>Assigned Child</FieldLabel>
                    <FieldDescription>
                      Select the child to assign this chore to.
                    </FieldDescription>
                    <Select
                      {...field}
                      onValueChange={(val) => field.onChange(val)}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectTrigger id='form-child' className='w-[180px]'>
                        <SelectValue
                          placeholder={
                            childrenData.length === 0
                              ? "No children created yet"
                              : "Select a child"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {childrenData.map((child) => (
                            <SelectItem key={child.id} value={child.id}>
                              {child.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type='submit' form='form-create-chore' disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateChore;
