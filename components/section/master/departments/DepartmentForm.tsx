import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentSchema, departmentSchema } from "@/schemas/department";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTransition } from "react";
import { createDepartment } from "./createDepartmentAction";

export function DepartmentForm() {
  const [loading, startTransition] = useTransition();
  const form = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      faculty: "",
    },
  });

  async function onSubmit(data: DepartmentSchema) {
    startTransition(async () => {
      const response = await createDepartment(data);

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
              <FormLabel>Department Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter department name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="faculty"
          disabled={loading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter faculty name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {!loading ? "Create Department" : "Creating Department..."}
        </Button>
      </form>
    </Form>
  );
}
