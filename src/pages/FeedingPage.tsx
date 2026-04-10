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

export default function FeedingPage() {
  const { feedRecords, addFeedRecord, deleteFeedRecord, cows } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cowId: "", feedType: "", quantity: "" });

  const handleAdd = () => {
    if (!form.cowId || !form.feedType) return toast.error("Fill required fields");
    addFeedRecord({ id: Date.now().toString(), date: new Date().toISOString().split("T")[0], cowId: form.cowId, feedType: form.feedType, quantity: form.quantity });
    toast.success("Feed record added");
    setForm({ cowId: "", feedType: "", quantity: "" });
    setOpen(false);
  };

  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag} - ${c.name}` : id; };

  return (
    <div>
      <PageHeader title="Feeding Records" subtitle="Track what your cows eat" actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Feed</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Feed Record</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.cowId} onValueChange={(v) => setForm({ ...form, cowId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Feed Type" value={form.feedType} onChange={(e) => setForm({ ...form, feedType: e.target.value })} />
                <Input placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Cow</TableHead><TableHead>Feed Type</TableHead><TableHead>Quantity</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {feedRecords.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No feed records yet.</TableCell></TableRow>
              ) : feedRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.date}</TableCell><TableCell>{getCowName(r.cowId)}</TableCell><TableCell>{r.feedType}</TableCell><TableCell>{r.quantity}</TableCell>
                  <TableCell className="no-print"><Button variant="ghost" size="icon" onClick={() => { deleteFeedRecord(r.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
