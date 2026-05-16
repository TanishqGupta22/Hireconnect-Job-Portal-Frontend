import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Job } from './job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserStats {
  totalUsers: number;
  totalCandidates: number;
  totalRecruiters: number;
  newUsersToday: number;
}

export interface SystemStats {
  totalUsers: number;
  activeJobs: number;
  totalApplications: number;
  totalRevenue: number;
  userGrowth: number;
  jobGrowth: number;
  applicationGrowth: number;
  revenueGrowth: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  lastLoginAt?: string;
  companyName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly authUrl = `${environment.apiUrl}/auth/admin`;
  private readonly jobsUrl = `${environment.apiUrl}/jobs/admin`;
  private readonly appsUrl = `${environment.apiUrl}/applications/admin`;
  private readonly analyticsUrl = `${environment.apiUrl}/analytics/admin`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getSystemStats(): Observable<SystemStats> {
    return this.http.get<SystemStats>(`${environment.apiUrl}/analytics/dashboard/stats`, { headers: this.getHeaders() });
  }

  getUsers(role?: string): Observable<AdminUser[]> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);
    return this.http.get<AdminUser[]>(`${this.authUrl}/users`, { params, headers: this.getHeaders() });
  }

  getRecruiters(): Observable<any[]> {
    return this.getUsers('RECRUITER');
  }

  getAllJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.jobsUrl}/all`, { headers: this.getHeaders() });
  }

  getAllApplications(): Observable<any[]> {
    return this.http.get<any>(`${this.appsUrl}`, { headers: this.getHeaders() }).pipe(
      map(response => response.content || [])
    );
  }

  getRevenueStats(): Observable<any> {
    return this.http.get<any>(this.analyticsUrl, { headers: this.getHeaders() });
  }

  getRevenueChartData(period: string = 'monthly'): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/analytics/charts/revenue`, { 
      params: { period },
      headers: this.getHeaders() 
    });
  }

  updateUserStatus(userId: number, status: string): Observable<void> {
    return this.http.put<void>(`${this.authUrl}/users/${userId}/status`, { status }, { headers: this.getHeaders() });
  }

  deleteJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.jobsUrl}/${jobId}`, { headers: this.getHeaders() });
  }
}
