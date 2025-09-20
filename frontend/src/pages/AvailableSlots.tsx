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
import { useToast } from "@/components/ui/use-toast";
import { apiService } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const AvailableSlots = () => {
  const { toast } = useToast();
  
  // State for filters
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [slotDuration, setSlotDuration] = useState<string>("30");

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Available Slots</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleDateChange('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium text-foreground min-w-[200px] text-center">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <Button variant="outline" size="icon" onClick={() => handleDateChange('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings */}
        <div className="space-y-6">
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
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-dental-blue" />
                Available Time Slots
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                Duration: {slotDuration} min | Date: {selectedDate}
                <br />
                Debug: Booked slots: {bookedSlots.join(", ") || "None"}
                <br />
                Total appointments: {allAppointments?.length || 0}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {timeSlots.map((slot) => {
                  const isAvailable = isSlotAvailable(slot);
                  const isBooked = bookedSlots.includes(slot);
                  
                  return (
                    <div
                      key={slot}
                      className={`p-3 text-center text-sm rounded-md border transition-colors ${
                        isAvailable 
                          ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100 cursor-pointer' 
                          : 'bg-red-50 border-red-200 text-red-800 cursor-not-allowed hover:bg-red-100'
                      }`}
                      style={{
                        backgroundColor: isAvailable ? '#f0fdf4' : '#fef2f2',
                        borderColor: isAvailable ? '#bbf7d0' : '#fecaca',
                        color: isAvailable ? '#166534' : '#991b1b'
                      }}
                      title={`${slot} - ${isAvailable ? 'Available' : 'Booked'} (Debug: ${isBooked ? 'Found in bookedSlots' : 'Not in bookedSlots'})`}
                    >
                      <div className="font-medium">{slot}</div>
                      <div className="text-xs mt-1">
                        {isAvailable ? (
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                            style={{ 
                              color: '#166534', 
                              borderColor: '#bbf7d0', 
                              backgroundColor: '#f0fdf4' 
                            }}
                          >
                            Available
                          </span>
                        ) : (
                          <span 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border"
                            style={{ 
                              color: '#991b1b !important', 
                              borderColor: '#fecaca !important', 
                              backgroundColor: '#fef2f2 !important' 
                            }}
                          >
                            Booked
                          </span>
                        )}
                      </div>
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
  );
};

export default AvailableSlots;