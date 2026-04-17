import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Sunrise, Sun, Sunset, Download, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import { downloadCSV } from "@/lib/downloadUtils";

export default function MilkRecordsPage() {
  const { milkRecords, addMilkRecord, deleteMilkRecord, cows } = useFarmStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    cow_id: "",
    date: new Date().toISOString().split("T")[0],
    amount_liters: "",
    session: "Morning" as const,
    notes: "",
  });

  const handleAdd = () => {
    if (!form.cow_id || !form.amount_liters) return toast.error("Fill required fields");
    addMilkRecord({
      cow_id: form.cow_id,
      date: form.date,
      amount_liters: Number(form.amount_liters),
      session: form.session,
      notes: form.notes || undefined,
    });
    toast.success("Milk record added");
    setForm({
      cow_id: "",
      date: new Date().toISOString().split("T")[0],
      amount_liters: "",
      session: "Morning",
      notes: "",
    });
    setOpen(false);
  };

  const getCowName = (id: string) => { const c = cows.find((c) => c.id === id); return c ? `${c.tag_number} - ${c.name}` : id; };

  const handleDownloadMilkRecords = () => {
    try {
      const data = milkRecords.map(r => ({
        Date: r.date,
        Cow: getCowName(r.cow_id || r.cowId),
        Session: r.session,
        "Amount (L)": r.amount_liters || r.amount
      }));
      downloadCSV(data, `milk-records-${new Date().toISOString().split('T')[0]}.csv`);
      toast.success("Milk records downloaded successfully");
    } catch (error) {
      toast.error("Failed to download records");
    }
  };

  const morningRecords = milkRecords.filter(r => r.session === 'Morning');
  const lunchRecords = milkRecords.filter(r => r.session === 'Lunch');
  const eveningRecords = milkRecords.filter(r => r.session === 'Evening');

  const MilkTable = ({ records, title, icon: Icon }: { records: typeof milkRecords, title: string, icon: any }) => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Cow</TableHead>
              <TableHead>Amount (L)</TableHead>
              <TableHead className="no-print">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No {title.toLowerCase()} records yet.
                </TableCell>
              </TableRow>
            ) : records.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.date}</TableCell>
                <TableCell>{getCowName(r.cow_id)}</TableCell>
                <TableCell>{r.amount_liters}</TableCell>
                <TableCell className="no-print">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      try {
                        await deleteMilkRecord(r.id);
                        toast.success("Deleted");
                      } catch (error) {
                        toast.error("Failed to delete record");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <PageHeader 
        title="Milk Records" 
        subtitle="Milk production logs by session" 
        actions={
          <div className="flex gap-2">
            <PrintButton />
            <Button variant="outline" onClick={handleDownloadMilkRecords}>
              <Download className="h-4 w-4 mr-1" />
              Download CSV
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Record
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Milk Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Select 
                    value={form.cow_id} 
                    onValueChange={(v) => setForm({ ...form, cow_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select cow" />
                    </SelectTrigger>
                    <SelectContent>
                      {cows.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.tag_number} - {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input 
                    type="date" 
                    value={form.date} 
                    onChange={(e) => setForm({ ...form, date: e.target.value })} 
                  />
                  <Input 
                    placeholder="Amount (Liters)" 
                    type="number" 
                    step="0.1"
                    value={form.amount_liters} 
                    onChange={(e) => setForm({ ...form, amount_liters: e.target.value })} 
                  />
                  <Select 
                    value={form.session} 
                    onValueChange={(v: any) => setForm({ ...form, session: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Lunch">Lunch</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input 
                    placeholder="Notes (optional)" 
                    value={form.notes} 
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} 
                  />
                  <Button onClick={handleAdd} className="w-full">Add Record</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        } 
      />

      <MilkTable records={morningRecords} title="Morning Session" icon={Sunrise} />
      <MilkTable records={lunchRecords} title="Lunch Session" icon={Sun} />
      <MilkTable records={eveningRecords} title="Evening Session" icon={Sunset} />
    </div>
  );
}
