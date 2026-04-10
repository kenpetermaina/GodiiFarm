import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function MilkRecordsPage() {
  const { milkRecords, deleteMilkRecord, cows } = useFarmStore();
  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag} - ${c.name}` : id; };

  return (
    <div>
      <PageHeader title="Milk Records" subtitle="All milk production logs" actions={<PrintButton />} />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Cow</TableHead><TableHead>Amount (L)</TableHead><TableHead>Session</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {milkRecords.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No milk records yet.</TableCell></TableRow>
              ) : milkRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.date}</TableCell><TableCell>{getCowName(r.cowId)}</TableCell><TableCell>{r.amount}</TableCell><TableCell>{r.session}</TableCell>
                  <TableCell className="no-print"><Button variant="ghost" size="icon" onClick={() => { deleteMilkRecord(r.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
