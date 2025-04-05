import { useMutation } from "@tanstack/react-query";
import {
  getImportInfoImportInfoPost,
  importTransactionsImportTransactionsPost,
} from "@/client/sdk.gen";
import { useState } from "react";
import { TransactionKey } from "@/features/imports/types";

export const useImportCSV = () => {
  const [csv, setCSV] = useState<File | null>(null);

  const {
    data: importInfo,
    isPending: isFetchingInfo,
    mutate: fetchHeaders,
    reset: resetHeaders,
  } = useMutation({
    mutationFn: async (file: File) =>
      await getImportInfoImportInfoPost({ body: { file } }),
  });

  const {
    isPending: isImporting,
    mutate: importCSV,
    reset: resetImport,
  } = useMutation({
    mutationFn: async (mapping: Record<TransactionKey, string[]>) => {
      await importTransactionsImportTransactionsPost({
        body: { file: csv!, form_mapping: JSON.stringify(mapping) },
        query: { file_name: csv!.name },
      });
    },
    onSuccess: () => {
      resetImport();
      resetHeaders();
    },
  });

  return {
    csv,
    headers: importInfo?.data?.headers,
    firstValuesByHeader: importInfo?.data?.firstValuesByHeader,
    isFetchingInfo,
    isImporting,
    reset: () => {
      setCSV(null);
      resetHeaders();
      resetImport();
    },
    fetchHeaders: (file: File) => {
      setCSV(file);
      fetchHeaders(file);
    },
    importCSV: (mapping: Record<TransactionKey, string[]>) =>
      importCSV(mapping),
  };
};
