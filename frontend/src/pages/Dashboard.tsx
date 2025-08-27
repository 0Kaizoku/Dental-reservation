import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Clock,
  CalendarCheck,
  TrendingUp,
  Plus
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAppointments } from "@/hooks/useAppointments";

const Dashboard = () => {
  const { toast } = useToast();
  const { addAppointment } = useAppointments();
  const navigate = useNavigate();

  // UI state for dialogs
  const [openNewAppointment, setOpenNewAppointment] = useState(false);
  const [openNewPatient, setOpenNewPatient] = useState(false);

  // New Patient form state
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientDob, setPatientDob] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientCin, setPatientCin] = useState("");
  const [patientMatricule, setPatientMatricule] = useState("");

  // New Appointment form state
  const [appointmentPatientId, setAppointmentPatientId] = useState("");
  const [appointmentPatientName, setAppointmentPatientName] = useState("");
  const [appointmentDoctor, setAppointmentDoctor] = useState("");
  const [appointmentCabinet, setAppointmentCabinet] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDuration, setAppointmentDuration] = useState("");
  const [appointmentNature, setAppointmentNature] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");

  // Mock data - replace with real API calls
  const stats = {
    totalAppointments: 248,
    todayAppointments: 12,
    totalPatients: 156,
    availableSlots: 24
  };

  const recentAppointments = [
    { id: 1, patient: "Sarah Johnson", time: "09:00", type: "Cleaning", status: "confirmed" },
    { id: 2, patient: "Mike Wilson", time: "10:30", type: "Checkup", status: "pending" },
    { id: 3, patient: "Emma Davis", time: "14:00", type: "Root Canal", status: "confirmed" },
    { id: 4, patient: "John Smith", time: "15:30", type: "Filling", status: "completed" },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const handleSubmitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Patient saved (preview)",
      description: `${patientFirstName} ${patientLastName} has been captured. Backend save to be wired.`,
    });
    setOpenNewPatient(false);
    setPatientFirstName("");
    setPatientLastName("");
    setPatientDob("");
    setPatientGender("");
    setPatientCin("");
    setPatientMatricule("");
  };

  const handleSubmitNewAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDate || !appointmentTime || !appointmentPatientName) {
      toast({ title: "Missing info", description: "Please fill at least patient, date and time." });
      return;
    }
    addAppointment({
      date: appointmentDate,
      time: appointmentTime,
      patient: appointmentPatientName,
      type: appointmentNature || "Consultation",
      duration: appointmentDuration || "30 min",
    });
    toast({
      title: "Appointment saved",
      description: `${appointmentPatientName} on ${appointmentDate} at ${appointmentTime}.`,
    });
    setOpenNewAppointment(false);
    setAppointmentPatientId("");
    setAppointmentPatientName("");
    setAppointmentDoctor("");
    setAppointmentCabinet("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentDuration("");
    setAppointmentNature("");
    setAppointmentNotes("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening today.
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
            <form className="space-y-4" onSubmit={handleSubmitNewAppointment}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" placeholder="e.g. Sarah Johnson" value={appointmentPatientName} onChange={(e) => setAppointmentPatientName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input id="patientId" placeholder="e.g. 123" value={appointmentPatientId} onChange={(e) => setAppointmentPatientId(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor</Label>
                  <Input id="doctor" placeholder="e.g. Dr. Ahmed" value={appointmentDoctor} onChange={(e) => setAppointmentDoctor(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="cabinet">Cabinet</Label>
                  <Input id="cabinet" placeholder="e.g. C01" value={appointmentCabinet} onChange={(e) => setAppointmentCabinet(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={appointmentDuration} onValueChange={setAppointmentDuration}>
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
                  <Input id="nature" placeholder="e.g. Cleaning, Checkup" value={appointmentNature} onChange={(e) => setAppointmentNature(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional observations..." value={appointmentNotes} onChange={(e) => setAppointmentNotes(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpenNewAppointment(false)}>Cancel</Button>
                <Button type="submit">Save Appointment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-soft bg-gradient-to-br from-dental-light-blue to-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Appointments
            </CardTitle>
            <Calendar className="h-5 w-5 text-dental-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalAppointments}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Today's Appointments
            </CardTitle>
            <CalendarCheck className="h-5 w-5 text-dental-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              +3 from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Patients
            </CardTitle>
            <Users className="h-5 w-5 text-dental-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Active patients
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Available Slots
            </CardTitle>
            <Clock className="h-5 w-5 text-dental-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.availableSlots}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Appointments</CardTitle>
            <CardDescription>
              Today's scheduled appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {appointment.time}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={getStatusBadge(appointment.status)}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>
              Frequently used features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Dialog open={openNewAppointment} onOpenChange={setOpenNewAppointment}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
                  >
                    <CalendarCheck className="w-5 h-5 text-dental-blue" />
                    <span className="text-sm">New Appointment</span>
                  </Button>
                </DialogTrigger>
              </Dialog>

              <Dialog open={openNewPatient} onOpenChange={setOpenNewPatient}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
                  >
                    <Users className="w-5 h-5 text-dental-blue" />
                    <span className="text-sm">Add Patient</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>New Patient</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={handleSubmitNewPatient}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" placeholder="e.g. Sarah" value={patientFirstName} onChange={(e) => setPatientFirstName(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" placeholder="e.g. Johnson" value={patientLastName} onChange={(e) => setPatientLastName(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="dob">Date of birth</Label>
                        <Input id="dob" type="date" value={patientDob} onChange={(e) => setPatientDob(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={patientGender} onValueChange={setPatientGender}>
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
                        <Input id="cin" placeholder="e.g. AA123456" value={patientCin} onChange={(e) => setPatientCin(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="matricule">Matricule</Label>
                        <Input id="matricule" placeholder="e.g. 123456789" value={patientMatricule} onChange={(e) => setPatientMatricule(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setOpenNewPatient(false)}>Cancel</Button>
                      <Button type="submit">Save Patient</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
                onClick={() => navigate('/calendar')}
              >
                <Calendar className="w-5 h-5 text-dental-blue" />
                <span className="text-sm">View Calendar</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
                onClick={() => navigate('/slots')}
              >
                <Clock className="w-5 h-5 text-dental-blue" />
                <span className="text-sm">Manage Slots</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;