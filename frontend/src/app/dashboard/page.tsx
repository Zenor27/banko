import { DashboardView } from "@/features/dashboard/dashboard-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banko | Dashboard",
  description: "Track your personal finances with insights and analytics",
};

export default function DashboardPage() {
  return <DashboardView />;
}
