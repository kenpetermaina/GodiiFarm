import { useFarmStore } from "@/store/farmStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import { useCow } from "@/contexts/CowContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyHerdPage() {
  const { cows, deleteCow } = useCow();

  return (
    <div>
      <PageHeader title="My Herd" subtitle="All registered cattle" actions={<PrintButton />} />
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader><TableRow><TableHead>Tag Number</TableHead><TableHead>Name</TableHead><TableHead>Breed</TableHead><TableHead>Date of Birth</TableHead><TableHead>Gender</TableHead><TableHead>Status</TableHead><TableHead className="no-print">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {cows.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>{c.tag}</TableCell><TableCell>{c.name}</TableCell><TableCell>{c.breed}</TableCell>
                  <TableCell>{c?.date_of_birth ? new Date(c?.date_of_birth).toLocaleDateString() : 'N/A'}</TableCell><TableCell>{c.gender}</TableCell>
                  <TableCell>
                    <Badge variant={c.health === "Healthy" ? "default" : "destructive"}
                      className={c.health === "Healthy" ? "bg-success" : ""}>
                      {c.health}
                    </Badge>
                  </TableCell>
                  <TableCell className="no-print">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the cow "{c.name}" with tag "{c.tag}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={async () => { 
                            try {
                              await deleteCow(c.id); 
                              toast.success("Cow deleted successfully"); 
                            } catch (error) {
                              toast.error("Failed to delete cow");
                            }
                          }}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
