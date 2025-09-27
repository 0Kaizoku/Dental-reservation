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

// Helper functions removed since we're no longer using mock data

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  // Remove mock data - use empty array instead
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

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


