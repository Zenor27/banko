"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionKey } from "@/features/imports/types";
import { FileText, Check } from "lucide-react";
import { useState } from "react";

type ColumnMapperProps = {
  filename: string;
  headers: string[];
  onImport: (mapping: Record<TransactionKey, string[]>) => void;
  onBack: () => void;
};

export const ColumnMapper = ({
  filename,
  headers,
  onImport,
  onBack,
}: ColumnMapperProps) => {
  const [mapping, setMapping] = useState<Record<TransactionKey, string[]>>({
    at: [],
    name: [],
    category: [],
    amount: [],
  });

  const isValid = Object.values(mapping).every((value) => value.length > 0);

  const handleMappingChange = (key: TransactionKey, value: string) => {
    setMapping((prev) => {
      if (prev[key].includes(value)) {
        return {
          ...prev,
          [key]: prev[key].filter((v) => v !== value),
        };
      }
      return {
        ...prev,
        [key]: [...prev[key], value],
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          {filename}
        </CardTitle>
        <CardDescription>
          Map the columns from your CSV file to transaction fields
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-4">
          {Object.entries(mapping).map(([k, v]) => (
            <div className="space-y-2" key={k}>
              <h3 className="text-sm font-medium capitalize">
                {k} <span className="text-destructive">*</span>
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {v.join(", ") || "Select one or more column(s)"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {headers.map((header) => (
                    <DropdownMenuCheckboxItem
                      key={header}
                      onClick={(e) => {
                        e.preventDefault();
                        handleMappingChange(k as TransactionKey, header);
                      }}
                      checked={v.includes(header)}
                    >
                      {header}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Upload
        </Button>
        <Button onClick={() => onImport(mapping)} disabled={!isValid}>
          <Check className="mr-2 h-4 w-4" />
          Start Import
        </Button>
      </CardFooter>
    </Card>
  );
};
