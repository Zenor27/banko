"use client";

import { Spinner } from "@/components/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnMapper } from "@/features/imports/column-mapper";
import { CSVPreview } from "@/features/imports/csv-preview";
import { CSVUploader } from "@/features/imports/csv-uploader";
import { useImportCSV } from "@/features/imports/hooks/use-import-csv";
import { ImportHistory } from "@/features/imports/import-history";
import { useState } from "react";

type Tab = "upload" | "history";

export const ImportView = () => {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const {
    csv,
    headers,
    firstValuesByHeader,
    isFetchingInfo,
    isImporting,
    fetchHeaders,
    importCSV,
    reset,
  } = useImportCSV();

  const isLoading = isFetchingInfo || isImporting;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Import transactions</h1>
      <p className="text-muted-foreground">
        Upload CSV files to import your transactions
      </p>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as Tab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload CSV</TabsTrigger>
            <TabsTrigger value="history">Import History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            {!headers ? (
              <CSVUploader onImportCSV={fetchHeaders} />
            ) : (
              <div className="flex flex-col gap-4">
                <ColumnMapper
                  headers={headers}
                  filename={csv?.name || ""}
                  onBack={reset}
                  onImport={importCSV}
                />
                <CSVPreview firstValuesByHeader={firstValuesByHeader!} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ImportHistory />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
