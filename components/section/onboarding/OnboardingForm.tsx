"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { useState, useEffect, useCallback } from "react";
import { onboardingStudentSchema, OnboardingStudentSchema } from "@/schemas/onboardingStudentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle, Loader } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDepartment } from "@/hooks/useDepartment";
import { onboardingStudent } from "./onboardingAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function OnboardingForm() {
  const { departments, isError, isLoading } = useDepartment();
  const router = useRouter();
  const [studentType, setStudentType] = useState<"atmiya" | "other">("atmiya"); const [universityQuery, setUniversityQuery] = useState("");
  const [universityOptions, setUniversityOptions] = useState([]);
  const [_, setShowDropdown] = useState(false);
  const [loadingUniversity, setLoadingUniversity] = useState(false);
  const [universitySelected, setUniversitySelected] = useState(false);

  // Debounced search function
  const searchUniversities = useCallback(async (query: string) => {
    if (query.length > 2) {
      setLoadingUniversity(true);
      try {
        const res = await fetch(`/api/colleges?keyword=${encodeURIComponent(query)}`);
        const result = await res.json();
        setUniversityOptions(result.colleges);
      } catch {
        setUniversityOptions([]);
      }
      setLoadingUniversity(false);
    } else {
      setUniversityOptions([]);
    }
  }, []);

  // Effect to handle university search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (universityQuery && !universitySelected) {
        searchUniversities(universityQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [universityQuery, universitySelected, searchUniversities]);
  
  const form = useForm<OnboardingStudentSchema>({
    resolver: zodResolver(onboardingStudentSchema),
    defaultValues: {
      studentType: "atmiya",
      departmentId: "",
      programId: "",
      currentSemester: undefined,
      currentYear: undefined,
      registrationNumber: "",
      universityName: "",
    } as any,
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

  // Sync form studentType with tab
  function handleTabChange(value: string) {
    setStudentType(value as "atmiya" | "other");
    form.reset({
      ...form.getValues(),
      studentType: value as any,
      ...(value === "atmiya"
        ? { departmentId: "", programId: "", registrationNumber: "", universityName: "" }
        : { departmentId: undefined, programId: undefined, registrationNumber: undefined, universityName: "" }),
    }); setUniversityQuery("");
    setUniversityOptions([]);
    setUniversitySelected(false);
    setShowDropdown(false);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <Skeleton className="h-8 w-1/2 mx-auto mb-2" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-40 mx-auto mt-4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading departments</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complete Your Onboarding</CardTitle>
          <CardDescription>Please fill out the form below to complete your onboarding process.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={studentType} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full flex justify-center mb-6">
              <TabsTrigger value="atmiya">Atmiya University</TabsTrigger>
              <TabsTrigger value="other">Other University</TabsTrigger>
            </TabsList>
            <TabsContent value="atmiya">
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
                              onChange={e => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                field.onChange(val && val > 0 ? val : undefined);
                              }}
                              min={1}
                              max={10}
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
                              onChange={e => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                field.onChange(val && val > 0 ? val : undefined);
                              }}
                              min={1}
                              max={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                            <PopoverContent>Enter your school or college ID card number. If you do not have a registration number, use your institution&apos;s ID card number</PopoverContent>
                          </Popover>
                        </div>
                        <FormControl className="w-full">
                          <Input placeholder="Registration Number" {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                          <FormControl>
                            <SelectTrigger className="w-full">
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
                            <SelectTrigger className="w-full">
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
                    {form.formState.isSubmitting ?
                      <Loader className="mr-2 h-4 w-4 animate-spin" /> :
                      "Submit"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="other">
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
                              onChange={e => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                field.onChange(val && val > 0 ? val : undefined);
                              }}
                              min={1}
                              max={10}
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
                              onChange={e => {
                                const val = e.target.value === "" ? undefined : Number(e.target.value);
                                field.onChange(val && val > 0 ? val : undefined);
                              }}
                              min={1}
                              max={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="universityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>University Name</FormLabel>
                        <FormControl>
                          <Command className="w-full border rounded-md">
                            <CommandInput
                              placeholder="Type to search university..."
                              value={universityQuery} onValueChange={(val) => {
                                setUniversityQuery(val);
                                field.onChange(val);
                                if (universitySelected && val !== universityQuery) {
                                  setUniversitySelected(false);
                                }
                              }}
                              autoComplete="off"
                            />
                            <CommandList className="max-h-60 overflow-auto">
                              {loadingUniversity && (
                                <div className="px-3 py-2 text-muted-foreground flex items-center gap-2">
                                  <Loader className="h-4 w-4 animate-spin" /> Searching...
                                </div>
                              )}
                              {!loadingUniversity && universityOptions.length === 0 && universityQuery.length > 2 && !universitySelected && (
                                <CommandEmpty>No results found</CommandEmpty>
                              )}
                              {universityOptions.map((item, idx) => (
                                <CommandItem
                                  key={idx}
                                  value={item} onSelect={() => {
                                    field.onChange(item);
                                    setUniversityQuery(item);
                                    setUniversityOptions([]); // Clear options after selection
                                    setUniversitySelected(true);
                                  }}
                                  className="flex flex-col items-start px-3 py-2 cursor-pointer"
                                >
                                  <span className="font-medium">{item}</span>
                                </CommandItem>
                              ))}
                            </CommandList>
                          </Command>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ?
                      <Loader className="mr-2 h-4 w-4 animate-spin" /> :
                      "Submit"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
