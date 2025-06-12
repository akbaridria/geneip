import type React from "react";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge";

export type StatusType =
  | "accepted"
  | "cancelled"
  | "expired"
  | "active"
  | "pending"
  | "draft";

const statusConfig = {
  accepted: {
    variant: "secondary" as const,
    className:
      "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500",
    label: "Accepted",
  },
  cancelled: {
    variant: "destructive" as const,
    className: "bg-red-500 hover:bg-red-600 text-white border-red-500",
    label: "Cancelled",
  },
  expired: {
    variant: "outline" as const,
    className: "bg-slate-500 hover:bg-slate-600 text-white border-slate-500",
    label: "Expired",
  },
  active: {
    variant: "secondary" as const,
    className: "bg-blue-500 hover:bg-blue-600 text-white border-blue-500",
    label: "Active",
  },
  pending: {
    variant: "secondary" as const,
    className: "bg-amber-500 hover:bg-amber-600 text-white border-amber-500",
    label: "Pending",
  },
  draft: {
    variant: "outline" as const,
    className:
      "bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300",
    label: "Draft",
  },
} as const;

export function getStatusBadgeProps(status: string): VariantProps<
  typeof badgeVariants
> & {
  className?: string;
  children?: React.ReactNode;
} {
  const normalizedStatus = status.toLowerCase() as StatusType;
  const config = statusConfig[normalizedStatus];

  if (!config) {
    return {
      variant: "outline",
      className: "bg-slate-100 text-slate-600 border-slate-300",
      children: status,
    };
  }

  return {
    variant: config.variant,
    className: config.className,
    children: config.label,
  };
}
