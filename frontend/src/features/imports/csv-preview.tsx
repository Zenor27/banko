import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const CSVPreview = ({
  firstValuesByHeader,
}: {
  firstValuesByHeader: Record<string, string[]>;
}) => {
  const valuesLength = Object.values(firstValuesByHeader)[0]?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">Preview</CardTitle>
        <CardDescription>Preview your CSV file</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {Object.keys(firstValuesByHeader).map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: valuesLength }, (_, index) => (
              <TableRow key={index}>
                {Object.entries(firstValuesByHeader).map(([header, values]) => (
                  <TableCell key={header}>{values[index] || ""}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
