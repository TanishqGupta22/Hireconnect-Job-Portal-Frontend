import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Interview {
  id: number;
  applicationId: number;
  candidateId: number;
  candidateName?: string;
  recruiterId: number;
  jobTitle: string;
  description?: string;
  scheduledAt: string;
  endTime: string;
  location?: string;
  meetingLink?: string;
  status: string;
  mode?: string;
  interviewerName?: string;
  notes?: string;
  duration?: number;
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
export class InterviewService {
  private readonly apiUrl = `${environment.apiUrl}/interviews`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getInterviewsByRecruiter(recruiterId: number, page: number = 0, size: number = 10): Observable<Interview[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Interview>>(`${this.apiUrl}/recruiter/${recruiterId}`, { params }).pipe(
      map(response => response.content)
    );
  }

  getInterviewsByCandidate(candidateId: number, page: number = 0, size: number = 10): Observable<Interview[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Interview>>(`${this.apiUrl}/candidate/${candidateId}`, { params }).pipe(
      map(response => response.content)
    );
  }

  scheduleInterview(interview: any): Observable<Interview> {
    return this.http.post<Interview>(this.apiUrl, interview, { headers: this.getHeaders() });
  }

  updateInterview(id: number, interview: any): Observable<Interview> {
    return this.http.put<Interview>(`${this.apiUrl}/${id}`, interview, { headers: this.getHeaders() });
  }

  getInterviewByApplicationId(applicationId: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.apiUrl}/application/${applicationId}`, { headers: this.getHeaders() });
  }

  confirmInterview(id: number): Observable<Interview> {
    return this.http.put<Interview>(`${this.apiUrl}/${id}/confirm`, {}, { headers: this.getHeaders() });
  }

  cancelInterview(id: number, reason: string): Observable<void> {
    const params = new HttpParams().set('reason', reason);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders(), params });
  }
}
