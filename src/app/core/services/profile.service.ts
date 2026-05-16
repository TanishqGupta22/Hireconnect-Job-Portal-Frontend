import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface CompanyProfile {
  id?: number;
  userId: number;
  companyName: string;
  description: string;
  website: string;
  address: string;
  industry?: string;
  companySize?: string;
  linkedin?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = `${environment.apiUrl}/profiles`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Recruiter Profile
  getRecruiterProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recruiter/${userId}`, { headers: this.getHeaders() });
  }

  createRecruiterProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recruiter`, profile, { headers: this.getHeaders() });
  }

  updateRecruiterProfile(userId: number, profile: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recruiter/${userId}`, profile, { headers: this.getHeaders() });
  }

  // Candidate Profile
  getCandidateProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/candidate/${userId}`, { headers: this.getHeaders() });
  }

  createCandidateProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/candidate`, profile, { headers: this.getHeaders() });
  }

  updateCandidateProfile(userId: number, profile: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/candidate/${userId}`, profile, { headers: this.getHeaders() });
  }

  toggleJobAlerts(userId: number, enabled: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/candidate/${userId}/job-alerts`, {}, { 
      headers: this.getHeaders(),
      params: { enabled: enabled.toString() }
    });
  }
}
