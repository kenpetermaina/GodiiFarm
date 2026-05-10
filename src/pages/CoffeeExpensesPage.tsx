import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, DollarSign, Calendar, Sprout, Bug, Users, Truck, Wrench, Droplets } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeExpensesPage() {
  const [expenses] = useState([
    {
      id: 1,
      category: "Fertilizer",
      description: "NPK Fertilizer for coffee trees",
      amount: 15000,
      date: "2024-02-15",
      icon: Sprout
    },
    {
      id: 2,
      category: "Pesticides",
      description: "Coffee berry borer treatment",
      amount: 8000,
      date: "2024-01-20",
      icon: Bug
    },
    {
      id: 3,
      category: "Labor",
      description: "Harvesting labor costs",
      amount: 25000,
      date: "2024-03-15",
      icon: Users
    },
    {
      id: 4,
      category: "Transport",
      description: "Coffee transport to market",
      amount: 5000,
      date: "2024-03-20",
      icon: Truck
    },
    {
      id: 5,
      category: "Equipment",
      description: "Pruning tools maintenance",
      amount: 3000,
      date: "2024-02-28",
      icon: Wrench
    },
    {
      id: 6,
      category: "Irrigation",
      description: "Drip irrigation system maintenance",
      amount: 12000,
      date: "2024-03-01",
      icon: Droplets
    }
  ]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Farm Expenses" subtitle="Track all coffee farm expenses" actions={<PrintButton />} />

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Total Expenses This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">KSh {totalExpenses.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expense Records</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount (KSh)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <expense.icon className="h-4 w-4" />
                      {expense.category}
                    </div>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="no-print">
                    <Button variant="ghost" size="sm">Edit</Button>
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