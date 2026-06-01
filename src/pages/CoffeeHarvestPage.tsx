import { } from "react";
import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, Scale, Star, User, DollarSign } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeHarvestPage() {
  const { coffeeHarvests, addCoffeeHarvest, updateCoffeeHarvest, deleteCoffeeHarvest } = useFarmStore();

  function handleAddHarvest() {
    const harvestDate = window.prompt("Harvest Date (YYYY-MM-DD):", new Date().toISOString().slice(0, 10));
    if (!harvestDate) return;
    const quantity = parseFloat(window.prompt("Quantity (Kg):", "0") || "0") || 0;
    const qualityGrade = window.prompt("Quality Grade:", "Standard") || "Standard";
    const collectedBy = window.prompt("Collected By:", "") || "";
    const sellingPrice = parseFloat(window.prompt("Selling Price (KSh/kg):", "0") || "0") || 0;
    const buyerName = window.prompt("Buyer Name:", "") || "";

    addCoffeeHarvest({ harvestDate, quantity, qualityGrade, collectedBy, sellingPrice, buyerName });
  }

  function handleEditHarvest(h: any) {
    const harvestDate = window.prompt("Harvest Date (YYYY-MM-DD):", h.harvestDate) || h.harvestDate;
    const quantity = parseFloat(window.prompt("Quantity (Kg):", String(h.quantity)) || String(h.quantity)) || h.quantity;
    const qualityGrade = window.prompt("Quality Grade:", h.qualityGrade) || h.qualityGrade;
    const collectedBy = window.prompt("Collected By:", h.collectedBy) || h.collectedBy;
    const sellingPrice = parseFloat(window.prompt("Selling Price (KSh/kg):", String(h.sellingPrice || 0)) || String(h.sellingPrice || 0)) || h.sellingPrice;
    const buyerName = window.prompt("Buyer Name:", h.buyerName) || h.buyerName;

    updateCoffeeHarvest(h.id, { harvestDate, quantity, qualityGrade, collectedBy, sellingPrice, buyerName });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Harvest Management" subtitle="Track coffee harvests and sales" actions={<PrintButton />} />

      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Harvest Records</CardTitle>
          <Button onClick={handleAddHarvest}>
            <Plus className="h-4 w-4 mr-2" />
            Add Harvest
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Harvest Date</TableHead>
                <TableHead>Quantity (Kg)</TableHead>
                <TableHead>Quality Grade</TableHead>
                <TableHead>Collected By</TableHead>
                <TableHead>Selling Price (KSh/kg)</TableHead>
                <TableHead>Buyer Name</TableHead>
                <TableHead>Total Earnings (KSh)</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coffeeHarvests.map((harvest) => (
                <TableRow key={harvest.id}>
                  <TableCell>{new Date(harvest.harvestDate).toLocaleDateString()}</TableCell>
                  <TableCell>{harvest.quantity}</TableCell>
                  <TableCell>
                    <Badge variant={harvest.qualityGrade === "Premium" ? "default" : "secondary"}>
                      {harvest.qualityGrade}
                    </Badge>
                  </TableCell>
                  <TableCell>{harvest.collectedBy}</TableCell>
                  <TableCell>{harvest.sellingPrice}</TableCell>
                  <TableCell>{harvest.buyerName}</TableCell>
                  <TableCell>{(harvest.totalEarnings || 0).toLocaleString()}</TableCell>
                  <TableCell className="no-print">
                    <Button variant="ghost" size="sm" onClick={() => handleEditHarvest(harvest)}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteCoffeeHarvest(harvest.id)}>Delete</Button>
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