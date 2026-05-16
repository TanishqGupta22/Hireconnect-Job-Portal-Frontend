import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: any;
  priority?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { params });
  }

  getUnreadNotifications(userId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/unread`, { params });
  }

  getUnreadCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user/${userId}/unread-count`);
  }

  markAsRead(id: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/read`, {}, { params: { userId: userId.toString() } });
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/read-all/${userId}`, {});
  }

  archiveNotification(id: number, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/archive`, {}, { params: { userId: userId.toString() } });
  }

  deleteNotification(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { params: { userId: userId.toString() } });
  }
}
