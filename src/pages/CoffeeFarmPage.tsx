import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Coffee, MapPin, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeFarmPage() {
  // Mock data for demonstration
  const [coffeeFarms] = useState([
    {
      id: 1,
      name: "Main Coffee Farm",
      location: "Ruiru, Kenya",
      variety: "Arabica",
      size: 50,
      trees: 2500,
      plantedDate: "2020-03-15",
      soilType: "Volcanic",
      irrigation: "Drip Irrigation"
    }
  ]);

  const [coffeeTrees] = useState([
    {
      id: 1,
      treeId: "CF001",
      variety: "Arabica",
      plantedDate: "2020-03-15",
      age: 4,
      health: "Healthy",
      productionRate: "High",
      lastFertilized: "2024-02-15",
      lastSprayed: "2024-01-20"
    }
  ]);

  const stats = {
    totalTrees: 2500,
    totalAcres: 50,
    harvestThisSeason: 1250,
    expectedProduction: 1500,
    workersAssigned: 15,
    incomeGenerated: 75000,
    expenses: 25000
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Farm Management" subtitle="Manage your coffee plantation" actions={<PrintButton />} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coffee Trees</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrees.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Acres</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAcres}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Harvest This Season</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.harvestThisSeason} kg</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workers Assigned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.workersAssigned}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income Generated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {stats.incomeGenerated.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {stats.expenses.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Coffee Farms Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coffee Farms</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Farm
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Farm Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Size (Acres)</TableHead>
                <TableHead>Trees</TableHead>
                <TableHead>Soil Type</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coffeeFarms.map((farm) => (
                <TableRow key={farm.id}>
                  <TableCell>{farm.name}</TableCell>
                  <TableCell>{farm.location}</TableCell>
                  <TableCell>{farm.variety}</TableCell>
                  <TableCell>{farm.size}</TableCell>
                  <TableCell>{farm.trees}</TableCell>
                  <TableCell>{farm.soilType}</TableCell>
                  <TableCell className="no-print">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Coffee Trees Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Coffee Trees</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tree
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tree ID</TableHead>
                <TableHead>Variety</TableHead>
                <TableHead>Age (Years)</TableHead>
                <TableHead>Health</TableHead>
                <TableHead>Production Rate</TableHead>
                <TableHead>Last Fertilized</TableHead>
                <TableHead>Last Sprayed</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coffeeTrees.map((tree) => (
                <TableRow key={tree.id}>
                  <TableCell>{tree.treeId}</TableCell>
                  <TableCell>{tree.variety}</TableCell>
                  <TableCell>{tree.age}</TableCell>
                  <TableCell>
                    <Badge variant={tree.health === "Healthy" ? "default" : "destructive"}>
                      {tree.health}
                    </Badge>
                  </TableCell>
                  <TableCell>{tree.productionRate}</TableCell>
                  <TableCell>{new Date(tree.lastFertilized).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(tree.lastSprayed).toLocaleDateString()}</TableCell>
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