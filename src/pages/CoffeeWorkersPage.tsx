import { useMemo } from "react";
import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, User, Phone, Calendar, DollarSign } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeWorkersPage() {
  const { coffeeWorkers, addCoffeeWorker, updateCoffeeWorker, deleteCoffeeWorker } = useFarmStore();

  function handleAddWorker() {
    const name = window.prompt("Worker name:", "") || "";
    const phoneNumber = window.prompt("Phone number:", "") || "";
    const assignedTask = window.prompt("Assigned Task:", "") || "";
    const payment = parseFloat(window.prompt("Daily Payment:", "0") || "0") || 0;
    const workingDays = parseInt(window.prompt("Working Days:", "0") || "0") || 0;
    addCoffeeWorker({ name, phoneNumber, assignedTask, payment, workingDays });
  }

  const workers = useMemo(() => coffeeWorkers, [coffeeWorkers]);

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Farm Workers" subtitle="Manage coffee farm workers and their assignments" actions={<PrintButton />} />

      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Worker Records</CardTitle>
          <Button onClick={handleAddWorker}>
            <Plus className="h-4 w-4 mr-2" />
            Add Worker
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Assigned Task</TableHead>
                <TableHead>Daily Payment (KSh)</TableHead>
                <TableHead>Working Days</TableHead>
                <TableHead>Total Earnings (KSh)</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {worker.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {worker.phoneNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{worker.assignedTask}</Badge>
                  </TableCell>
                  <TableCell>{worker.payment}</TableCell>
                  <TableCell>{worker.workingDays}</TableCell>
                  <TableCell>{(worker.payment * worker.workingDays).toLocaleString()}</TableCell>
                  <TableCell className="no-print">
                    <Button variant="ghost" size="sm" onClick={() => updateCoffeeWorker(worker.id, { name: worker.name })}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteCoffeeWorker(worker.id)}>Delete</Button>
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