import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function MyHerdPage() {
  const { cows, deleteCow } = useFarmStore();

  return (
    <div>
      <PageHeader title="My Herd" subtitle="All registered cattle" actions={<PrintButton />} />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Tag</TableHead><TableHead>Name</TableHead><TableHead>Breed</TableHead><TableHead>Age</TableHead><TableHead>Weight (kg)</TableHead><TableHead>Health</TableHead><TableHead>Last Checkup</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {cows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.tag}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.breed}</TableCell>
                  <TableCell>{c.age} yrs</TableCell><TableCell>{c.weight}</TableCell>
                  <TableCell>
                    <Badge variant={c.health === "Healthy" ? "default" : c.health === "Monitoring" ? "secondary" : "destructive"}
                      className={c.health === "Healthy" ? "bg-success" : c.health === "Monitoring" ? "bg-warning" : ""}>
                      {c.health}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.lastCheckup}</TableCell>
                  <TableCell className="no-print">
                    <Button variant="ghost" size="icon" onClick={() => { deleteCow(c.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
