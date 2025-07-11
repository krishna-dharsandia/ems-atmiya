"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramSchema, programSchema } from "@/schemas/program";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { fetcher } from "@/fetcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProgram } from "./createProgramAction";
import { toast } from "sonner";
import { useTransition } from "react";

export function ProgramForm() {
  const { data, isLoading } = useSWR<{ name: string; id: string }[]>("/api/department", fetcher);
  const [loading, startTransition] = useTransition();
  const form = useForm<z.infer<typeof programSchema>>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      departmentId: "",
    },
  });

  async function onSubmit(data: ProgramSchema) {
    startTransition(async () => {
      const response = await createProgram(data);

      if (response.success) {
        toast.success("Program created successfully!");
        form.reset();
      } else {
        toast.error(response.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          disabled={loading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter program name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="departmentId"
          disabled={loading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department ID</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!isLoading && data ? (
                    data.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      Loading departments...
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Program..." : "Create Program"}
        </Button>
      </form>
    </Form>
  );
}
