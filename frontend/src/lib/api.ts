const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

export interface RdvPatient {
  numRdv?: number;
  idPersonne?: number | null;
  numCabinet?: string | null;
  dateRdv?: string | null;
  heure?: string | null;
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
  status?: 'confirmed' | 'pending' | 'canceled' | null;
}

export interface PatientDossier {
  patient: Patient;
  appointments: RdvPatient[];
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

  async getPatients(name?: string, status?: string, matricule?: string): Promise<Patient[]> {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (status) params.append('status', status);
    if (matricule) params.append('matricule', matricule);

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

  async getPatientDossier(id: number): Promise<PatientDossier> {
    const response = await fetch(`${API_BASE_URL}/Patients/${id}/dossier`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PatientDossier>(response);
  }

  async createPatient(payload: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    cin?: string;
    matricule?: string;
    codeCivilitePer?: string;
    idNumFamillePer?: number;
    codeQualitePersonnePer?: string;
    codeStatutPer?: string;
    codeSituationFamilialePer?: string;
    idNumAdressePer?: number;
    codeCollectivitePer?: string;
    autorisation?: string;
    email?: string;
    phone?: string;
  }): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/Patients`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<Patient>(response);
  }

  async updatePatient(id: number, payload: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    cin?: string;
    matricule?: string;
    codeCivilitePer?: string;
    idNumFamillePer?: number;
    codeQualitePersonnePer?: string;
    codeStatutPer?: string;
    codeSituationFamilialePer?: string;
    idNumAdressePer?: number;
    codeCollectivitePer?: string;
    autorisation?: string;
    email?: string;
    phone?: string;
  }): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/Patients/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return this.handleResponse<Patient>(response);
  }

  async deletePatient(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/Patients/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  async getPatientStats(): Promise<PatientStats> {
    const response = await fetch(`${API_BASE_URL}/Patients/stats`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<PatientStats>(response);
  }

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

  async getAvailableSlots(doctor?: string, cabinet?: string, date?: string): Promise<string[]> {
    const search = new URLSearchParams();
    if (doctor) search.append('doctor', doctor);
    if (cabinet) search.append('cabinet', cabinet);
    if (date) search.append('date', date);

    const response = await fetch(`${API_BASE_URL}/RendezVous/available-slots?${search.toString()}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<string[]>(response);
  }

  async getProfile(): Promise<{ username: string; lastName?: string; userType?: string; }>{
    const response = await fetch(`${API_BASE_URL}/Profile/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: { lastName?: string }): Promise<{ username: string; lastName?: string; userType?: string; }>{
    const response = await fetch(`${API_BASE_URL}/Profile/me`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/Profile/password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
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

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const apiService = new ApiService();