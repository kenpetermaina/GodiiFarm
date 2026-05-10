import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, User, Scale, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeSalesPage() {
  const [sales] = useState([
    {
      id: 1,
      buyerName: "Kenya Coffee Company",
      quantitySold: 500,
      pricePerKg: 150,
      totalAmount: 75000,
      paymentStatus: "Paid",
      saleDate: "2024-03-20"
    },
    {
      id: 2,
      buyerName: "Local Market",
      quantitySold: 200,
      pricePerKg: 120,
      totalAmount: 24000,
      paymentStatus: "Pending",
      saleDate: "2024-03-18"
    }
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Sales" subtitle="Track coffee sales and payments" actions={<PrintButton />} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Records</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Sale
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer Name</TableHead>
                <TableHead>Quantity Sold (Kg)</TableHead>
                <TableHead>Price Per Kg (KSh)</TableHead>
                <TableHead>Total Amount (KSh)</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Sale Date</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.buyerName}</TableCell>
                  <TableCell>{sale.quantitySold}</TableCell>
                  <TableCell>{sale.pricePerKg}</TableCell>
                  <TableCell>{sale.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={sale.paymentStatus === "Paid" ? "default" : "secondary"}>
                      {sale.paymentStatus === "Paid" ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Paid</>
                      ) : (
                        <><Clock className="h-3 w-3 mr-1" /> Pending</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
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