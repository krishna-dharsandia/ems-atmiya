"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterStudentSchema, registerStudentSchema } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerStudent } from "./registerAction";
import { Button } from "@/components/ui/button";
import { registerWithGoogleAction } from "./registerWithGoogleAction";

export default function RegisterForm() {
  const [captchaToken, setCaptchaToken] = useState("");
  const form = useForm({
    resolver: zodResolver(registerStudentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterStudentSchema) {
    const response = await registerStudent(data, captchaToken);

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Registration successful! Please check your email for verification.");
    }
  }

  async function handleContinueWithGoogle() {
    const response = await registerWithGoogleAction();

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Redirecting to Google...");
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="container mx-auto flex flex-col gap-4">
          <FormField
            // disabled={form.formState.isSubmitting}
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // disabled={form.formState.isSubmitting}
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Last Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // disabled={form.formState.isSubmitting}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            // disabled={form.formState.isSubmitting}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Turnstile
            siteKey="0x4AAAAAABeFnZ4TqqZ1FHIk"
            onSuccess={(token) => {
              setCaptchaToken(token);
            }}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            Register
          </Button>
        </form>
      </Form>

      <Button onClick={handleContinueWithGoogle}>Continue with Google</Button>
    </>
  );
}
