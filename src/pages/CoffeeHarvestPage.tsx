import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar, Scale, Star, User, DollarSign } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeHarvestPage() {
  const [harvests] = useState([
    {
      id: 1,
      harvestDate: "2024-03-15",
      quantity: 250,
      qualityGrade: "Premium",
      collectedBy: "John Doe",
      sellingPrice: 150,
      buyerName: "Kenya Coffee Company",
      totalEarnings: 37500
    },
    {
      id: 2,
      harvestDate: "2024-02-28",
      quantity: 200,
      qualityGrade: "Standard",
      collectedBy: "Jane Smith",
      sellingPrice: 120,
      buyerName: "Local Market",
      totalEarnings: 24000
    }
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Harvest Management" subtitle="Track coffee harvests and sales" actions={<PrintButton />} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Harvest Records</CardTitle>
          <Button>
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
              {harvests.map((harvest) => (
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
                  <TableCell>{harvest.totalEarnings.toLocaleString()}</TableCell>
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