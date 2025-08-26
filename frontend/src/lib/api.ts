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

// Backend RdvPatient shape
export interface RdvPatient {
  numRdv?: number; // double in backend, optional for create
  idPersonne?: number | null;
  numCabinet?: string | null;
  dateRdv?: string | null; // ISO date string
  heure?: string | null; // HH:mm
  duree?: string | null;
  observation?: string | null;
  nomPs?: string | null;
  dateSuppression?: string | null;
  natureSoin?: string | null;
  nomPer?: string | null;
  qualitePer?: string | null;
  collectivitePe?: string | null;
  agent?: string | null;
  nomAssure?: string | null;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
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
  async login(username: string, password: string): Promise<{ token: string }> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await this.handleResponse<any>(response);
    const token: string = data.token || data.Token;
    if (token) localStorage.setItem('authToken', token);
    return { token };
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

  // Appointments (RendezVous)
  async getAppointments(params?: { patient?: string; doctor?: string; date?: string; }): Promise<RdvPatient[]> {
    const search = new URLSearchParams();
    if (params?.patient) search.append('patient', params.patient);
    if (params?.doctor) search.append('doctor', params.doctor);
    if (params?.date) search.append('date', params.date);

    const response = await fetch(`${API_BASE_URL}/RendezVous?${search.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<RdvPatient[]>(response);
  }

  async createAppointment(rdv: RdvPatient): Promise<RdvPatient> {
    const response = await fetch(`${API_BASE_URL}/RendezVous`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(rdv),
    });
    return this.handleResponse<RdvPatient>(response);
  }

  async updateAppointment(numRdv: number, rdv: RdvPatient): Promise<RdvPatient> {
    const response = await fetch(`${API_BASE_URL}/RendezVous/${numRdv}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(rdv),
    });
    return this.handleResponse<RdvPatient>(response);
  }

  async deleteAppointment(numRdv: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/RendezVous/${numRdv}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
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