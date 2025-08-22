const API_BASE_URL = 'https://localhost:7091/api';

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  lastVisit: string;
  nextAppointment: string;
  status: 'active' | 'inactive' | 'new';
  medicalHistory: string[];
  insurance: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface PatientStats {
  total: number;
  active: number;
  newPatients: number;
  inactive: number;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      // Temporarily disabled authentication for testing
      // ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await this.handleResponse<{ token: string; user: any }>(response);
    localStorage.setItem('authToken', data.token);
    return data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
  }

  // Patients
  async getPatients(name?: string, status?: string): Promise<Patient[]> {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (status) params.append('status', status);

    const response = await fetch(`${API_BASE_URL}/Patients?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Patient[]>(response);
  }

  async getPatient(id: number): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/Patients/${id}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<Patient>(response);
  }

  async getPatientStats(): Promise<PatientStats> {
    const response = await fetch(`${API_BASE_URL}/Patients/stats`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<PatientStats>(response);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const apiService = new ApiService(); 