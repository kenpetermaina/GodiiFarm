import { useState } from 'react';
import { useCow } from '@/contexts/CowContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import PrintButton from '@/components/PrintButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
} from '@/components/ui/alert-dialog';

export default function MyHerdPage() {
  const { cows, deleteCow, updateCow } = useCow();
  const [cowDialogOpen, setCowDialogOpen] = useState(false);
  const [editCow, setEditCow] = useState<any>(null);
  const [formCow, setFormCow] = useState({
    tag: '',
    name: '',
    breed: '',
    date_of_birth: '',
    gender: 'female',
    health: 'Healthy',
  });

  const openEdit = (cow: any) => {
    setEditCow(cow);
    setFormCow({
      tag: cow.tag,
      name: cow.name,
      breed: cow.breed || '',
      date_of_birth: cow.date_of_birth || '',
      gender: cow.gender || 'female',
      health: cow.health || 'Healthy',
    });
    setCowDialogOpen(true);
  };

  const resetForm = () => {
    setEditCow(null);
    setFormCow({
      tag: '',
      name: '',
      breed: '',
      date_of_birth: '',
      gender: 'female',
      health: 'Healthy',
    });
  };

  const handleSaveCow = async () => {
    if (!formCow.tag.trim() || !formCow.name.trim()) {
      return toast.error('Tag and name are required');
    }

    if (!editCow) {
      return toast.error('Select a cow to update');
    }

    try {
      await updateCow(editCow.id, {
        tag: formCow.tag,
        name: formCow.name,
        breed: formCow.breed || null,
        health: formCow.health as any,
      });
      toast.success('Cow updated successfully');
      setCowDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to update cow');
    }
  };

  return (
    <div>
      <PageHeader
        title="My Herd"
        subtitle="All registered cattle"
        actions={
          <>
            <PrintButton />
            <Dialog
              open={cowDialogOpen}
              onOpenChange={(open) => {
                setCowDialogOpen(open);
                if (!open) resetForm();
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline">Edit selected cow</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editCow ? 'Edit Cow' : 'Select a cow first'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input
                    placeholder="Tag"
                    value={formCow.tag}
                    onChange={(e) => setFormCow({ ...formCow, tag: e.target.value })}
                  />
                  <Input
                    placeholder="Name"
                    value={formCow.name}
                    onChange={(e) => setFormCow({ ...formCow, name: e.target.value })}
                  />
                  <Input
                    placeholder="Breed"
                    value={formCow.breed}
                    onChange={(e) => setFormCow({ ...formCow, breed: e.target.value })}
                  />
                  <Input
                    placeholder="Date of Birth"
                    type="date"
                    value={formCow.date_of_birth}
                    onChange={(e) => setFormCow({ ...formCow, date_of_birth: e.target.value })}
                  />
                  <Select
                    value={formCow.gender}
                    onValueChange={(value) => setFormCow({ ...formCow, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={formCow.health}
                    onValueChange={(value) => setFormCow({ ...formCow, health: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Health" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Healthy">Healthy</SelectItem>
                      <SelectItem value="Monitoring">Monitoring</SelectItem>
                      <SelectItem value="Sick">Sick</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full" onClick={handleSaveCow}>
                    Update Cow
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Breed</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="no-print">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cows.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>{c.tag}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.breed}</TableCell>
                  <TableCell>{c?.date_of_birth ? new Date(c?.date_of_birth).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{c.gender}</TableCell>
                  <TableCell>
                    <Badge
                      variant={c.health === 'Healthy' ? 'default' : 'destructive'}
                      className={c.health === 'Healthy' ? 'bg-success' : ''}
                    >
                      {c.health}
                    </Badge>
                  </TableCell>
                  <TableCell className="no-print">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
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
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  await deleteCow(c.id);
                                  toast.success('Cow deleted successfully');
                                } catch (error) {
                                  toast.error('Failed to delete cow');
                                }
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
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
