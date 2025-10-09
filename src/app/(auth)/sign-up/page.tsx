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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import FooterLink from "@/components/FooterLink";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { inngest } from "@/lib/inngest/client";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();

  const formSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    country: z.string().min(2),
    investmentGoals: z.string().min(1),
    riskTolerance: z.string().min(1),
    preferredIndustry: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      country: "ID",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Technology",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const response = await authClient.signUp.email(
        { ...values, callbackURL: "/" },
        {
          onSuccess: () => {
            toast.success("Sign up successful");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to sign up");
          },
        }
      );

      if (response) {
        await inngest.send({
          name: "app/user.created",
          data: {
            ...values,
          },
        });
      }
    });
  }

  return (
    <>
      <h1 className="form-title">Sign Up and Personalize</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <CountrySelectField
            name="country"
            label="country"
            control={form.control}
          />

          <FormField
            control={form.control}
            name="investmentGoals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investment Goals</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an Investment Goals" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {INVESTMENT_GOALS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.value}
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
            name="riskTolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Tolerance</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your Risk Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RISK_TOLERANCE_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.value}
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
            name="preferredIndustry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Industry</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your Preferred Industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PREFERRED_INDUSTRIES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSubmitting}
            className="yellow-btn w-full mt-5"
          >
            {isSubmitting ? "Creating Account" : "Start Your Investing Journey"}
          </Button>

          <FooterLink
            text="Already have an Account?"
            linkText="Sign In"
            href="/sign-in"
          />
        </form>
      </Form>
    </>
  );
};
export default SignUpPage;
