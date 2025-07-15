"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { onboardingStudentSchema, OnboardingStudentSchema } from "@/schemas/onboardingStudentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, HelpCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepartment } from "@/hooks/useDepartment";
import { onboardingStudent } from "./onboardingAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingForm() {
  const { departments, isError, isLoading } = useDepartment();
  const router = useRouter();
  const form = useForm<OnboardingStudentSchema>({
    resolver: zodResolver(onboardingStudentSchema),
    defaultValues: {
      departmentId: "",
      programId: "",
      currentSemester: 1,
      currentYear: 1,
      registrationNumber: "",
      dateOfBirth: undefined,
    },
  });

  async function onSubmit(data: OnboardingStudentSchema) {
    const response = await onboardingStudent(data);

    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success("Onboarding completed successfully");
      router.push("/student");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading departments</div>;
  }

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complete Your Onboarding</CardTitle>
          <CardDescription>Please fill out the form below to complete your onboarding process.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="container mx-auto flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currentSemester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Semester</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Current Semester"
                            value={field.value === undefined || field.value === null ? "" : String(field.value)}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Current Year"
                            value={field.value === undefined || field.value === null ? "" : String(field.value)}
                            onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel>Registration No.</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </PopoverTrigger>
                            <PopoverContent>Enter your school or college ID card number. If you do not have a registration number, use your institution's ID card number</PopoverContent>
                          </Popover>
                        </div>
                        <FormControl>
                          <Input placeholder="Registration Number" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <FormLabel>Date of birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </PopoverTrigger>
                            <PopoverContent>Your date of birth is used to calculate your age.</PopoverContent>
                          </Popover>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? field.value.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Department</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </PopoverTrigger>
                          <PopoverContent>Select your department. If your department is not listed, please select the closest match.</PopoverContent>
                        </Popover>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem key={department.id} value={department.id}>
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormLabel>Program</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </PopoverTrigger>
                          <PopoverContent>Select your program. If your program is not listed, please select the closest match.</PopoverContent>
                        </Popover>
                      </div>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((department) =>
                            department.programs?.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Complete Onboarding
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
