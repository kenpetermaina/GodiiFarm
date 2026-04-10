import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function AlertsPage() {
  const { alerts, addAlert, toggleAlert, deleteAlert } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "Reminder" });

  const handleAdd = () => {
    if (!form.title) return toast.error("Add a title");
    addAlert({ id: Date.now().toString(), date: new Date().toISOString().split("T")[0], done: false, ...form });
    toast.success("Alert added");
    setForm({ title: "", description: "", type: "Reminder" });
    setOpen(false);
  };

  const pending = alerts.filter((a) => !a.done);

  return (
    <div>
      <PageHeader title="Alerts & Reminders" subtitle="Never miss important tasks" actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Alert</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Alert</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Pending ({pending.length})</p>
      <Card>
        <CardContent className="p-4">
          {pending.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No pending alerts 🎉</p>
          ) : (
            <div className="space-y-2">
              {pending.map((a) => (
                <div key={a.id} className="flex items-center gap-3 border rounded-md p-3">
                  <Checkbox checked={a.done} onCheckedChange={() => toggleAlert(a.id)} />
                  <div className="flex-1">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="no-print" onClick={() => { deleteAlert(a.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
