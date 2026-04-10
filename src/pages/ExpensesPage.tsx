import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, cows } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cowId: "", category: "", description: "", amount: "" });
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const handleAdd = () => {
    if (!form.category || !form.amount) return toast.error("Fill required fields");
    addExpense({ id: Date.now().toString(), date: new Date().toISOString().split("T")[0], cowId: form.cowId, category: form.category, description: form.description, amount: Number(form.amount) });
    toast.success("Expense added");
    setForm({ cowId: "", category: "", description: "", amount: "" });
    setOpen(false);
  };

  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag} - ${c.name}` : id || "—"; };

  return (
    <div>
      <PageHeader title="Expenses" subtitle={`Total: KES ${total.toLocaleString()}`} actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Expense</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.cowId} onValueChange={(v) => setForm({ ...form, cowId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow (optional)" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Input placeholder="Amount (KES)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Cow</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Amount (KES)</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No expenses recorded yet.</TableCell></TableRow>
              ) : expenses.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{e.date}</TableCell><TableCell>{getCowName(e.cowId)}</TableCell><TableCell>{e.category}</TableCell><TableCell>{e.description}</TableCell><TableCell>{e.amount.toLocaleString()}</TableCell>
                  <TableCell className="no-print"><Button variant="ghost" size="icon" onClick={() => { deleteExpense(e.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
