import { useEffect, useMemo, useState } from "react";
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
  Calendar,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAppointments } from "@/hooks/useAppointments";
import { apiService, RdvPatient } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const toUiItem = (r: RdvPatient) => ({
  id: r.numRdv ?? Date.now(),
  patient: r.nomPer || "",
  doctor: r.nomPs || "",
  date: r.dateRdv ? String(r.dateRdv).slice(0, 10) : "",
  time: r.heure || "",
  type: r.natureSoin || "",
  status: "confirmed",
  duration: r.duree || "",
  phone: "",
  numRdv: r.numRdv,
});

const Appointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { addAppointment } = useAppointments();
  const queryClient = useQueryClient();

  // Backend data
  const { data: rdvs, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => apiService.getAppointments(),
  });

  // Modal and form state (create)
  const [openNewAppointment, setOpenNewAppointment] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctor, setDoctor] = useState("");
  const [cabinet, setCabinet] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [nature, setNature] = useState("");
  const [notes, setNotes] = useState("");

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<RdvPatient | null>(null);

  const createMutation = useMutation({
    mutationFn: (payload: RdvPatient) => apiService.createAppointment(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      // also reflect in calendar
      addAppointment({
        date: created.dateRdv?.toString().slice(0,10) || date,
        time: created.heure || time,
        patient: created.nomPer || patientName,
        type: created.natureSoin || nature || "Consultation",
        duration: created.duree || duration || "30 min",
      });
      toast({ title: "Appointment created" });
      setOpenNewAppointment(false);
      setPatientName(""); setPatientId(""); setDoctor(""); setCabinet(""); setDate(""); setTime(""); setDuration(""); setNature(""); setNotes("");
    },
    onError: (err: any) => {
      toast({ title: "Create failed", description: err.message });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ numRdv, payload }: { numRdv: number; payload: RdvPatient }) => apiService.updateAppointment(numRdv, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment updated" });
      setOpenEdit(false);
      setEditing(null);
    },
    onError: (err: any) => toast({ title: "Update failed", description: err.message })
  });

  const deleteMutation = useMutation({
    mutationFn: (numRdv: number) => apiService.deleteAppointment(numRdv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment deleted" });
    },
    onError: (err: any) => toast({ title: "Delete failed", description: err.message })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !patientName) {
      toast({ title: "Missing info", description: "Please fill at least patient, date and time." });
      return;
    }
    const payload: RdvPatient = {
      idPersonne: patientId ? Number(patientId) : undefined,
      numCabinet: cabinet || null,
      dateRdv: date,
      heure: time,
      duree: duration || "30 min",
      observation: notes || null,
      nomPs: doctor || null,
      natureSoin: nature || null,
      nomPer: patientName || null,
    };
    createMutation.mutate(payload);
  };

  const startEdit = (r: RdvPatient) => {
    setEditing(r);
    setOpenEdit(true);
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || editing.numRdv == null) return;
    updateMutation.mutate({
      numRdv: Number(editing.numRdv),
      payload: editing,
    });
  };

  const handleDelete = (r: RdvPatient) => {
    if (r.numRdv == null) return;
    deleteMutation.mutate(Number(r.numRdv));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const uiAppointments = useMemo(() => (rdvs || []).map(toUiItem), [rdvs]);

  const filteredAppointments = uiAppointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground">
            Manage and view all patient appointments
          </p>
        </div>
        <Dialog open={openNewAppointment} onOpenChange={setOpenNewAppointment}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>New Appointment</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" placeholder="e.g. Sarah Johnson" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" placeholder="e.g. 123" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input id="doctor" placeholder="e.g. Dr. Ahmed" value={doctor} onChange={(e) => setDoctor(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="cabinet">Cabinet</Label>
                  <Input id="cabinet" placeholder="e.g. C01" value={cabinet} onChange={(e) => setCabinet(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 min">15 minutes</SelectItem>
                      <SelectItem value="30 min">30 minutes</SelectItem>
                      <SelectItem value="45 min">45 minutes</SelectItem>
                      <SelectItem value="60 min">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nature">Nature of care</Label>
                  <Input id="nature" placeholder="e.g. Cleaning, Checkup" value={nature} onChange={(e) => setNature(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional observations..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpenNewAppointment(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>Save Appointment</Button>
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
                placeholder="Search patients, doctors, or appointment types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card className="border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-dental-blue" />
            Appointments List
            <Badge variant="outline" className="ml-auto">
              {filteredAppointments.length} appointments
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                ) : filteredAppointments.map((appointment) => {
                  const rdv = (rdvs || []).find(r => r.numRdv === appointment.numRdv);
                  return (
                    <TableRow key={appointment.id} className="hover:bg-accent/20">
                      <TableCell className="font-medium">
                        {appointment.patient}
                      </TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{appointment.date}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {appointment.time}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {appointment.duration}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={getStatusBadge(appointment.status)}
                        >
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-dental-blue hover:bg-dental-light-blue/20"
                            onClick={() => rdv && startEdit(rdv)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => rdv && handleDelete(rdv)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredAppointments.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No appointments found</p>
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
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {editing && (
            <form className="space-y-4" onSubmit={submitEdit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Patient Name</Label>
                  <Input value={editing.nomPer || ""} onChange={(e) => setEditing({ ...editing, nomPer: e.target.value })} />
                </div>
                <div>
                  <Label>Patient ID</Label>
                  <Input value={editing.idPersonne?.toString() || ""} onChange={(e) => setEditing({ ...editing, idPersonne: e.target.value ? Number(e.target.value) : undefined })} />
                </div>
                <div>
                  <Label>Doctor</Label>
                  <Input value={editing.nomPs || ""} onChange={(e) => setEditing({ ...editing, nomPs: e.target.value })} />
                </div>
                <div>
                  <Label>Cabinet</Label>
                  <Input value={editing.numCabinet || ""} onChange={(e) => setEditing({ ...editing, numCabinet: e.target.value })} />
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={editing.dateRdv ? String(editing.dateRdv).slice(0,10) : ""} onChange={(e) => setEditing({ ...editing, dateRdv: e.target.value })} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={editing.heure || ""} onChange={(e) => setEditing({ ...editing, heure: e.target.value })} />
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input value={editing.duree || ""} onChange={(e) => setEditing({ ...editing, duree: e.target.value })} />
                </div>
                <div>
                  <Label>Type</Label>
                  <Input value={editing.natureSoin || ""} onChange={(e) => setEditing({ ...editing, natureSoin: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Notes</Label>
                  <Textarea value={editing.observation || ""} onChange={(e) => setEditing({ ...editing, observation: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpenEdit(false)}>Cancel</Button>
                <Button type="submit" disabled={updateMutation.isPending}>Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;