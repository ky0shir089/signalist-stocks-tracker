"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import FooterLink from "@/components/FooterLink";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const SignInPage = () => {
  const [isSubmitting, startTransition] = useTransition();

  const formSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        console.log(values);
        await authClient.signIn.email(
          { ...values, callbackURL: "/" },
          {
            onError: (error) => {
              toast.error(error.error.message || "Failed to sign up");
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  }

  return (
    <>
      <h1 className="form-title">Welcome Back</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} required />
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
                  <PasswordInput placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="yellow-btn w-full mt-5"
          >
            {isSubmitting ? "Signing In" : "Sign In"}
          </Button>

          <FooterLink
            text="Don't have an Account?"
            linkText="Create An Account"
            href="/sign-up"
          />
        </form>
      </Form>
    </>
  );
};
export default SignInPage;
