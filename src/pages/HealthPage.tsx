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

export default function HealthPage() {
  const { healthRecords, addHealthRecord, deleteHealthRecord, cows } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cowId: "", status: "", symptoms: "", treatment: "" });

  const handleAdd = () => {
    if (!form.cowId) return toast.error("Select a cow");
    addHealthRecord({ id: Date.now().toString(), date: new Date().toISOString().split("T")[0], cowId: form.cowId, status: form.status, symptoms: form.symptoms, treatment: form.treatment });
    toast.success("Health record added");
    setForm({ cowId: "", status: "", symptoms: "", treatment: "" });
    setOpen(false);
  };

  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag} - ${c.name}` : id; };

  return (
    <div>
      <PageHeader title="Health Monitoring" subtitle="Track cow health, symptoms & treatments" actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Record</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Health Record</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.cowId} onValueChange={(v) => setForm({ ...form, cowId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                <Input placeholder="Symptoms" value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
                <Input placeholder="Treatment" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Cow</TableHead><TableHead>Status</TableHead><TableHead>Symptoms</TableHead><TableHead>Treatment</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {healthRecords.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No health records yet.</TableCell></TableRow>
              ) : healthRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.date}</TableCell><TableCell>{getCowName(r.cowId)}</TableCell><TableCell>{r.status}</TableCell><TableCell>{r.symptoms}</TableCell><TableCell>{r.treatment}</TableCell>
                  <TableCell className="no-print"><Button variant="ghost" size="icon" onClick={() => { deleteHealthRecord(r.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
