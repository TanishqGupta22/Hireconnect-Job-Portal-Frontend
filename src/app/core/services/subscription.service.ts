import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM'
}

export interface SubscriptionResponse {
  id: number;
  userId: number;
  userRole: string;
  plan: SubscriptionPlan;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  usageLimit: number;
  currentUsage: number;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  initiateSubscription(userId: number, userRole: string, plan: SubscriptionPlan): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('userRole', userRole)
      .set('plan', plan);
    return this.http.post(`${this.apiUrl}/initiate`, null, { params, responseType: 'text' });
  }

  completeSubscription(request: any): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/complete`, request, { headers: this.getHeaders() });
  }

  getCurrentSubscription(userId: number, userRole: string): Observable<SubscriptionResponse> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('userRole', userRole);
    return this.http.get<SubscriptionResponse>(`${this.apiUrl}/current`, { params, headers: this.getHeaders() });
  }

  checkLimit(userId: number, userRole: string): Observable<boolean> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('userRole', userRole);
    return this.http.get<boolean>(`${this.apiUrl}/check-limit`, { params, headers: this.getHeaders() });
  }
}
