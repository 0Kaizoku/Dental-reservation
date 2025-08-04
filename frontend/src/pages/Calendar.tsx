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

const Calendar = () => {
  // Mock calendar data
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  const appointments = [
    { id: 1, time: "09:00", patient: "Sarah Johnson", type: "Cleaning", duration: "60 min" },
    { id: 2, time: "10:30", patient: "Mike Wilson", type: "Checkup", duration: "30 min" },
    { id: 3, time: "14:00", patient: "Emma Davis", type: "Root Canal", duration: "90 min" },
    { id: 4, time: "15:30", patient: "John Smith", type: "Filling", duration: "45 min" },
  ];

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 10 }, (_, i) => `${8 + i}:00`);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium text-foreground min-w-[200px] text-center">
              {currentMonth}
            </span>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
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
                  {days.map((day) => (
                    <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                <div className="grid grid-cols-8 gap-2">
                  {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 col-span-8 gap-2 border-b border-border/50 pb-2 mb-2">
                      <div className="p-2 text-sm text-muted-foreground font-medium">
                        {hour}
                      </div>
                      {days.map((day, dayIndex) => (
                        <div
                          key={`${hour}-${day}`}
                          className="p-2 min-h-[60px] border border-border/20 rounded-md hover:bg-accent/20 cursor-pointer transition-colors"
                        >
                          {hour === "09:00" && dayIndex === 0 && (
                            <div className="bg-dental-blue/10 border border-dental-blue/20 rounded p-1 text-xs">
                              <div className="font-medium text-dental-blue">Sarah Johnson</div>
                              <div className="text-muted-foreground">Cleaning</div>
                            </div>
                          )}
                          {hour === "14:00" && dayIndex === 2 && (
                            <div className="bg-dental-accent/10 border border-dental-accent/20 rounded p-1 text-xs">
                              <div className="font-medium text-dental-accent">Emma Davis</div>
                              <div className="text-muted-foreground">Root Canal</div>
                            </div>
                          )}
                        </div>
                      ))}
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
                {appointments.map((appointment) => (
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
                <span className="font-medium text-foreground">4 appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Available Slots</span>
                <span className="font-medium text-dental-accent">6 slots</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Hours</span>
                <span className="font-medium text-foreground">4.5 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;