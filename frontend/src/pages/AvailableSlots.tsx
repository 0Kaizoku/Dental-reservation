import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Filter
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePatients } from "@/hooks/usePatients";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const AvailableSlots = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { patients, loading: loadingPatients } = usePatients();
  
  // State for filters
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [slotDuration, setSlotDuration] = useState<string>("30");

  // Booking dialog state
  const [openBook, setOpenBook] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctor, setDoctor] = useState("");
  const [cabinet, setCabinet] = useState("");
  const [duration, setDuration] = useState("");
  const [nature, setNature] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<'confirmed' | 'pending' | 'canceled'>("pending");
  const [isSaving, setIsSaving] = useState(false);

  // Get all appointments
  const { data: allAppointments, isLoading } = useQuery({
    queryKey: ["appointments", { scope: "all" }],
    queryFn: () => apiService.getAppointments(),
  });

  // Generate time slots
  const generateTimeSlots = (duration: number) => {
    const slots: string[] = [];
    const startHour = 8;
    const endHour = 17; // Changed to 17 to stop at 17:30
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += duration) {
        // Skip 17:30 and beyond
        if (hour === 17 && minutes > 30) break;
        
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    
    return slots;
  };

  const timeSlots = useMemo(() => {
    return generateTimeSlots(parseInt(slotDuration));
  }, [slotDuration]);

  // Get booked slots for the selected date
  const bookedSlots = useMemo(() => {
    if (!allAppointments || !selectedDate) return [];
    
    return allAppointments
      .filter(appointment => {
        if (!appointment.dateRdv) return false;
        
        let appointmentDate = "";
        if (typeof appointment.dateRdv === 'string') {
          appointmentDate = appointment.dateRdv.slice(0, 10);
        } else {
          appointmentDate = new Date(appointment.dateRdv).toISOString().slice(0, 10);
        }
        
        return appointmentDate === selectedDate;
      })
      .map(appointment => appointment.heure)
      .filter(Boolean)
      .map(time => time?.slice(0, 5) || "");
  }, [allAppointments, selectedDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSlots = timeSlots.length;
    const bookedCount = bookedSlots.length;
    const availableCount = totalSlots - bookedCount;
    const utilizationRate = totalSlots > 0 ? Math.round((bookedCount / totalSlots) * 100) : 0;
    
    return {
      totalSlots,
      bookedCount,
      availableCount,
      utilizationRate
    };
  }, [timeSlots, bookedSlots]);

  const handleDateChange = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - 1);
    } else {
      newDate.setDate(currentDate.getDate() + 1);
    }
    
    setSelectedDate(newDate.toISOString().slice(0, 10));
  };

  const isSlotAvailable = (slot: string) => {
    return !bookedSlots.includes(slot);
  };

  const onClickSlot = (slot: string) => {
    if (!isSlotAvailable(slot)) return;
    setSelectedSlot(slot);
    // prefill duration from sidebar selection
    setDuration(slotDuration ? `${slotDuration} min` : "30 min");
    setOpenBook(true);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !patientId) {
      toast({ title: "Missing info", description: "Please select an active patient, and ensure date and time are set." });
      return;
    }
    try {
      setIsSaving(true);
      await apiService.createAppointment({
        idPersonne: Number(patientId),
        numCabinet: cabinet || null,
        dateRdv: selectedDate,
        heure: selectedSlot,
        duree: duration || "30 min",
        observation: notes || null,
        nomPs: doctor || null,
        natureSoin: nature || null,
        nomPer: patientName || null,
        status,
      });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({ title: "Appointment booked", description: `${patientName} on ${selectedDate} at ${selectedSlot}` });
      // reset minimal
      setOpenBook(false);
      setPatientName(""); setPatientId(""); setDoctor(""); setCabinet(""); setDuration(""); setNature(""); setNotes(""); setStatus('pending');
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Slots</h1>
              <p className="text-muted-foreground">View and manage available time slots for appointments</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-lg border p-1 shadow-sm">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDateChange('prev')}
                  className="h-9 w-9 p-0 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center min-w-[180px]">
                  <div className="text-sm font-medium text-gray-500">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDateChange('next')}
                  className="h-9 w-9 p-0 hover:bg-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-[150px]"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="space-y-6 xl:col-span-1">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-dental-blue" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="duration">Slot Duration</Label>
                  <Select value={slotDuration} onValueChange={setSlotDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-dental-accent" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Slots</span>
                  <span className="font-medium text-foreground">{stats.totalSlots}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <span className="font-medium text-green-600">{stats.availableCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Booked</span>
                  <span className="font-medium text-red-600">{stats.bookedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Utilization</span>
                  <span className="font-medium text-dental-blue">{stats.utilizationRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Slots Grid */}
          <div className="xl:col-span-4">
            <Card className="border-0 shadow-soft overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Calendar className="h-5 w-5 text-dental-blue" />
                      Available Time Slots
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Showing slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2
                  ">
                    <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span>Available: {stats.availableCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <span>Booked: {stats.bookedCount}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
                  {timeSlots.map((slot) => {
                    const isAvailable = isSlotAvailable(slot);
                    const isBooked = bookedSlots.includes(slot);
                    
                    return (
                      <div
                        key={slot}
                        className={`group relative p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                          isAvailable 
                            ? 'bg-white border-green-100 hover:border-green-300 hover:shadow-md cursor-pointer hover:-translate-y-0.5' 
                            : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-70'
                        }`}
                        title={isAvailable ? `Book appointment at ${slot}` : 'This slot is already booked'}
                        onClick={() => onClickSlot(slot)}
                      >
                        <div className={`text-lg font-semibold mb-1 ${
                          isAvailable ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {slot}
                        </div>
                        
                        <div className="absolute top-2 right-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${
                            isAvailable ? 'bg-green-400' : 'bg-gray-300'
                          }`}></div>
                        </div>
                        
                        <div className="mt-2">
                          {isAvailable ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                              Booked
                            </span>
                          )}
                        </div>
                        
                        {isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                              Click to book
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card className="border-0 shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
                <span className="text-muted-foreground">Available slots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                <span className="text-muted-foreground">Booked slots</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Click on available slots to book</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Booking Dialog */}
      <Dialog open={openBook} onOpenChange={setOpenBook}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateAppointment}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input value={selectedDate} readOnly className="bg-muted" />
              </div>
              <div>
                <Label>Time</Label>
                <Input value={selectedSlot} readOnly className="bg-muted" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="patient">Patient (active only)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {patientId
                        ? `${patients.find(p => p.id.toString() === patientId)?.name || "Unknown"} (${patientId})`
                        : (loadingPatients ? "Loading patients..." : "Select patient")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                    <Command>
                      <CommandInput placeholder="Search patients..." />
                      <CommandEmpty>No patient found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup heading="Active Patients">
                          {patients.filter(p => p.status === 'active').map(p => (
                            <CommandItem
                              key={p.id}
                              value={`${p.name} ${p.id}`}
                              onSelect={() => {
                                setPatientId(p.id.toString());
                                setPatientName(p.name);
                              }}
                            >
                              {p.name} ({p.id})
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="doctor">Doctor</Label>
                <Input id="doctor" value={doctor} onChange={(e) => setDoctor(e.target.value)} placeholder="e.g. Dr. Ahmed" />
              </div>
              <div>
                <Label htmlFor="cabinet">Cabinet</Label>
                <Input id="cabinet" value={cabinet} onChange={(e) => setCabinet(e.target.value)} placeholder="e.g. C01" />
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
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(v: 'confirmed' | 'pending' | 'canceled') => setStatus(v)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="nature">Nature of care</Label>
                <Input id="nature" value={nature} onChange={(e) => setNature(e.target.value)} placeholder="e.g. Cleaning, Checkup" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional observations..." rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenBook(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving}>Book</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableSlots;