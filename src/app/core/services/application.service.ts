import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Application {
  id: number;
  jobId: number;
  jobTitle?: string;
  companyName?: string;
  candidateId: number;
  candidateName?: string;
  candidateEmail?: string;
  status: string;
  appliedAt: string;
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
  recruiterNotes?: string;
  rating?: number;
  isShortlisted?: boolean;
  isArchived?: boolean;
  rejectionReason?: string;
  interviewScheduledAt?: string;
  interviewMode?: string;
  interviewLocation?: string;
  interviewLink?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly apiUrl = `${environment.apiUrl}/applications`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  applyForJob(application: any): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/apply`, application, { headers: this.getHeaders() });
  }

  getApplicationsByCandidate(candidateId: number, page: number = 0, size: number = 10): Observable<Application[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Application>>(`${this.apiUrl}/candidate/${candidateId}`, { 
      params,
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.content)
    );
  }

  getApplicationsByJob(jobId: number, page: number = 0, size: number = 10): Observable<Application[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Application>>(`${this.apiUrl}/job/${jobId}`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      map(response => response.content)
    );
  }

  updateApplicationStatus(id: number, status: string, recruiterId: number): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/status/${id}`, { status, reviewedBy: recruiterId }, { headers: this.getHeaders() });
  }

  archiveApplication(id: number, userId: number): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put<void>(`${this.apiUrl}/archive/${id}`, {}, { params, headers: this.getHeaders() });
  }

  getApplicationsByRecruiter(recruiterId: number, page: number = 0, size: number = 10): Observable<Application[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Application>>(`${this.apiUrl}/recruiter/${recruiterId}`, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      map(response => response.content)
    );
  }

  getRecruiterApplicationsCount(recruiterId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/recruiter/${recruiterId}/count`, { headers: this.getHeaders() });
  }

  getRecruiterApplicationsCountByStatus(recruiterId: number, status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/recruiter/${recruiterId}/count/${status}`, { headers: this.getHeaders() });
  }

  getJobApplicationsCount(jobId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/job/${jobId}/count`, { headers: this.getHeaders() });
  }
}
