import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { InterviewService } from '../../../core/services/interview.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-interviews',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="interviews-page">
      <div class="page-header">
        <h1 class="page-title">Upcoming Interviews</h1>
        <p class="page-subtitle">Prepare for your next career milestone</p>
      </div>

      <div class="interviews-list" *ngIf="!isLoading && interviews.length > 0; else noData">
        <mat-card class="interview-card" *ngFor="let interview of interviews">
          <mat-card-content>
            <div class="interview-header">
              <div class="date-badge">
                <span class="month">{{ interview.scheduledAt | date:'MMM' }}</span>
                <span class="day">{{ interview.scheduledAt | date:'dd' }}</span>
              </div>
              <div class="interview-info">
                <h3 class="job-title">{{ interview.jobTitle || 'Technical Interview' }}</h3>
                <p class="company-name">Application ID: #{{ interview.applicationId }}</p>
              </div>
              <div class="status-chip">
                <mat-chip [class]="interview.status.toLowerCase()">{{ interview.status }}</mat-chip>
              </div>
            </div>

            <div class="interview-details">
              <div class="detail-item">
                <mat-icon>schedule</mat-icon>
                <span>{{ interview.scheduledAt | date:'shortTime' }}</span>
              </div>
              <div class="detail-item">
                <mat-icon>videocam</mat-icon>
                <span>{{ interview.mode }}</span>
              </div>
              <div class="detail-item">
                <mat-icon>person</mat-icon>
                <span>Interviewer: {{ interview.interviewerName || 'To be assigned' }}</span>
              </div>
              <div class="detail-item" *ngIf="interview.location">
                <mat-icon>location_on</mat-icon>
                <span>{{ interview.location }}</span>
              </div>
            </div>

            <div class="interview-actions">
              <button mat-raised-button color="primary" class="join-btn" *ngIf="interview.meetingLink" (click)="joinMeeting(interview.meetingLink)">
                <mat-icon>videocam</mat-icon>
                Join Meeting
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #noData>
        <div *ngIf="isLoading" class="flex justify-center py-20">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <ng-template [ngIf]="!isLoading">
          <div class="empty-state">
            <mat-icon class="empty-icon">event_busy</mat-icon>
            <h3>No interviews scheduled</h3>
            <p>You'll see your upcoming interview schedules here.</p>
            <button mat-raised-button color="primary" routerLink="/candidate/my-applications">View Applications</button>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [`
    .interviews-page {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    .page-subtitle {
      color: #666;
      font-size: 1.1rem;
    }

    .interviews-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .interview-card {
      border-radius: 12px;
      border: 1px solid #eee;
    }

    .interview-header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 20px;
    }

    .date-badge {
      background: #f0f7ff;
      color: #3f51b5;
      width: 60px;
      height: 60px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }

    .date-badge .month {
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .date-badge .day {
      font-size: 1.4rem;
    }

    .interview-info {
      flex: 1;
    }

    .job-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    .company-name {
      color: #666;
      margin: 0;
    }

    .interview-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #555;
    }

    .detail-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: #3f51b5;
    }

    .interview-actions {
      display: flex;
      gap: 12px;
    }

    .join-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .empty-state {
      text-align: center;
      padding: 64px 24px;
      background: white;
      border-radius: 12px;
      border: 1px dashed #ccc;
    }

    .empty-icon {
      font-size: 4rem;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }
  `]
})
export class InterviewsComponent implements OnInit {
  interviews: any[] = [];
  isLoading = true;

  constructor(
    private interviewService: InterviewService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.interviewService.getInterviewsByCandidate(user.id).subscribe({
      next: (data) => {
        const now = new Date();
        this.interviews = data.filter((i: any) => new Date(i.scheduledAt) >= now);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading interviews:', err);
        this.isLoading = false;
      }
    });
  }

  joinMeeting(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
