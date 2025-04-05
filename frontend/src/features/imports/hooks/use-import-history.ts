import { useQuery } from "@tanstack/react-query";
import { importHistoryImportHistoryGet } from "@/client/sdk.gen";
import { createColumnHelper } from "@tanstack/react-table";

export const useImportHistory = () => {
  const { data: importHistory, isLoading } = useQuery({
    queryKey: ["import-history"],
    queryFn: async () => await importHistoryImportHistoryGet(),
    select: ({ data }) => data,
  });

  return {
    importHistory,
    isLoading,
  };
};

type ImportHistory = NonNullable<
  ReturnType<typeof useImportHistory>["importHistory"]
>;

const columnHelper = createColumnHelper<ImportHistory[number]>();

export const useImportHistoryTable = () => {
  return [
    columnHelper.accessor("at", {
      header: "At",
    }),
    columnHelper.accessor("fileName", {
      header: "File Name",
    }),
    columnHelper.accessor("imported", {
      header: "Imported rows",
      cell: (info) => `${info.getValue()} rows`,
    }),
  ];
};
