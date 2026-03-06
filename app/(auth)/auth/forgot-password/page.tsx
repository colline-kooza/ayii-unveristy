"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRequestPasswordReset } from "@/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const requestReset = useRequestPasswordReset();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      setIsLoading(true);
      await requestReset.mutateAsync(data.email);
      toast.success("Reset Link Sent", {
        description: "Check your email for password reset instructions",
      });
      router.push("/auth/reset-password");
    } catch (error: any) {
      toast.error("Request Failed", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-[#283593]/70 hover:bg-gray-100"
            onClick={() => router.push("/auth/sign-in")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </div>

        <div className="w-full max-w-md pt-12 lg:pt-0">
          <div className="mb-6">
            <div className="flex items-center mb-4 justify-center sm:justify-start">
              <img 
                src="/ayii-logo.png" 
                alt="AYii University" 
                className="h-28 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center sm:text-left">
              Forgot <span className="text-[#283593]">Password?</span>
            </h1>
            <p className="text-sm text-gray-600 text-center sm:text-left">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="Email address"
                          className="h-12 bg-gray-50 border-gray-200 pr-12"
                          {...field}
                        />
                        <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#283593] via-black to-[#283593] hover:bg-[#283593]/85 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{" "}
              <Button
                variant="link"
                className="text-[#283593] hover:text-[#283593]/70 p-0 h-auto font-medium underline"
                onClick={() => router.push("/auth/sign-in")}
              >
                Sign in
              </Button>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">
              © 2026 AYii University. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-[#283593] via-[#283593]/90 to-[#283593]/80">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-lg px-8">
            <KeyRound className="h-24 w-24 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-lg text-white/90">
              We'll help you get back to learning in no time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
