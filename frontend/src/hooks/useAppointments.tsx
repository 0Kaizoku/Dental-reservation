import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export interface AppointmentItem {
  id: number;
  date: string; // yyyy-mm-dd
  time: string; // HH:MM
  patient: string;
  type: string;
  duration: string; // e.g., "30 min"
}

interface AppointmentsContextValue {
  appointments: AppointmentItem[];
  addAppointment: (a: Omit<AppointmentItem, "id">) => AppointmentItem;
  removeAppointment: (id: number) => void;
  clearAppointments: () => void;
}

const AppointmentsContext = createContext<AppointmentsContextValue | undefined>(undefined);

function getStartOfWeek(d: Date) {
  const dateCopy = new Date(d);
  const day = dateCopy.getDay();
  const diffToMonday = ((day + 6) % 7);
  dateCopy.setDate(dateCopy.getDate() - diffToMonday);
  dateCopy.setHours(0,0,0,0);
  return dateCopy;
}

function addDays(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
}

function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const currentWeekStart = useMemo(() => getStartOfWeek(new Date()), []);
  const defaultAppointments = useMemo<AppointmentItem[]>(() => {
    const mon = toYmd(addDays(currentWeekStart, 0));
    const wed = toYmd(addDays(currentWeekStart, 2));
    return [
      { id: 1, date: mon, time: "09:00", patient: "Sarah Johnson", type: "Cleaning", duration: "60 min" },
      { id: 2, date: wed, time: "14:00", patient: "Emma Davis", type: "Root Canal", duration: "90 min" },
    ];
  }, [currentWeekStart]);

  const [appointments, setAppointments] = useState<AppointmentItem[]>(defaultAppointments);

  const addAppointment = (a: Omit<AppointmentItem, "id">): AppointmentItem => {
    const item: AppointmentItem = { id: Date.now(), ...a };
    setAppointments(prev => [...prev, item]);
    return item;
  };

  const removeAppointment = (id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  const clearAppointments = () => setAppointments([]);

  const value: AppointmentsContextValue = {
    appointments,
    addAppointment,
    removeAppointment,
    clearAppointments,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export function useAppointments() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointments must be used within AppointmentsProvider");
  return ctx;
}


