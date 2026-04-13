import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Milk, Pencil, Trash2, Beef, HeartPulse, AlertTriangle, Download, Upload, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function Dashboard() {
  const { cows, milkRecords, addCow, addMilkRecord, deleteCow, updateCow, exportData, importData, clearAllData, checkStorage } = useFarmStore();
  const [cowDialogOpen, setCowDialogOpen] = useState(false);
  const [milkDialogOpen, setMilkDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editCow, setEditCow] = useState<any>(null);
  const [importText, setImportText] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const todayMilk = milkRecords.filter((r) => r.date === today).reduce((s, r) => s + r.amount_liters, 0);
  const healthyCows = cows.filter((c) => c.status === "healthy").length;
  const needAttention = cows.filter((c) => c.status !== "healthy").length;

  const dailyData = milkRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.date] = (acc[r.date] || 0) + r.amount_liters;
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

  const [newCow, setNewCow] = useState({ tag_number: "", name: "", breed: "", date_of_birth: "", gender: "female" as "male" | "female", status: "healthy" as const });
  const [newMilk, setNewMilk] = useState({ cow_id: "", amount_liters: "", session: "Morning" as "Morning" | "Lunch" | "Evening" });

  const handleAddCow = async () => {
    if (!newCow.tag_number || !newCow.name) return toast.error("Fill required fields");
    try {
      const cow = {
        tag_number: newCow.tag_number,
        name: newCow.name,
        breed: newCow.breed || null,
        date_of_birth: newCow.date_of_birth || null,
        gender: newCow.gender,
        status: newCow.status,
      };
      if (editCow) {
        await updateCow(editCow.id, cow);
        toast.success("Cow updated");
      } else {
        await addCow(cow);
        toast.success("Cow added");
      }
      setNewCow({ tag_number: "", name: "", breed: "", date_of_birth: "", gender: "female", status: "healthy" });
      setEditCow(null);
      setCowDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save cow");
    }
  };

  const handleAddMilk = async () => {
    if (!newMilk.cow_id || !newMilk.amount_liters) return toast.error("Fill required fields");
    try {
      await addMilkRecord({
        cow_id: newMilk.cow_id,
        date: today,
        amount_liters: Number(newMilk.amount_liters),
        session: newMilk.session
      });
      toast.success("Milk logged");
      setNewMilk({ cow_id: "", amount_liters: "", session: "Morning" });
      setMilkDialogOpen(false);
    } catch (error) {
      toast.error("Failed to log milk");
    }
  };

  const openEdit = (cow: any) => {
    setEditCow(cow);
    setNewCow({ 
      tag_number: cow.tag_number, 
      name: cow.name, 
      breed: cow.breed || "", 
      date_of_birth: cow.date_of_birth || "", 
      gender: cow.gender || "female", 
      status: cow.status 
    });
    setCowDialogOpen(true);
  };

  const handleExportData = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `godii-farm-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleImportData = () => {
    if (!importText.trim()) {
      toast.error("Please paste your data to import");
      return;
    }

    try {
      const success = importData(importText);
      if (success) {
        toast.success("Data imported successfully");
        setImportText("");
        setImportDialogOpen(false);
      }
    } catch (error) {
      toast.error("Failed to import data");
    }
  };

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      clearAllData();
      toast.success("All data cleared");
    }
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your herd & production" actions={
        <>
          <PrintButton />
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-1" />
            Export Data
          </Button>
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-1" />
                Import Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Farm Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Paste your exported JSON data below. This will replace all current data.
                </p>
                <Textarea
                  placeholder="Paste your exported data here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={10}
                />
                <div className="flex gap-2">
                  <Button onClick={handleImportData} className="flex-1">
                    Import Data
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleClearAllData}
                  >
                    Clear All Data
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={checkStorage}>
            <Bug className="h-4 w-4 mr-1" />
            Debug Storage
          </Button>
          <Dialog open={milkDialogOpen} onOpenChange={setMilkDialogOpen}>
            <DialogTrigger asChild><Button variant="outline"><Milk className="h-4 w-4 mr-1" />Log Milk</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Milk Production</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={newMilk.cow_id} onValueChange={(v) => setNewMilk({ ...newMilk, cow_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select cow" /></SelectTrigger>
                  <SelectContent>{cows.map((c) => <SelectItem key={c.id} value={c.id}>{c.tag_number} - {c.name}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Amount (L)" type="number" value={newMilk.amount_liters} onChange={(e) => setNewMilk({ ...newMilk, amount_liters: e.target.value })} />
                <Select value={newMilk.session} onValueChange={(v: any) => setNewMilk({ ...newMilk, session: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                  </SelectContent>
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
                <Input placeholder="Tag Number (e.g. C-006)" value={newCow.tag_number} onChange={(e) => setNewCow({ ...newCow, tag_number: e.target.value })} />
                <Input placeholder="Name" value={newCow.name} onChange={(e) => setNewCow({ ...newCow, name: e.target.value })} />
                <Input placeholder="Breed" value={newCow.breed} onChange={(e) => setNewCow({ ...newCow, breed: e.target.value })} />
                <Input placeholder="Date of Birth" type="date" value={newCow.date_of_birth} onChange={(e) => setNewCow({ ...newCow, date_of_birth: e.target.value })} />
                <Select value={newCow.gender} onValueChange={(v: any) => setNewCow({ ...newCow, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="female">Female</SelectItem><SelectItem value="male">Male</SelectItem></SelectContent>
                </Select>
                <Select value={newCow.status} onValueChange={(v: any) => setNewCow({ ...newCow, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="healthy">Healthy</SelectItem><SelectItem value="sick">Sick</SelectItem><SelectItem value="sold">Sold</SelectItem><SelectItem value="dead">Dead</SelectItem></SelectContent>
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
                <TableHead>Tag Number</TableHead><TableHead>Name</TableHead><TableHead>Breed</TableHead>
                <TableHead>Date of Birth</TableHead><TableHead>Gender</TableHead><TableHead>Status</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
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
