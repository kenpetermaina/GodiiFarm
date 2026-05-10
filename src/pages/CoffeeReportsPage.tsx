import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Download, TrendingUp, DollarSign, Coffee, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function CoffeeReportsPage() {
  // Mock data for charts
  const monthlyHarvestData = [
    { month: "Jan", harvest: 120 },
    { month: "Feb", harvest: 150 },
    { month: "Mar", harvest: 200 },
    { month: "Apr", harvest: 180 },
    { month: "May", harvest: 160 },
    { month: "Jun", harvest: 140 }
  ];

  const expenseData = [
    { name: "Fertilizer", value: 15000, color: "#8884d8" },
    { name: "Labor", value: 25000, color: "#82ca9d" },
    { name: "Pesticides", value: 8000, color: "#ffc658" },
    { name: "Transport", value: 5000, color: "#ff7300" },
    { name: "Equipment", value: 3000, color: "#00ff00" }
  ];

  const profitData = [
    { month: "Jan", income: 18000, expenses: 8000, profit: 10000 },
    { month: "Feb", income: 22500, expenses: 9500, profit: 13000 },
    { month: "Mar", income: 30000, expenses: 12000, profit: 18000 },
    { month: "Apr", income: 27000, expenses: 11000, profit: 16000 },
    { month: "May", income: 24000, expenses: 10000, profit: 14000 },
    { month: "Jun", income: 21000, expenses: 9000, profit: 12000 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Farm Reports" subtitle="Analytics and insights for your coffee farm" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">950 kg</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh 142,500</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh 66,500</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh 76,000</div>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Harvest Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Harvest Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyHarvestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="harvest" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profit/Loss Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profit/Loss Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="income" stroke="#8884d8" name="Income" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}