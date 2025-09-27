import { useState, useEffect, useCallback } from 'react';
import { apiService, Patient, PatientStats } from '@/lib/api';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats>({
    total: 0,
    active: 0,
    newPatients: 0,
    inactive: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async (name?: string, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const [patientsData, statsData] = await Promise.all([
        apiService.getPatients(name, status),
        apiService.getPatientStats()
      ]);
      
      setPatients(patientsData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch patients');
      
      // Fallback to mock data if API fails
      const mockPatients: Patient[] = [
        {
          id: 1,
          name: "Sarah Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 123-4567",
          dateOfBirth: "1985-03-15",
          gender: "Female",
          lastVisit: "2024-01-15",
          nextAppointment: "2024-02-20",
          status: "active",
          medicalHistory: ["Cleaning", "Cavity filling", "Root canal"],
          insurance: "Blue Cross Blue Shield",
          emergencyContact: {
            name: "John Johnson",
            phone: "+1 (555) 123-4568",
            relationship: "Spouse"
          }
        },
        {
          id: 2,
          name: "Michael Wilson",
          email: "mike.wilson@email.com",
          phone: "+1 (555) 234-5678",
          dateOfBirth: "1990-07-22",
          gender: "Male",
          lastVisit: "2024-01-10",
          nextAppointment: "2024-03-05",
          status: "active",
          medicalHistory: ["Regular checkup", "Teeth whitening"],
          insurance: "Aetna",
          emergencyContact: {
            name: "Lisa Wilson",
            phone: "+1 (555) 234-5679",
            relationship: "Sister"
          }
        },
        {
          id: 3,
          name: "Emma Davis",
          email: "emma.davis@email.com",
          phone: "+1 (555) 345-6789",
          dateOfBirth: "1988-11-08",
          gender: "Female",
          lastVisit: "2024-01-20",
          nextAppointment: "",
          status: "new",
          medicalHistory: ["Initial consultation"],
          insurance: "Cigna",
          emergencyContact: {
            name: "Robert Davis",
            phone: "+1 (555) 345-6790",
            relationship: "Father"
          }
        },
        {
          id: 4,
          name: "David Brown",
          email: "david.brown@email.com",
          phone: "+1 (555) 456-7890",
          dateOfBirth: "1975-12-03",
          gender: "Male",
          lastVisit: "2023-12-15",
          nextAppointment: "",
          status: "inactive",
          medicalHistory: ["Crown replacement", "Gum treatment"],
          insurance: "UnitedHealth",
          emergencyContact: {
            name: "Maria Brown",
            phone: "+1 (555) 456-7891",
            relationship: "Wife"
          }
        },
        {
          id: 5,
          name: "Jennifer Lee",
          email: "jennifer.lee@email.com",
          phone: "+1 (555) 567-8901",
          dateOfBirth: "1992-05-18",
          gender: "Female",
          lastVisit: "2024-01-25",
          nextAppointment: "2024-02-28",
          status: "active",
          medicalHistory: ["Braces consultation", "Cleaning"],
          insurance: "Humana",
          emergencyContact: {
            name: "Kevin Lee",
            phone: "+1 (555) 567-8902",
            relationship: "Brother"
          }
        }
      ];

      const mockStats: PatientStats = {
        total: mockPatients.length,
        active: mockPatients.filter(p => p.status === 'active').length,
        newPatients: mockPatients.filter(p => p.status === 'new').length,
        inactive: mockPatients.filter(p => p.status === 'inactive').length
      };

      setPatients(mockPatients);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    stats,
    loading,
    error,
    fetchPatients
  };
};
 