import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function IncomePage() {
  const { incomeRecords, addIncomeRecord, deleteIncomeRecord } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ litres: "", pricePerLitre: "", buyer: "" });
  const total = incomeRecords.reduce((s, r) => s + r.total, 0);
  const totalLitres = incomeRecords.reduce((s, r) => s + r.litres, 0);

  const handleAdd = () => {
    if (!form.litres || !form.pricePerLitre) return toast.error("Fill required fields");
    const litres = Number(form.litres);
    const price = Number(form.pricePerLitre);
    addIncomeRecord({ id: Date.now().toString(), date: new Date().toISOString().split("T")[0], litres, pricePerLitre: price, total: litres * price, buyer: form.buyer });
    toast.success("Income recorded");
    setForm({ litres: "", pricePerLitre: "", buyer: "" });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Income" subtitle={`Total: KES ${total.toLocaleString()} | ${totalLitres} L sold`} actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Record Sale</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Sale</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Litres" type="number" value={form.litres} onChange={(e) => setForm({ ...form, litres: e.target.value })} />
                <Input placeholder="Price per Litre (KES)" type="number" value={form.pricePerLitre} onChange={(e) => setForm({ ...form, pricePerLitre: e.target.value })} />
                <Input placeholder="Buyer" value={form.buyer} onChange={(e) => setForm({ ...form, buyer: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Litres</TableHead><TableHead>Price/L</TableHead><TableHead>Total (KES)</TableHead><TableHead>Buyer</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {incomeRecords.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No income records yet.</TableCell></TableRow>
              ) : incomeRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.date}</TableCell><TableCell>{r.litres}</TableCell><TableCell>{r.pricePerLitre}</TableCell><TableCell>{r.total.toLocaleString()}</TableCell><TableCell>{r.buyer}</TableCell>
                  <TableCell className="no-print"><Button variant="ghost" size="icon" onClick={() => { deleteIncomeRecord(r.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
