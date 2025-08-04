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

const Dashboard = () => {
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
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
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
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
              >
                <CalendarCheck className="w-5 h-5 text-dental-blue" />
                <span className="text-sm">New Appointment</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
              >
                <Users className="w-5 h-5 text-dental-blue" />
                <span className="text-sm">Add Patient</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
              >
                <Calendar className="w-5 h-5 text-dental-blue" />
                <span className="text-sm">View Calendar</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2 border-dental-blue/20 hover:bg-dental-light-blue/20"
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