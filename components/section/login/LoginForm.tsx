"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Turnstile } from "@marsidev/react-turnstile";
import { loginSchema, LoginSchema } from "@/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { login } from "./loginAction";
import { toast } from "sonner";
import { getDashboardPath } from "@/utils/functions/getDashboardPath";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [captchaToken, setCaptchaToken] = useState("");
  const router = useRouter();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    const response = await login(data, captchaToken);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Logged in successfully");
      const dashboardPath = getDashboardPath(response.message);
      router.push(dashboardPath);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="container mx-auto flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Email" type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
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
          Login
        </Button>
      </form>
    </Form>
  );
}
