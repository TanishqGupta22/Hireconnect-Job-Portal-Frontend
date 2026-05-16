import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface RecruiterAnalytics {
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  shortlistedCandidates: number;
  interviewCount: number;
  applicationTrends: { date: string, count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getRecruiterAnalytics(recruiterId: number): Observable<RecruiterAnalytics> {
    return this.http.get<RecruiterAnalytics>(`${this.apiUrl}/recruiter/${recruiterId}`, { headers: this.getHeaders() });
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() });
  }
}
