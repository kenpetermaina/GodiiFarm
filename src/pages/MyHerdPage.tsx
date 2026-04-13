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
            <TableHeader><TableRow><TableHead>Tag Number</TableHead><TableHead>Name</TableHead><TableHead>Breed</TableHead><TableHead>Date of Birth</TableHead><TableHead>Gender</TableHead><TableHead>Status</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {cows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.tag_number}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.breed}</TableCell>
                  <TableCell>{c.date_of_birth ? new Date(c.date_of_birth).toLocaleDateString() : 'N/A'}</TableCell><TableCell>{c.gender}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "healthy" ? "default" : "destructive"}
                      className={c.status === "healthy" ? "bg-success" : ""}>
                      {c.status}
                    </Badge>
                  </TableCell>
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
