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
import { useAppointments } from "@/hooks/useAppointments";

const Calendar = () => {
  const { toast } = useToast();
  const { appointments, addAppointment } = useAppointments();

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

  // Helpers for week dates
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

  // 30-minute slots from 08:00 to 16:30
  const slots = useMemo(() => {
    const times: string[] = [];
    for (let h = 8; h < 17; h++) {
      const hh = String(h).padStart(2, '0');
      times.push(`${hh}:00`);
      times.push(`${hh}:30`);
    }
    return times;
  }, []);

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !patientName) {
      toast({ title: "Missing info", description: "Please fill at least patient, date and time." });
      return;
    }

    addAppointment({
      date,
      time,
      patient: patientName,
      type: nature || "Consultation",
      duration: duration || "30 min",
    });

    // Navigate to the week of the chosen date so it becomes visible immediately
    const baseWeekStart = getStartOfWeek(new Date());
    const selectedWeekStart = getStartOfWeek(new Date(date));
    const diffMs = selectedWeekStart.getTime() - baseWeekStart.getTime();
    const diffDays = Math.round(diffMs / 86400000);
    setWeekOffset(Math.round(diffDays / 7));

    toast({ title: "Appointment added", description: `${patientName} on ${date} at ${time}` });
    setOpenNew(false);
    setPatientName("");
    setDoctor("");
    setCabinet("");
    setDate("");
    setTime("");
    setDuration("");
    setNature("");
    setNotes("");
  };

  // Today's schedule from state
  const todayYmd = toYmd(new Date());
  const todaysAppointments = useMemo(() => {
    return appointments
      .filter(a => a.date === todayYmd)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, todayYmd]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
        </div>
        <Dialog open={openNew} onOpenChange={setOpenNew}>
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
            <form className="space-y-4" onSubmit={handleSubmitNew}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input id="patientName" placeholder="e.g. Sarah Johnson" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
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
                  <Label htmlFor="nature">Type</Label>
                  <Input id="nature" placeholder="e.g. Cleaning, Checkup" value={nature} onChange={(e) => setNature(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional observations..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpenNew(false)}>Cancel</Button>
                <Button type="submit">Save Appointment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-dental-blue" />
                Weekly View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Days header */}
                <div className="grid grid-cols-8 gap-2">
                  <div className="p-2"></div>
                  {weekDates.map((d, idx) => (
                    <div key={idx} className="p-2 text-center font-medium text-muted-foreground">
                      {d.toLocaleDateString(undefined, { weekday: 'short' })}
                      <div className="text-xs text-foreground/70">{d.getDate()}</div>
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                <div className="grid grid-cols-8 gap-2">
                  {slots.map((slot) => (
                    <div key={slot} className="grid grid-cols-8 col-span-8 gap-2 border-b border-border/50 pb-2 mb-2">
                      <div className="p-2 text-sm text-muted-foreground font-medium">
                        {slot}
                      </div>
                      {weekDates.map((d, dayIndex) => {
                        const ymd = toYmd(d);
                        const items = appointments.filter(a => a.date === ymd && a.time === slot);
                        return (
                          <div
                            key={`${slot}-${dayIndex}`}
                            className="p-2 min-h-[60px] border border-border/20 rounded-md hover:bg-accent/20 cursor-pointer transition-colors"
                          >
                            {items.map((a) => (
                              <div key={a.id} className="bg-dental-blue/10 border border-dental-blue/20 rounded p-1 text-xs mb-1">
                                <div className="font-medium text-dental-blue">{a.patient}</div>
                                <div className="text-muted-foreground">{a.type}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
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
                    className="p-3 rounded-lg border border-border/20 hover:bg-accent/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm text-dental-blue">
                        {appointment.time}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {appointment.duration}
                      </Badge>
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
                <span className="font-medium text-foreground">{/* Placeholder */}—</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;