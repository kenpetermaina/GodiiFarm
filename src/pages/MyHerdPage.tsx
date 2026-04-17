import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function MyHerdPage() {
  const { cows, addCow, deleteCow } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    tag_number: "",
    name: "",
    breed: "",
    date_of_birth: "",
    gender: "female" as const,
    status: "healthy" as const,
  });

  const handleAdd = () => {
    if (!form.tag_number || !form.name) return toast.error("Fill required fields");
    addCow({
      ...form,
      date_of_birth: form.date_of_birth || undefined,
    });
    toast.success("Cow added to herd");
    setForm({
      tag_number: "",
      name: "",
      breed: "",
      date_of_birth: "",
      gender: "female",
      status: "healthy",
    });
    setOpen(false);
  };

  return (
    <div>
      <PageHeader 
        title="My Herd" 
        subtitle="All registered cattle" 
        actions={
          <div className="flex gap-2">
            <PrintButton />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Cow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Cow</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input 
                    placeholder="Tag Number" 
                    value={form.tag_number} 
                    onChange={(e) => setForm({ ...form, tag_number: e.target.value })} 
                  />
                  <Input 
                    placeholder="Cow Name" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                  <Input 
                    placeholder="Breed" 
                    value={form.breed} 
                    onChange={(e) => setForm({ ...form, breed: e.target.value })} 
                  />
                  <Input 
                    placeholder="Date of Birth" 
                    type="date" 
                    value={form.date_of_birth} 
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} 
                  />
                  <Select 
                    value={form.gender} 
                    onValueChange={(v: any) => setForm({ ...form, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={form.status} 
                    onValueChange={(v: any) => setForm({ ...form, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">Healthy</SelectItem>
                      <SelectItem value="sick">Sick</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="dead">Dead</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAdd} className="w-full">Add to Herd</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        } 
      />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Tag Number</TableHead><TableHead>Name</TableHead><TableHead>Breed</TableHead><TableHead>Date of Birth</TableHead><TableHead>Gender</TableHead><TableHead>Status</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {cows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.tag_number}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.breed}</TableCell>
                  <TableCell>{c.date_of_birth ? new Date(c.date_of_birth).toLocaleDateString() : 'N/A'}</TableCell><TableCell>{c.gender}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "healthy" ? "default" : "destructive"}
                      className={c.status === "healthy" ? "bg-success" : ""}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="no-print">
                    <Button variant="ghost" size="icon" onClick={() => { deleteCow(c.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
