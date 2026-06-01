import { useMemo } from "react";
import { useFarmStore } from "@/store/farmStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, User, Scale, DollarSign, Calendar, CheckCircle, Clock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";

export default function CoffeeSalesPage() {
  const { coffeeSales, addCoffeeSale, updateCoffeeSale, deleteCoffeeSale } = useFarmStore();

  function handleAddSale() {
    const saleDate = window.prompt("Sale Date (YYYY-MM-DD):", new Date().toISOString().slice(0, 10));
    if (!saleDate) return;
    const buyerName = window.prompt("Buyer Name:", "") || "";
    const quantitySold = parseFloat(window.prompt("Quantity Sold (Kg):", "0") || "0") || 0;
    const pricePerKg = parseFloat(window.prompt("Price Per Kg:", "0") || "0") || 0;
    const paymentStatus = window.prompt("Payment Status (Paid/Pending):", "Pending") || "Pending";

    addCoffeeSale({ saleDate, buyerName, quantitySold, pricePerKg, paymentStatus });
  }

  const sales = useMemo(() => coffeeSales, [coffeeSales]);

  return (
    <div className="space-y-6">
      <PageHeader title="Coffee Sales" subtitle="Track coffee sales and payments" actions={<PrintButton />} />

      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Records</CardTitle>
          <Button onClick={handleAddSale}>
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
                  <TableCell>{(sale.totalAmount || 0).toLocaleString()}</TableCell>
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
                    <Button variant="ghost" size="sm" onClick={() => updateCoffeeSale(sale.id, { paymentStatus: sale.paymentStatus === 'Paid' ? 'Pending' : 'Paid' })}>Toggle Paid</Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteCoffeeSale(sale.id)}>Delete</Button>
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