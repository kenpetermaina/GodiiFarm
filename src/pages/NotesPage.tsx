import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function NotesPage() {
  const { notes, addNote, deleteNote, cows } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ cowId: "", content: "" });

  const handleAdd = () => {
    if (!form.content) return toast.error("Write a note");
    addNote({ id: Date.now().toString(), date: new Date().toISOString().split("T")[0], cowId: form.cowId, content: form.content });
    toast.success("Note added");
    setForm({ cowId: "", content: "" });
    setOpen(false);
  };

  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag} - ${c.name}` : "General"; };

  return (
    <div>
      <PageHeader title="Notes" subtitle="Observations and behavior changes" actions={
        <>
          <PrintButton />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Note</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.cowId} onValueChange={(v) => setForm({ ...form, cowId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow (optional)" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Textarea placeholder="Write your note..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                <Button onClick={handleAdd} className="w-full">Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />
      <Card>
        <CardContent className="p-4">
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No notes yet.</p>
          ) : (
            <div className="space-y-3">
              {notes.map((n) => (
                <div key={n.id} className="flex justify-between items-start border rounded-md p-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{n.date} • {getCowName(n.cowId)}</p>
                    <p>{n.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="no-print" onClick={() => { deleteNote(n.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
