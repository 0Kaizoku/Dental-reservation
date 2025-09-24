import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Users,
  Calendar,
  Phone,
  Mail
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiService, Patient } from "@/lib/api";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Modal and form state
  const [openNewPatient, setOpenNewPatient] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [cin, setCin] = useState("");
  const [matricule, setMatricule] = useState("");
  const [codeCivilitePer, setCodeCivilitePer] = useState("");
  const [idNumFamillePer, setIdNumFamillePer] = useState("");
  const [codeQualitePersonnePer, setCodeQualitePersonnePer] = useState("");
  const [codeStatutPer, setCodeStatutPer] = useState("");
  const [codeSituationFamilialePer, setCodeSituationFamilialePer] = useState("");
  const [idNumAdressePer, setIdNumAdressePer] = useState("");
  const [codeCollectivitePer, setCodeCollectivitePer] = useState("");
  const [autorisation, setAutorisation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editDob, setEditDob] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editCin, setEditCin] = useState("");
  const [editMatricule, setEditMatricule] = useState("");
  const [editCodeCivilitePer, setEditCodeCivilitePer] = useState("");
  const [editIdNumFamillePer, setEditIdNumFamillePer] = useState("");
  const [editCodeQualitePersonnePer, setEditCodeQualitePersonnePer] = useState("");
  const [editCodeStatutPer, setEditCodeStatutPer] = useState("");
  const [editCodeSituationFamilialePer, setEditCodeSituationFamilialePer] = useState("");
  const [editIdNumAdressePer, setEditIdNumAdressePer] = useState("");
  const [editCodeCollectivitePer, setEditCodeCollectivitePer] = useState("");
  const [editAutorisation, setEditAutorisation] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await apiService.createPatient({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        dateOfBirth: dob || undefined,
        gender: gender || undefined,
        cin: cin || undefined,
        matricule: matricule || undefined,
        codeCivilitePer: codeCivilitePer || undefined,
        idNumFamillePer: idNumFamillePer ? Number(idNumFamillePer) : undefined,
        codeQualitePersonnePer: codeQualitePersonnePer || undefined,
        codeStatutPer: codeStatutPer || undefined,
        codeSituationFamilialePer: codeSituationFamilialePer || undefined,
        idNumAdressePer: idNumAdressePer ? Number(idNumAdressePer) : undefined,
        codeCollectivitePer: codeCollectivitePer || undefined,
        autorisation: autorisation || undefined,
        email: email || undefined,
        phone: phone || undefined,
      });
      toast({ title: "Patient saved", description: `${created.name} created successfully.` });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setOpenNewPatient(false);
      setFirstName("");
      setLastName("");
      setDob("");
      setGender("");
      setCin("");
      setMatricule("");
      setCodeCivilitePer("");
      setIdNumFamillePer("");
      setCodeQualitePersonnePer("");
      setCodeStatutPer("");
      setCodeSituationFamilialePer("");
      setIdNumAdressePer("");
      setCodeCollectivitePer("");
      setAutorisation("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message || "Could not create patient", variant: "destructive" });
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number, payload: {
      firstName?: string;
      lastName?: string;
      dateOfBirth?: string;
      gender?: string;
      cin?: string;
      matricule?: string;
      codeCivilitePer?: string;
      idNumFamillePer?: number;
      codeQualitePersonnePer?: string;
      codeStatutPer?: string;
      codeSituationFamilialePer?: string;
      idNumAdressePer?: number;
      codeCollectivitePer?: string;
      autorisation?: string;
      email?: string;
      phone?: string;
    } }) =>
      apiService.updatePatient(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Patient updated" });
    },
    onError: (err: any) => toast({ title: "Update failed", description: err.message, variant: "destructive" })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast({ title: "Patient deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err.message, variant: "destructive" })
  });

  const startEdit = (p: { id: number; name: string; gender?: string; email?: string; phone?: string; }): void => {
    setEditingId(p.id);
    const parts = (p.name || "").trim().split(" ");
    const first = parts.shift() || "";
    const last = parts.join(" ");
    setEditFirstName(first);
    setEditLastName(last);
    setEditGender(p.gender === "Female" ? "2" : p.gender === "Male" ? "1" : "");
    setEditDob("");
    setEditCin("");
    setEditMatricule("");
    setEditEmail(p.email || "");
    setEditPhone(p.phone || "");
    setOpenEdit(true);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId == null) return;
          updateMutation.mutate({
        id: editingId,
        payload: {
          firstName: editFirstName || undefined,
          lastName: editLastName || undefined,
          dateOfBirth: editDob || undefined,
          gender: editGender || undefined,
          cin: editCin || undefined,
          matricule: editMatricule || undefined,
          email: editEmail || undefined,
          phone: editPhone || undefined,
          codeCivilitePer: editCodeCivilitePer || undefined,
          idNumFamillePer: editIdNumFamillePer ? Number(editIdNumFamillePer) : undefined,
          codeQualitePersonnePer: editCodeQualitePersonnePer || undefined,
          codeStatutPer: editCodeStatutPer || undefined,
          codeSituationFamilialePer: editCodeSituationFamilialePer || undefined,
          idNumAdressePer: editIdNumAdressePer ? Number(editIdNumAdressePer) : undefined,
          codeCollectivitePer: editCodeCollectivitePer || undefined,
          autorisation: editAutorisation || undefined,
        }
      });
    setOpenEdit(false);
    setEditingId(null);
  };

  // Backend data
  const { data: serverPatients, isLoading } = useQuery({
    queryKey: ["patients", { name: searchTerm, status: statusFilter }],
    queryFn: () => apiService.getPatients(searchTerm || undefined, statusFilter === "all" ? undefined : statusFilter),
  });

  // Map server patients to UI with computed age
  const patients = useMemo(() => {
    const src = serverPatients || [] as Patient[];
    const computeAge = (dob?: string) => {
      if (!dob) return "";
      const d = new Date(dob);
      if (isNaN(d.getTime())) return "";
      const diff = Date.now() - d.getTime();
      const ageDt = new Date(diff);
      return Math.abs(ageDt.getUTCFullYear() - 1970);
    };
    return src.map(p => ({
      id: p.id,
      name: p.name,
      age: computeAge(p.dateOfBirth),
      gender: p.gender,
      phone: p.phone,
      email: p.email,
      lastVisit: p.lastVisit,
      status: p.status,
    }));
  }, [serverPatients]);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      new: "bg-blue-100 text-blue-800 border-blue-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200"
    } as const;
    return variants[status as keyof typeof variants] || variants.active;
  };

  const filteredPatients = patients.filter(patient => {
    const name = (patient.name || "").toLowerCase();
    const phone = (patient.phone || "").toLowerCase();
    const email = (patient.email || "").toLowerCase();
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-purple-800">Patients</h1>
          <p className="text-gray-600">
            Manage and view all patients
          </p>
        </div>
        <Dialog open={openNewPatient} onOpenChange={setOpenNewPatient}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              New Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-purple-800">New Patient</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="e.g. Sarah" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="e.g. Johnson" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Male</SelectItem>
                      <SelectItem value="2">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cin">CIN</Label>
                  <Input id="cin" placeholder="e.g. AA123456" value={cin} onChange={(e) => setCin(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input id="matricule" placeholder="e.g. 123456789" value={matricule} onChange={(e) => setMatricule(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="codeCivilitePer">Code Civilité</Label>
                  <Input id="codeCivilitePer" placeholder="e.g. M, Mme, Dr" value={codeCivilitePer} onChange={(e) => setCodeCivilitePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="idNumFamillePer">ID Famille</Label>
                  <Input id="idNumFamillePer" type="number" placeholder="e.g. 123" value={idNumFamillePer} onChange={(e) => setIdNumFamillePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="codeQualitePersonnePer">Qualité Personne</Label>
                  <Input id="codeQualitePersonnePer" placeholder="e.g. Patient, Accompagnant" value={codeQualitePersonnePer} onChange={(e) => setCodeQualitePersonnePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="codeStatutPer">Statut</Label>
                  <Input id="codeStatutPer" placeholder="e.g. Actif, Inactif" value={codeStatutPer} onChange={(e) => setCodeStatutPer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="codeSituationFamilialePer">Situation Familiale</Label>
                  <Input id="codeSituationFamilialePer" placeholder="e.g. Célibataire, Marié" value={codeSituationFamilialePer} onChange={(e) => setCodeSituationFamilialePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="idNumAdressePer">ID Adresse</Label>
                  <Input id="idNumAdressePer" type="number" placeholder="e.g. 456" value={idNumAdressePer} onChange={(e) => setIdNumAdressePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="codeCollectivitePer">Code Collectivité</Label>
                  <Input id="codeCollectivitePer" placeholder="e.g. CNSS, RAMED" value={codeCollectivitePer} onChange={(e) => setCodeCollectivitePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="autorisation">Autorisation</Label>
                  <Input id="autorisation" placeholder="e.g. Oui, Non" value={autorisation} onChange={(e) => setAutorisation(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="e.g. patient@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="e.g. +33 1 23 45 67 89" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpenNewPatient(false)}>Cancel</Button>
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Save Patient</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-dental-blue" />
            Patients List
            <Badge variant="outline" className="ml-auto">
              {filteredPatients.length} patients
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8}>Loading...</TableCell></TableRow>
                ) : filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-accent/20">
                    <TableCell className="font-medium">
                      {patient.name}
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>{patient.lastVisit}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadge(patient.status)}
                      >
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {patient.phone}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {patient.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-dental-blue hover:bg-dental-light-blue/20"
                        onClick={() => startEdit(patient)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          onClick={() => patient.id && deleteMutation.mutate(Number(patient.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No patients found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitEdit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editFirstName">First name</Label>
                <Input id="editFirstName" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="editLastName">Last name</Label>
                <Input id="editLastName" value={editLastName} onChange={(e) => setEditLastName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="editDob">Date of birth</Label>
                <Input id="editDob" type="date" value={editDob} onChange={(e) => setEditDob(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="editGender">Gender</Label>
                <Select value={editGender} onValueChange={setEditGender}>
                  <SelectTrigger id="editGender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="2">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editCin">CIN</Label>
                <Input id="editCin" value={editCin} onChange={(e) => setEditCin(e.target.value)} />
              </div>
                              <div>
                  <Label htmlFor="editMatricule">Matricule</Label>
                  <Input id="editMatricule" value={editMatricule} onChange={(e) => setEditMatricule(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editEmail">Email</Label>
                  <Input id="editEmail" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editPhone">Phone</Label>
                  <Input id="editPhone" type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editCodeCivilitePer">Code Civilité</Label>
                  <Input id="editCodeCivilitePer" value={editCodeCivilitePer} onChange={(e) => setEditCodeCivilitePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editIdNumFamillePer">ID Famille</Label>
                  <Input id="editIdNumFamillePer" type="number" value={editIdNumFamillePer} onChange={(e) => setEditIdNumFamillePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editCodeQualitePersonnePer">Qualité Personne</Label>
                  <Input id="editCodeQualitePersonnePer" value={editCodeQualitePersonnePer} onChange={(e) => setEditCodeQualitePersonnePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editCodeStatutPer">Statut</Label>
                  <Input id="editCodeStatutPer" value={editCodeStatutPer} onChange={(e) => setEditCodeStatutPer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editCodeSituationFamilialePer">Situation Familiale</Label>
                  <Input id="editCodeSituationFamilialePer" value={editCodeSituationFamilialePer} onChange={(e) => setEditCodeSituationFamilialePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editIdNumAdressePer">ID Adresse</Label>
                  <Input id="editIdNumAdressePer" type="number" value={editIdNumAdressePer} onChange={(e) => setEditIdNumAdressePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editCodeCollectivitePer">Code Collectivité</Label>
                  <Input id="editCodeCollectivitePer" value={editCodeCollectivitePer} onChange={(e) => setEditCodeCollectivitePer(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="editAutorisation">Autorisation</Label>
                  <Input id="editAutorisation" value={editAutorisation} onChange={(e) => setEditAutorisation(e.target.value)} />
                </div>
              </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending}>Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Patients;