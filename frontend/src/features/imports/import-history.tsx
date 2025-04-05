import { DataTable } from "@/components/data-table";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import {
  useImportHistory,
  useImportHistoryTable,
} from "@/features/imports/hooks/use-import-history";

export const ImportHistory = () => {
  const { importHistory, isLoading } = useImportHistory();
  const columns = useImportHistoryTable();
  if (isLoading) return <DataTableSkeleton />;
  return <DataTable columns={columns} data={importHistory!} />;
};
