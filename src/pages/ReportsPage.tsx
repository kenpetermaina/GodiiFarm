import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import { generateMilkReport, generateExpensesReport, generateIncomeReport, downloadReport } from "@/lib/downloadUtils";

export default function ReportsPage() {
  const { milkRecords, cows, expenses, incomeRecords } = useFarmStore();

  const handleDownloadReport = (type: 'milk' | 'expenses' | 'income' | 'all') => {
    try {
      const date = new Date().toISOString().split('T')[0];
      
      if (type === 'milk' || type === 'all') {
        const report = generateMilkReport(milkRecords, cows);
        downloadReport('Milk Report', report, `milk-report-${date}.txt`);
      }
      if (type === 'expenses' || type === 'all') {
        const report = generateExpensesReport(expenses);
        downloadReport('Expenses Report', report, `expenses-report-${date}.txt`);
      }
      if (type === 'income' || type === 'all') {
        const report = generateIncomeReport(incomeRecords);
        downloadReport('Income Report', report, `income-report-${date}.txt`);
      }
      
      toast.success(`Report${type === 'all' ? 's' : ''} downloaded successfully`);
    } catch (error) {
      toast.error("Failed to download report");
      console.error(error);
    }
  };

  const totalMilk = milkRecords.reduce((s, r) => s + r.amount, 0);
  const totalIncome = incomeRecords.reduce((s, r) => s + r.total, 0);
  const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
  const profit = totalIncome - totalExpenses;

  const dailyData = milkRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.date] = (acc[r.date] || 0) + r.amount;
    return acc;
  }, {});
  const chartData = Object.entries(dailyData).sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => ({ date: date.slice(5), amount }));

  const cowMilk = milkRecords.reduce<Record<string, number>>((acc, r) => {
    acc[r.cowId] = (acc[r.cowId] || 0) + r.amount;
    return acc;
  }, {});
  const cowRanking = Object.entries(cowMilk)
    .sort(([, a], [, b]) => b - a)
    .map(([cowId, total], i) => {
      const cow = cows.find((c) => c.id === cowId);
      return { rank: i + 1, cow: cow ? `${cow.tag} (${cow.name})` : cowId, total, pct: ((total / totalMilk) * 100).toFixed(1) };
    });

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div>
      <PageHeader 
        title="Reports" 
        subtitle="Weekly & monthly performance overview" 
        actions={
          <div className="flex gap-2">
            <PrintButton />
            <Button variant="outline" size="sm" onClick={() => handleDownloadReport('milk')}>
              <Download className="h-4 w-4 mr-1" />
              Milk Report
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownloadReport('expenses')}>
              <Download className="h-4 w-4 mr-1" />
              Expenses Report
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownloadReport('income')}>
              <Download className="h-4 w-4 mr-1" />
              Income Report
            </Button>
          </div>
        } 
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Milk</p><p className="text-2xl font-bold">{totalMilk} L</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Income</p><p className="text-2xl font-bold text-success">KES {totalIncome.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold text-destructive">KES {totalExpenses.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Profit/Loss</p><p className={`text-2xl font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}>KES {profit.toLocaleString()}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card><CardContent className="p-4">
          <h3 className="font-semibold mb-4">Daily Milk Production</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="hsl(152, 35%, 18%)" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <h3 className="font-semibold mb-4">Expense Breakdown</h3>
          {expenses.length === 0 ? <p className="text-center text-muted-foreground py-16">No expense data</p> : (
            <div className="space-y-2">
              {Object.entries(expenses.reduce<Record<string, number>>((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {})).map(([cat, amt]) => (
                <div key={cat} className="flex justify-between"><span>{cat}</span><span className="font-medium">KES {amt.toLocaleString()}</span></div>
              ))}
            </div>
          )}
        </CardContent></Card>
      </div>

      <Card><CardContent className="p-4">
        <h3 className="font-semibold mb-4">Milk Production by Cow</h3>
        <Table>
          <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Cow</TableHead><TableHead className="text-right">Total Milk (L)</TableHead><TableHead className="text-right">% of Total</TableHead></TableRow></TableHeader>
          <TableBody>
            {cowRanking.map((r) => (
              <TableRow key={r.cow}><TableCell>{medals[r.rank - 1] || r.rank}</TableCell><TableCell className="font-mono">{r.cow}</TableCell><TableCell className="text-right">{r.total}</TableCell><TableCell className="text-right">{r.pct}%</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
