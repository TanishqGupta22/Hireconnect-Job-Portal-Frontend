import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recruiter-notifications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Notifications</h1>
          <p class="page-subtitle">Track applications and interview updates</p>
        </div>
        <div class="header-actions" *ngIf="notifications.length > 0">
          <button mat-stroked-button color="primary" (click)="markAllAsRead()">
            <mat-icon>done_all</mat-icon>
            Mark all as read
          </button>
        </div>
      </div>

      <div class="loading-container" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <mat-card class="notifications-card" *ngIf="!loading">
        <mat-card-content>
          <div class="notifications-list" *ngIf="notifications.length > 0; else emptyState">
            <div class="notification-item" *ngFor="let notification of notifications" [class.unread]="!notification.isRead">
              <div class="notification-icon" [class]="getCategory(notification.type)">
                <mat-icon>{{ getIcon(notification.type) }}</mat-icon>
              </div>
              <div class="notification-content">
                <div class="notification-header">
                  <h4 class="notification-title">{{ notification.title }}</h4>
                  <span class="notification-time">{{ notification.createdAt | date:'medium' }}</span>
                </div>
                <p class="notification-message">{{ notification.message }}</p>
                <div class="notification-footer" *ngIf="notification.actionUrl">
                  <a [routerLink]="notification.actionUrl" class="action-link">
                    {{ notification.actionText || 'View Details' }}
                    <mat-icon>chevron_right</mat-icon>
                  </a>
                </div>
              </div>
              <div class="notification-actions">
                <button mat-icon-button (click)="markAsRead(notification.id)" *ngIf="!notification.isRead" title="Mark as read">
                  <mat-icon color="primary">check_circle</mat-icon>
                </button>
                <button mat-icon-button (click)="deleteNotification(notification.id)" title="Delete">
                  <mat-icon color="warn">delete</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <ng-template #emptyState>
        <div class="empty-state">
          <div class="empty-icon-wrapper">
            <mat-icon class="empty-icon">notifications_none</mat-icon>
          </div>
          <h3>All caught up!</h3>
          <p>No new notifications at the moment.</p>
          <button mat-flat-button color="primary" routerLink="/recruiter/dashboard" class="mt-4">
            Back to Dashboard
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .notifications-page {
      padding: 32px 24px;
      max-width: 1000px;
      margin: 0 auto;
      min-height: 80vh;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .page-subtitle {
      color: #666;
      font-size: 1.1rem;
      margin: 0;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    .notifications-card {
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.05);
      box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
      overflow: hidden;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
    }

    .notification-item {
      display: flex;
      gap: 20px;
      padding: 24px;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.2s ease;
      position: relative;
    }

    .notification-item:last-child {
      border-bottom: none;
    }

    .notification-item.unread {
      background: #f4f8ff;
    }

    .notification-item.unread::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #3f51b5;
    }

    .notification-item:hover {
      background: #fafafa;
    }

    .notification-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .notification-icon.application { background: #e3f2fd; color: #1e88e5; }
    .notification-icon.interview { background: #e8f5e9; color: #43a047; }
    .notification-icon.system { background: #fff3e0; color: #fb8c00; }
    .notification-icon.default { background: #f5f5f5; color: #757575; }

    .notification-content {
      flex: 1;
    }

    .notification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .notification-title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
      color: #2c3e50;
    }

    .notification-time {
      font-size: 0.85rem;
      color: #888;
    }

    .notification-message {
      color: #555;
      margin: 0 0 12px 0;
      font-size: 1rem;
      line-height: 1.5;
    }

    .notification-footer {
      display: flex;
    }

    .action-link {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #3f51b5;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .notification-actions {
      display: flex;
      gap: 8px;
      align-items: center;
      opacity: 0.6;
    }

    .notification-item:hover .notification-actions {
      opacity: 1;
    }

    .empty-state {
      text-align: center;
      padding: 80px 24px;
    }

    .empty-icon-wrapper {
      width: 100px;
      height: 100px;
      background: #f8f9fa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #adb5bd;
    }

    .mt-4 {
      margin-top: 1.5rem;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  userId: number | null = null;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    const user = this.authService.getCurrentUser();
    this.userId = user ? user.id : null;
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    if (!this.userId) return;

    this.loading = true;
    this.notificationService.getUserNotifications(this.userId).subscribe({
      next: (data) => {
        this.notifications = data.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.loading = false;
      }
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'APPLICATION_RECEIVED': return 'assignment';
      case 'INTERVIEW_CONFIRMED': return 'event_available';
      case 'MESSAGE_RECEIVED': return 'chat';
      case 'SYSTEM_ANNOUNCEMENT': return 'info';
      default: return 'notifications';
    }
  }

  getCategory(type: string): string {
    if (type.includes('APPLICATION')) return 'application';
    if (type.includes('INTERVIEW')) return 'interview';
    if (type.includes('SYSTEM')) return 'system';
    return 'default';
  }

  markAsRead(id: number): void {
    if (!this.userId) return;

    this.notificationService.markAsRead(id, this.userId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) notification.isRead = true;
      }
    });
  }

  markAllAsRead(): void {
    if (!this.userId) return;

    this.notificationService.markAllAsRead(this.userId).subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.snackBar.open('All notifications marked as read', 'Close', { duration: 2000 });
      }
    });
  }

  deleteNotification(id: number): void {
    if (!this.userId) return;

    this.notificationService.deleteNotification(id, this.userId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.snackBar.open('Notification deleted', 'Close', { duration: 2000 });
      }
    });
  }
}
