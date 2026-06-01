import { useMemo } from "react";
import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Coffee, MapPin, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeFarmPage() {
  // Coffee data from global store
  const {
    coffeeFarms,
    coffeeTrees,
    addCoffeeFarm,
    updateCoffeeFarm,
    deleteCoffeeFarm,
    addCoffeeTree,
    updateCoffeeTree,
    deleteCoffeeTree,
  } = useFarmStore();

  // Simple CRUD handlers using browser prompts for quick editability
  function handleAddFarm() {
    const name = window.prompt("Farm name:");
    if (!name) return;
    const location = window.prompt("Location:") || "";
    const variety = window.prompt("Variety:") || "";
    const size = parseFloat(window.prompt("Size (acres):") || "0") || 0;
    const trees = parseInt(window.prompt("Number of trees:") || "0") || 0;
    const soilType = window.prompt("Soil type:") || "";
    const irrigation = window.prompt("Irrigation type:") || "";

    addCoffeeFarm({
      name,
      location,
      variety,
      size,
      trees,
      plantedDate: new Date().toISOString().slice(0, 10),
      soilType,
      irrigation,
    });
  }

  function handleEditFarm(farm: any) {
    const name = window.prompt("Farm name:", farm.name) || farm.name;
    const location = window.prompt("Location:", farm.location) || farm.location;
    const variety = window.prompt("Variety:", farm.variety) || farm.variety;
    const size = parseFloat(window.prompt("Size (acres):", String(farm.size)) || String(farm.size)) || farm.size;
    const trees = parseInt(window.prompt("Number of trees:", String(farm.trees)) || String(farm.trees)) || farm.trees;
    const soilType = window.prompt("Soil type:", farm.soilType) || farm.soilType;
    const irrigation = window.prompt("Irrigation type:", farm.irrigation) || farm.irrigation;
    updateCoffeeFarm(farm.id, { name, location, variety, size, trees, soilType, irrigation });
  }

  function handleDeleteFarm(id: number) {
    if (!window.confirm("Delete this farm?")) return;
    deleteCoffeeFarm(id);
  }

  function handleAddTree() {
    const treeId = window.prompt("Tree ID:") || `T${Date.now()}`;
    const variety = window.prompt("Variety:") || "";
    const age = parseInt(window.prompt("Age (years):") || "0") || 0;
    const health = window.prompt("Health (Healthy/Suspect):") || "Healthy";
    const productionRate = window.prompt("Production Rate:") || "";
    const lastFertilized = window.prompt("Last Fertilized (YYYY-MM-DD):") || new Date().toISOString().slice(0, 10);
    const lastSprayed = window.prompt("Last Sprayed (YYYY-MM-DD):") || new Date().toISOString().slice(0, 10);

    addCoffeeTree({
      treeId,
      variety,
      plantedDate: new Date().toISOString().slice(0, 10),
      age,
      health,
      productionRate,
      lastFertilized,
      lastSprayed,
    });
  }

  function handleEditTree(tree: any) {
    const treeId = window.prompt("Tree ID:", tree.treeId) || tree.treeId;
    const variety = window.prompt("Variety:", tree.variety) || tree.variety;
    const age = parseInt(window.prompt("Age (years):", String(tree.age)) || String(tree.age)) || tree.age;
    const health = window.prompt("Health:", tree.health) || tree.health;
    const productionRate = window.prompt("Production Rate:", tree.productionRate) || tree.productionRate;
    const lastFertilized = window.prompt("Last Fertilized (YYYY-MM-DD):", tree.lastFertilized) || tree.lastFertilized;
    const lastSprayed = window.prompt("Last Sprayed (YYYY-MM-DD):", tree.lastSprayed) || tree.lastSprayed;
    updateCoffeeTree(tree.id, { treeId, variety, age, health, productionRate, lastFertilized, lastSprayed });
  }

  function handleDeleteTree(id: number) {
    if (!window.confirm("Delete this tree?")) return;
    deleteCoffeeTree(id);
  }

  const { coffeeHarvests, coffeeSales, coffeeExpenses, coffeeWorkers } = useFarmStore();

  const stats = useMemo(() => {
    const totalTrees = coffeeTrees.length || 0;
    const totalAcres = coffeeFarms.reduce((s, f) => s + (f.size || 0), 0);
    const harvestThisSeason = coffeeHarvests.reduce((s, h) => s + (h.quantity || 0), 0);
    const expectedProduction = 0;
    const workersAssigned = coffeeWorkers.length || 0;
    const incomeGenerated = coffeeSales.reduce((s, c) => s + (c.totalAmount || (c.quantitySold * c.pricePerKg) || 0), 0);
    const expenses = coffeeExpenses.reduce((s, e) => s + (e.amount || 0), 0);
    return { totalTrees, totalAcres, harvestThisSeason, expectedProduction, workersAssigned, incomeGenerated, expenses };
  }, [coffeeFarms, coffeeTrees, coffeeHarvests, coffeeSales, coffeeExpenses, coffeeWorkers]);

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
          <Button onClick={handleAddFarm}>
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
                    <Button variant="ghost" size="sm" onClick={() => handleEditFarm(farm)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteFarm(farm.id)}>Delete</Button>
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
          <Button onClick={handleAddTree}>
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
                    <Button variant="ghost" size="sm" onClick={() => handleEditTree(tree)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTree(tree.id)}>Delete</Button>
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