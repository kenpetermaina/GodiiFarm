import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function WorkersPage() {
  const { workers, addWorker, updateWorker, deleteWorker } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ name: "", role: "", phone: "", startDate: "", status: "Active" as "Active" | "Inactive" });

  const handleAdd = () => {
    if (!form.name || !form.role) return toast.error("Fill required fields");
    if (editItem) {
      updateWorker({ ...form, id: editItem.id });
      toast.success("Worker updated");
    } else {
      addWorker({ ...form, id: Date.now().toString() });
      toast.success("Worker added");
    }
    setForm({ name: "", role: "", phone: "", startDate: "", status: "Active" });
    setEditItem(null);
    setOpen(false);
  };

  const openEdit = (w: any) => {
    setEditItem(w);
    setForm({ name: w.name, role: w.role, phone: w.phone, startDate: w.startDate, status: w.status });
    setOpen(true);
  };

  return (
    <div>
      <PageHeader title="Farm Workers" subtitle="Manage your farm staff" actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditItem(null); }}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Worker</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editItem ? "Edit Worker" : "Add Worker"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Role (e.g. Milker, Herder)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input placeholder="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
                </Select>
                <Button onClick={handleAdd} className="w-full">{editItem ? "Update" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead>Phone</TableHead><TableHead>Start Date</TableHead><TableHead>Status</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {workers.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No workers yet.</TableCell></TableRow>
              ) : workers.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.name}</TableCell><TableCell>{w.role}</TableCell><TableCell>{w.phone}</TableCell><TableCell>{w.startDate}</TableCell>
                  <TableCell><Badge variant={w.status === "Active" ? "default" : "secondary"} className={w.status === "Active" ? "bg-success" : ""}>{w.status}</Badge></TableCell>
                  <TableCell className="no-print">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(w)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { deleteWorker(w.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
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
