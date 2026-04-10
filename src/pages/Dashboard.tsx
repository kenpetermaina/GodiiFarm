import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Milk, Pencil, Trash2, Beef, HeartPulse, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function Dashboard() {
  const { cows, milkRecords, addCow, addMilkRecord, deleteCow, updateCow } = useFarmStore();
  const [cowDialogOpen, setCowDialogOpen] = useState(false);
  const [milkDialogOpen, setMilkDialogOpen] = useState(false);
  const [editCow, setEditCow] = useState<any>(null);

  const today = new Date().toISOString().split("T")[0];
  const todayMilk = milkRecords.filter((r) => r.date === today).reduce((s, r) => s + r.amount, 0);
  const healthyCows = cows.filter((c) => c.health === "Healthy").length;
  const needAttention = cows.filter((c) => c.health !== "Healthy").length;

  const dailyData = milkRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.date] = (acc[r.date] || 0) + r.amount;
    return acc;
  }, {});
  const chartData = Object.entries(dailyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date: date.slice(5), amount }));

  const stats = [
    { label: "Total Cows", value: cows.length, icon: Beef, color: "border-l-primary" },
    { label: "Today's Milk (L)", value: todayMilk, icon: Milk, color: "border-l-accent" },
    { label: "Healthy", value: healthyCows, icon: HeartPulse, color: "border-l-success" },
    { label: "Need Attention", value: needAttention, icon: AlertTriangle, color: "border-l-warning" },
  ];

  const [newCow, setNewCow] = useState({ tag: "", name: "", breed: "", age: "", weight: "", health: "Healthy" as const });
  const [newMilk, setNewMilk] = useState({ cowId: "", amount: "", session: "Morning" as "Morning" | "Evening" });

  const handleAddCow = () => {
    if (!newCow.tag || !newCow.name) return toast.error("Fill required fields");
    const cow = {
      id: Date.now().toString(),
      tag: newCow.tag,
      name: newCow.name,
      breed: newCow.breed,
      age: Number(newCow.age) || 0,
      weight: Number(newCow.weight) || 0,
      health: newCow.health as any,
      lastCheckup: today,
    };
    if (editCow) {
      updateCow({ ...cow, id: editCow.id });
      toast.success("Cow updated");
    } else {
      addCow(cow);
      toast.success("Cow added");
    }
    setNewCow({ tag: "", name: "", breed: "", age: "", weight: "", health: "Healthy" });
    setEditCow(null);
    setCowDialogOpen(false);
  };

  const handleAddMilk = () => {
    if (!newMilk.cowId || !newMilk.amount) return toast.error("Fill required fields");
    addMilkRecord({ id: Date.now().toString(), date: today, cowId: newMilk.cowId, amount: Number(newMilk.amount), session: newMilk.session });
    toast.success("Milk logged");
    setNewMilk({ cowId: "", amount: "", session: "Morning" });
    setMilkDialogOpen(false);
  };

  const openEdit = (cow: any) => {
    setEditCow(cow);
    setNewCow({ tag: cow.tag, name: cow.name, breed: cow.breed, age: String(cow.age), weight: String(cow.weight), health: cow.health });
    setCowDialogOpen(true);
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your herd & production" actions={
        <>
          <PrintButton />
          <Dialog open={milkDialogOpen} onOpenChange={setMilkDialogOpen}>
            <DialogTrigger asChild><Button variant="outline"><Milk className="h-4 w-4 mr-1" />Log Milk</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Milk Production</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={newMilk.cowId} onValueChange={(v) => setNewMilk({ ...newMilk, cowId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Amount (L)" type="number" value={newMilk.amount} onChange={(e) => setNewMilk({ ...newMilk, amount: e.target.value })} />
                <Select value={newMilk.session} onValueChange={(v: any) => setNewMilk({ ...newMilk, session: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Morning">Morning</SelectItem><SelectItem value="Evening">Evening</SelectItem></SelectContent>
                </Select>
                <Button onClick={handleAddMilk} className="w-full">Log</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={cowDialogOpen} onOpenChange={(o) => { setCowDialogOpen(o); if (!o) setEditCow(null); }}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Add Cow</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editCow ? "Edit Cow" : "Add Cow"}</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Tag (e.g. C-006)" value={newCow.tag} onChange={(e) => setNewCow({ ...newCow, tag: e.target.value })} />
                <Input placeholder="Name" value={newCow.name} onChange={(e) => setNewCow({ ...newCow, name: e.target.value })} />
                <Input placeholder="Breed" value={newCow.breed} onChange={(e) => setNewCow({ ...newCow, breed: e.target.value })} />
                <Input placeholder="Age" type="number" value={newCow.age} onChange={(e) => setNewCow({ ...newCow, age: e.target.value })} />
                <Input placeholder="Weight (kg)" type="number" value={newCow.weight} onChange={(e) => setNewCow({ ...newCow, weight: e.target.value })} />
                <Select value={newCow.health} onValueChange={(v: any) => setNewCow({ ...newCow, health: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Healthy">Healthy</SelectItem><SelectItem value="Monitoring">Monitoring</SelectItem><SelectItem value="Sick">Sick</SelectItem></SelectContent>
                </Select>
                <Button onClick={handleAddCow} className="w-full">{editCow ? "Update" : "Add"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      } />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.color}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Daily Milk Production (Liters)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="hsl(152, 35%, 18%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Herd Overview</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag</TableHead><TableHead>Name</TableHead><TableHead>Breed</TableHead>
                <TableHead>Age</TableHead><TableHead>Weight (kg)</TableHead><TableHead>Health</TableHead>
                <TableHead>Last Checkup</TableHead><TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.tag}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.breed}</TableCell>
                  <TableCell>{c.age} yrs</TableCell><TableCell>{c.weight}</TableCell>
                  <TableCell>
                    <Badge variant={c.health === "Healthy" ? "default" : c.health === "Monitoring" ? "secondary" : "destructive"}
                      className={c.health === "Healthy" ? "bg-success" : c.health === "Monitoring" ? "bg-warning" : ""}>
                      {c.health}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.lastCheckup}</TableCell>
                  <TableCell className="no-print">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { deleteCow(c.id); toast.success("Deleted"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
