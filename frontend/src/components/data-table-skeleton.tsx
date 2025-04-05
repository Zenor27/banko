import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const DataTableSkeleton = () => (
  <Table>
    <TableHeader>
      <TableRow>
        {Array.from({ length: 5 }, (_, index) => (
          <TableHead key={index}>
            <Skeleton className="h-6 rounded-xl" />
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {Array.from({ length: 15 }, (_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 5 }).map((_, headerIndex) => (
            <TableCell key={`${index}-${headerIndex}`}>
              <Skeleton className="h-4 rounded-xl" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
