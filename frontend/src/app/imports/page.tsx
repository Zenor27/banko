import { ImportView } from "@/features/imports/import-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banko | Imports",
  description: "Import your transactions from CSV files",
};

export default function ImportsPage() {
  return <ImportView />;
}
