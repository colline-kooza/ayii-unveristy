"use client";

import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, trend, icon: Icon, iconColor = "text-primary" }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-black">{value}</div>
        {change && (
          <p className={`text-xs mt-1 ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
