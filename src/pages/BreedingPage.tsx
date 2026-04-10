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

export default function BreedingPage() {
  const { breedingRecords, addBreedingRecord, deleteBreedingRecord, cows } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cowId: "", status: "", heatDate: "", serviceDate: "", expectedCalving: "" });

  const handleAdd = () => {
    if (!form.cowId) return toast.error("Select a cow");
    addBreedingRecord({ id: Date.now().toString(), ...form });
    toast.success("Breeding record added");
    setForm({ cowId: "", status: "", heatDate: "", serviceDate: "", expectedCalving: "" });
    setOpen(false);
  };

  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag} - ${c.name}` : id; };

  return (
    <div>
      <PageHeader title="Breeding Tracking" subtitle="Manage reproduction cycles" actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Record</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Breeding Record</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.cowId} onValueChange={(v) => setForm({ ...form, cowId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
                <Input placeholder="Heat Date" type="date" value={form.heatDate} onChange={(e) => setForm({ ...form, heatDate: e.target.value })} />
                <Input placeholder="Service Date" type="date" value={form.serviceDate} onChange={(e) => setForm({ ...form, serviceDate: e.target.value })} />
                <Input placeholder="Expected Calving" type="date" value={form.expectedCalving} onChange={(e) => setForm({ ...form, expectedCalving: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Cow</TableHead><TableHead>Status</TableHead><TableHead>Heat Date</TableHead><TableHead>Service Date</TableHead><TableHead>Expected Calving</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {breedingRecords.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No breeding records yet.</TableCell></TableRow>
              ) : breedingRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{getCowName(r.cowId)}</TableCell><TableCell>{r.status}</TableCell><TableCell>{r.heatDate}</TableCell><TableCell>{r.serviceDate}</TableCell><TableCell>{r.expectedCalving}</TableCell>
                  <TableCell className="no-print"><Button variant="ghost" size="icon" onClick={() => { deleteBreedingRecord(r.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
