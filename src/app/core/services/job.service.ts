import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  type: string;
  workMode: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experience?: string;
  deadline?: string;
  recruiterId: number;
  createdAt?: string;
  applicantCount?: number;
  applied?: boolean;
  companyLogo?: string;
  skills: string[];
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
export class JobService {
  private readonly apiUrl = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getJobs(page: number = 0, size: number = 10): Observable<Job[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Job>>(this.apiUrl, { params }).pipe(
      map(response => response.content)
    );
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  getJobsByRecruiter(recruiterId: number, page: number = 0, size: number = 10): Observable<Job[]> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Job>>(`${this.apiUrl}/recruiter/${recruiterId}`, { params }).pipe(
      map(response => response.content)
    );
  }

  postJob(job: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job, { headers: this.getHeaders() });
  }

  updateJob(id: number, job: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, job, { headers: this.getHeaders() });
  }

  deleteJob(id: number, recruiterId: number): Observable<void> {
    const params = new HttpParams().set('recruiterId', recruiterId);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders(), params });
  }
}
