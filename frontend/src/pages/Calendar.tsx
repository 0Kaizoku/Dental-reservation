import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock
} from "lucide-react";
import { useMemo, useState } from "react";
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
import { apiService, RdvPatient } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePatients } from "@/hooks/usePatients";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const Calendar = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { patients, loading: loadingPatients } = usePatients();

  // Navigation state (week offset from current week)
  const [weekOffset, setWeekOffset] = useState(0);

  // Modal + form state
  const [openNew, setOpenNew] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [doctor, setDoctor] = useState("");
  const [cabinet, setCabinet] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [nature, setNature] = useState("");
  const [notes, setNotes] = useState("");
  const [patientId, setPatientId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'confirmed' | 'pending' | 'canceled'>("pending");

  // Edit modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<RdvPatient | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editStatus, setEditStatus] = useState<'confirmed' | 'pending' | 'canceled'>("pending");

  // Helper functions
  const getStartOfWeek = (d: Date) => {
    const dateCopy = new Date(d);
    const day = dateCopy.getDay(); // 0 Sun ... 6 Sat
    const diffToMonday = ((day + 6) % 7); // Mon=0
    dateCopy.setDate(dateCopy.getDate() - diffToMonday);
    dateCopy.setHours(0,0,0,0);
    return dateCopy;
  };

  const addDays = (d: Date, days: number) => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + days);
    return nd;
  };

  const toYmd = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Calculate current week
  const currentWeekStart = useMemo(() => {
    const now = new Date();
    const base = getStartOfWeek(now);
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const currentMonth = useMemo(() => {
    return currentWeekStart.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [currentWeekStart]);

  // Load appointments from API
  const { data: rdvs, isLoading, error } = useQuery({
    queryKey: ["appointments", { scope: "calendar" }],
    queryFn: () => apiService.getAppointments(),
  });

  // Transform API data to UI format
  const toUiItem = (r: RdvPatient) => {
    let formattedDate = "";
    if (r.dateRdv) {
      if (typeof r.dateRdv === 'string') {
        formattedDate = r.dateRdv.slice(0, 10);
      } else {
        const date = new Date(r.dateRdv);
        formattedDate = date.toISOString().slice(0, 10);
      }
    }

    let formattedTime = "";
    if (r.heure) {
      formattedTime = r.heure.slice(0, 5);
    }

    return {
      id: r.numRdv ?? Date.now(),
      date: formattedDate,
      time: formattedTime,
      patient: r.nomPer || "",
      type: r.natureSoin || "Consultation",
      duration: r.duree || "30 min",
      numRdv: r.numRdv,
      status: (r.status as 'confirmed' | 'pending' | 'canceled' | undefined) || 'pending',
    };
  };

  const serverAppointments = useMemo(() => {
    return (rdvs || []).map(toUiItem);
  }, [rdvs]);

  // Create time slots (standard 30-minute intervals only, strictly from 08:00 to 17:30)
  const slots = useMemo(() => {
    const standardTimes: string[] = [];
    for (let h = 8; h < 18; h++) {
      const hh = String(h).padStart(2, '0');
      standardTimes.push(`${hh}:00`);
      standardTimes.push(`${hh}:30`);
    }
    return standardTimes;
  }, []);

  // Today's appointments
  const todayYmd = toYmd(new Date());
  const currentHalfHour = useMemo(() => {
    const now = new Date();
    const mins = now.getMinutes();
    const rounded = mins < 30 ? 0 : 30;
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = rounded === 0 ? '00' : '30';
    return `${hh}:${mm}`;
  }, []);
  const todaysAppointments = useMemo(() => {
    return (serverAppointments || [])
      .filter(a => a.date === todayYmd)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [serverAppointments, todayYmd]);

  // Create new appointment
  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !patientId) {
      toast({ title: "Missing info", description: "Please select an active patient, date and time." });
      return;
    }

    try {
      setIsSaving(true);
      await apiService.createAppointment({
        idPersonne: Number(patientId),
        numCabinet: cabinet || null,
        dateRdv: date,
        heure: time,
        duree: duration || "30 min",
        observation: notes || null,
        nomPs: doctor || null,
        natureSoin: nature || null,
        nomPer: patientName || null,
        status,
      });
      
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment added", description: `${patientName} on ${date} at ${time}` });
      
      // Reset form
      setOpenNew(false);
      setPatientName("");
      setPatientId("");
      setDoctor("");
      setCabinet("");
      setDate("");
      setTime("");
      setDuration("");
      setNature("");
      setNotes("");
      setStatus('pending');
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Navigate to appointments
  const goToAppointments = () => {
    if (serverAppointments.length > 0) {
      // Find the earliest appointment date
      const appointmentDates = serverAppointments
        .map(a => a.date)
        .filter(date => date)
        .sort();
      
      if (appointmentDates.length > 0) {
        const earliestDate = new Date(appointmentDates[0]);
        const currentDate = new Date();
        const baseWeekStart = getStartOfWeek(currentDate);
        const appointmentWeekStart = getStartOfWeek(earliestDate);
        
        // Calculate the difference in weeks
        const diffMs = appointmentWeekStart.getTime() - baseWeekStart.getTime();
        const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
        
        setWeekOffset(diffWeeks);
        toast({ 
          title: "Navigated to appointments", 
          description: `Showing week of ${earliestDate.toLocaleDateString()}` 
        });
      }
    }
  };

  // Handle clicking on an appointment to edit it
  const handleAppointmentClick = (appointment: any) => {
    if (!appointment.numRdv) {
      toast({ title: "Cannot edit", description: "This appointment cannot be edited.", variant: "destructive" });
      return;
    }
    
    // Find the original appointment data
    const originalAppointment = rdvs?.find(r => r.numRdv === appointment.numRdv);
    if (!originalAppointment) {
      toast({ title: "Error", description: "Appointment not found.", variant: "destructive" });
      return;
    }

    setEditing(originalAppointment);
    setEditDate(appointment.date);
    setEditTime(appointment.time);
    setEditDuration(appointment.duration);
    setEditStatus((originalAppointment.status as any) || 'pending');
    setOpenEdit(true);
  };

  // Handle updating an appointment
  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || editing.numRdv == null) return;

    try {
      await apiService.updateAppointment(Number(editing.numRdv), {
        ...editing,
        dateRdv: editDate,
        heure: editTime,
        duree: editDuration || "30 min",
        status: editStatus,
      });
      
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment updated successfully" });
      setOpenEdit(false);
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  // Handle deleting an appointment
  const handleDeleteAppointment = async () => {
    if (!editing || editing.numRdv == null) return;

    if (!confirm(`Are you sure you want to delete the appointment for ${editing.nomPer}?`)) {
      return;
    }

    try {
      await apiService.deleteAppointment(Number(editing.numRdv));
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment deleted successfully" });
      setOpenEdit(false);
      setEditing(null);
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full bg-white shadow-lg rounded-xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium text-foreground min-w-[200px] text-center">
                {currentMonth}
              </span>
              <Button variant="outline" size="icon" onClick={() => setWeekOffset(weekOffset + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {serverAppointments && serverAppointments.length > 0 && (
              <Button variant="outline" onClick={goToAppointments}>
                Go to Appointments
              </Button>
            )}
          </div>
          {/* New Appointment removed: display-only */}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Calendar Grid */}
          <div className="xl:col-span-4">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-dental-blue" />
                  Weekly View
                </CardTitle>
                {/* Removed verbose debug info for compact design */}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading appointments...</div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-destructive">Error loading appointments: {error.message}</div>
                  </div>
                ) : !serverAppointments || serverAppointments.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">No appointments found. Try clicking "Go to Appointments" or create a new appointment.</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Days header (sticky) */}
                    <div className="grid grid-cols-8 gap-2 sticky top-0 z-10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
                      <div className="p-2"></div>
                      {weekDates.map((d, idx) => (
                        <div key={idx} className={`p-2 text-center font-medium rounded-lg ${toYmd(d) === todayYmd ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                          <div className="text-sm font-semibold text-gray-600">
                            {d.toLocaleDateString(undefined, { weekday: 'short' })}
                          </div>
                          <div className="mt-0.5 text-base font-bold text-gray-900">{d.getDate()}</div>
                        </div>
                      ))}
                    </div>

                    {/* Time slots */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {slots.map((slot) => (
                        <div key={slot} className="grid grid-cols-8 col-span-8 gap-2 py-1 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="p-2 text-sm text-gray-600 font-medium flex items-center justify-end">
                            {slot}
                          </div>
                          {weekDates.map((d, dayIndex) => {
                            const ymd = toYmd(d);
                            const items = (serverAppointments || []).filter(a => a.date === ymd && a.time === slot);
                            return (
                              <div
                                key={`${slot}-${dayIndex}`}
                                className="p-1.5 min-h-[48px] border border-gray-100 rounded-lg bg-white transition-colors relative"
                              >
                                {/* Current time indicator line on today's column (nearest half-hour) */}
                                {ymd === todayYmd && slot === currentHalfHour && (
                                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500/80"></div>
                                )}
                                <div className="flex flex-col gap-2">
                                  {items.map((a) => (
                                    <div 
                                      key={a.id} 
                                      className={`${a.status === 'confirmed' ? 'bg-green-50 border-l-4 border-green-400' : a.status === 'pending' ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-red-50 border-l-4 border-red-400'} rounded-r-md p-2 text-xs mb-1 transition-all duration-200 group shadow-sm`}
                                      title={`${a.patient} — ${a.type}`}
                                    >
                                      <div className="font-medium text-dental-blue text-[13px]">{a.patient}</div>
                                      <div className="text-muted-foreground text-[11px]">{a.type}</div>
                                      <div className="mt-1 flex items-center gap-1.5">
                                        <Badge variant="outline" className={`${a.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' : a.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'} text-xxs`}> 
                                          {a.status}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right side: Today's Schedule + Quick Stats */}
          <div className="space-y-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-dental-accent" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-3 rounded-lg border border-border/20 hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-dental-blue">
                          {appointment.time}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {appointment.duration}
                          </Badge>
                          <Badge variant="outline" className={`${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' : appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200'} text-xxs`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-foreground">
                          {appointment.patient}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.type}
                        </p>
                      </div>
                    </div>
                  ))}
                  {todaysAppointments.length === 0 && (
                    <div className="text-sm text-muted-foreground">No appointments today</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Today</span>
                  <span className="font-medium text-foreground">{todaysAppointments.length} appointments</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">First Slot</span>
                  <span className="font-medium text-dental-accent">{todaysAppointments[0]?.time || "--:--"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Hours</span>
                  <span className="font-medium text-foreground">—</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit dialog removed: Calendar is read-only */}
      </div>
    </div>
  );
};

export default Calendar;