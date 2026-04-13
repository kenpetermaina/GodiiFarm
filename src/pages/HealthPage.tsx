import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import { downloadCSV } from "@/lib/downloadUtils";

export default function HealthPage() {
  const { healthRecords, addHealthRecord, deleteHealthRecord, cows } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cow_id: "", illness: "", treatment: "", vet_name: "", visit_date: "" });

  const handleDownloadHealth = () => {
    try {
      const data = healthRecords.map((r: any) => ({
        Cow: getCowName(r.cow_id),
        Date: r.visit_date,
        Illness: r.illness,
        Treatment: r.treatment || "—",
        Vet: r.vet_name || "—"
      }));
      downloadCSV(data, `health-records-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success("Health records downloaded successfully");
    } catch (error) {
      toast.error("Failed to download records");
    }
  };

  const handleAdd = () => {
    if (!form.cow_id || !form.illness) return toast.error("Fill required fields");
    addHealthRecord({ 
      cow_id: form.cow_id, 
      illness: form.illness, 
      treatment: form.treatment || null, 
      vet_name: form.vet_name || null, 
      visit_date: form.visit_date 
    });
    toast.success("Health record added");
    setForm({ cow_id: "", illness: "", treatment: "", vet_name: "", visit_date: "" });
    setOpen(false);
  };

  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag_number} - ${c.name}` : id; };

  return (
    <div>
      <PageHeader title="Health Monitoring" subtitle="Track cow health, symptoms & treatments" actions={
        <>
          <PrintButton />
          <Button variant="outline" onClick={handleDownloadHealth}>
            <Download className="h-4 w-4 mr-1" />
            Download CSV
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Record</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Health Record</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.cow_id} onValueChange={(v) => setForm({ ...form, cow_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag_number} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Illness/Diagnosis" value={form.illness} onChange={(e) => setForm({ ...form, illness: e.target.value })} />
                <Input placeholder="Treatment" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
                <Input placeholder="Vet Name" value={form.vet_name} onChange={(e) => setForm({ ...form, vet_name: e.target.value })} />
                <Input placeholder="Visit Date" type="date" value={form.visit_date} onChange={(e) => setForm({ ...form, visit_date: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Visit Date</TableHead><TableHead>Cow</TableHead><TableHead>Illness</TableHead><TableHead>Treatment</TableHead><TableHead>Vet Name</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {healthRecords.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No health records yet.</TableCell></TableRow>
              ) : healthRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.visit_date}</TableCell><TableCell>{getCowName(r.cow_id)}</TableCell><TableCell>{r.illness}</TableCell><TableCell>{r.treatment}</TableCell><TableCell>{r.vet_name}</TableCell>
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
