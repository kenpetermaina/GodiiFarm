import { useMemo } from "react";
import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, DollarSign, Calendar, Sprout, Bug, Users, Truck, Wrench, Droplets } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeExpensesPage() {
  const { coffeeExpenses, addCoffeeExpense, updateCoffeeExpense, deleteCoffeeExpense } = useFarmStore();

  const totalExpenses = useMemo(() => coffeeExpenses.reduce((sum, e) => sum + (e.amount || 0), 0), [coffeeExpenses]);

  function handleAddExpense() {
    const date = window.prompt("Expense Date (YYYY-MM-DD):", new Date().toISOString().slice(0, 10));
    if (!date) return;
    const category = window.prompt("Category:", "") || "";
    const description = window.prompt("Description:", "") || "";
    const amount = parseFloat(window.prompt("Amount:", "0") || "0") || 0;
    addCoffeeExpense({ date, category, description, amount });
  }

  const expenses = useMemo(() => coffeeExpenses, [coffeeExpenses]);

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
          <Button onClick={handleAddExpense}>
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
                      <Sprout className="h-4 w-4" />
                      {expense.category}
                    </div>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{(expense.amount || 0).toLocaleString()}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell className="no-print">
                    <Button variant="ghost" size="sm" onClick={() => deleteCoffeeExpense(expense.id)}>Delete</Button>
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