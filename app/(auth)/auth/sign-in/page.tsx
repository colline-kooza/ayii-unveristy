"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  Shield,
  UserCheck,
  GraduationCap,
  Star,
  BookOpen,
  Users,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignIn } from "@/hooks/useAuth";

interface QuickLoginUser {
  role: string;
  email: string;
  password: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

type LoginFormValues = z.input<typeof loginSchema>;

const defaultCarouselImages = [
  {
    url: "/img1.jpeg",
    alt: "University students studying",
  },
  {
    url: "/img2.jpeg",
    alt: "Campus life",
  },
  {
    url: "/img3.jpeg",
    alt: "Lecture hall",
  },

];

const demoUsers: QuickLoginUser[] = [
  {
    role: "Admin",
    email: "admin@ayii.edu",
    password: "Admin@2025",
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
    hoverColor: "hover:bg-red-100",
  },
  {
    role: "Lecturer",
    email: "lecturer@ayii.edu",
    password: "Lecturer@2025",
    icon: UserCheck,
    color: "text-[#8B1538]",
    bgColor: "bg-rose-50",
    hoverColor: "hover:bg-rose-100",
  },
  {
    role: "Student",
    email: "student@ayii.edu",
    password: "Student@2025",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-50",
    hoverColor: "hover:bg-green-100",
  },
];

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const signIn = useSignIn();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % defaultCarouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickLogin = (user: QuickLoginUser) => {
    form.setValue("email", user.email);
    form.setValue("password", user.password);
    toast.success("Demo Credentials Filled", {
      description: `Filled ${user.role} login credentials`,
    });
  };

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      await signIn.mutateAsync({
        identifier: data.email,
        password: data.password,
      });
      toast.success("Login Successful", {
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast.error("Login Failed", {
        description: error.message || "Please check your credentials",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = () => {
    router.push("/auth/forgot-password");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Dynamic Image Carousel */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Carousel Images */}
        {defaultCarouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              style={{
                filter: "brightness(1.1) contrast(1.05)",
                minHeight: "100%",
                minWidth: "100%",
              }}
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#5A0F23]/80 via-[#5A0F23]/15 to-transparent"></div>

        <h2 className="text-4xl font-medium mb-4 drop-shadow-2xl text-start text-white max-w-lg absolute bottom-20 left-20">
          Empowering Students
          <br />
          Through Knowledge
        </h2>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end justify-center p-8">
          <div className="text-start text-white max-w-lg">
            <div className="flex justify-center space-x-2">
              {defaultCarouselImages.map((_, index) => (
                <div
                  key={index}
                  className={`w-5 h-1 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white shadow-lg"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="hidden sm:block">
          <div className="absolute top-20 left-20 text-[#8B1538]/40 animate-pulse">
            <Star
              className="h-6 w-6 animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            />
          </div>
          <div className="absolute top-32 right-24 text-[#8B1538]/40 animate-pulse">
            <BookOpen
              className="h-8 w-8 animate-bounce"
              style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
            />
          </div>
          <div className="absolute bottom-40 left-16 text-[#8B1538]/40 animate-pulse">
            <Users
              className="h-7 w-7 animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "3.5s" }}
            />
          </div>
          <div className="absolute bottom-24 right-20 text-[#8B1538]/40 animate-pulse">
            <Award
              className="h-6 w-6 animate-bounce"
              style={{ animationDelay: "1.5s", animationDuration: "2s" }}
            />
          </div>
          <div className="absolute top-1/2 left-12 text-[#8B1538]/40 animate-pulse">
            <GraduationCap
              className="h-5 w-5 animate-bounce"
              style={{ animationDelay: "2s", animationDuration: "4s" }}
            />
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-[#8B1538]/70 hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm"
            onClick={handleBackToHome}
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>

        <div className="w-full max-w-sm sm:max-w-md pt-2 lg:pt-0">
          {/* Logo and Header */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center mb-4 justify-center sm:justify-start">
              <img 
                src="/ayii-logo.png" 
                alt="AYii University" 
                className="h-28 w-auto"
              />
            </div>
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 text-center sm:text-left">
              AYii University <span className="text-[#8B1538]">Portal</span>
            </h1>
            <p className="text-sm text-center sm:text-left bg-gradient-to-r from-[#8B1538] via-[#C41E3A] to-[#8B1538] bg-clip-text text-transparent">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-3 sm:space-y-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4"
              >
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
                            className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-[#8B1538] focus:ring-[#8B1538] rounded-lg transition-colors duration-200 text-sm pr-12"
                            {...field}
                          />
                          <Mail className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="h-11 sm:h-12 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-500 focus:border-[#8B1538] focus:ring-[#8B1538] rounded-lg pr-16 sm:pr-20 transition-colors duration-200 text-sm"
                            {...field}
                          />
                          <Lock className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                {/* Remember Me and Forgot Password */}
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 sm:space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-300 data-[state=checked]:bg-[#8B1538] data-[state=checked]:border-[#8B1538] mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-600 text-xs sm:text-sm font-normal cursor-pointer">
                            Remember me
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    variant="link"
                    className="text-[#8B1538] hover:text-[#8B1538]/55 p-0 h-auto font-normal text-xs sm:text-sm justify-start sm:justify-center ml-0"
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-[#5A0F23] via-[#8B1538] to-[#5A0F23] hover:from-[#8B1538] hover:to-[#8B1538] text-white font-semibold rounded-sm shadow-lg transition-all duration-200 text-sm sm:text-sm"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            {/* Quick Login Buttons */}
            <div className="pt-2">
              <p className="text-center text-gray-500 text-xs sm:text-sm mb-3">
                Quick Demo Login
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {demoUsers.map((user, index) => {
                  const IconComponent = user.icon;
                  return (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      className={`h-14 sm:h-14 flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 ${user.bgColor} ${user.hoverColor} border-gray-200 hover:border-gray-300 hover:shadow-md`}
                      onClick={() => handleQuickLogin(user)}
                    >
                      <IconComponent
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${user.color} mb-1`}
                      />
                      <span className={`text-xs font-medium ${user.color}`}>
                        {user.role}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-400 text-xs">
              © 2026 AYii University. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Background */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B1538]/5 via-rose-50 to-[#8B1538]/10"></div>
      </div>
    </div>
  );
}
