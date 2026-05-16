import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-saved-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="saved-jobs-page">
      <div class="page-header">
        <h1 class="page-title">Saved Jobs</h1>
        <p class="page-subtitle">Keep track of the opportunities you're interested in</p>
      </div>

      <div class="jobs-grid" *ngIf="savedJobs.length > 0; else emptyState">
        <mat-card class="job-card" *ngFor="let job of savedJobs">
          <mat-card-content>
            <div class="job-header">
              <div class="company-logo">
                <mat-icon>business</mat-icon>
              </div>
              <div class="job-info">
                <h3 class="job-title">{{ job.title }}</h3>
                <p class="company-name">{{ job.company }}</p>
              </div>
              <button mat-icon-button class="remove-btn" (click)="removeJob(job.id)">
                <mat-icon color="warn">bookmark</mat-icon>
              </button>
            </div>

            <div class="job-meta">
              <span class="meta-item">
                <mat-icon>location_on</mat-icon>
                {{ job.location }}
              </span>
              <span class="meta-item">
                <mat-icon>work</mat-icon>
                {{ job.type }}
              </span>
              <span class="meta-item">
                <mat-icon>payments</mat-icon>
                {{ job.salary }}
              </span>
            </div>

            <div class="job-footer">
              <span class="posted-date">Saved on {{ job.savedDate | date }}</span>
              <div class="actions">
                <button mat-stroked-button [routerLink]="['/candidate/job-details', job.id]">View Details</button>
                <button mat-raised-button color="primary" [routerLink]="['/candidate/apply-job', job.id]">Apply Now</button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <ng-template #emptyState>
        <div class="empty-state">
          <mat-icon class="empty-icon">bookmark_border</mat-icon>
          <h3>No saved jobs yet</h3>
          <p>Explore jobs and save them to view them later.</p>
          <button mat-raised-button color="primary" routerLink="/candidate/browse-jobs">Browse Jobs</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .saved-jobs-page {
      padding: 24px;
      max-width: 1200px;
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

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .job-card {
      border-radius: 12px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid #eee;
    }

    .job-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .job-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .company-logo {
      width: 48px;
      height: 48px;
      background: #f0f7ff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3f51b5;
    }

    .job-info {
      flex: 1;
    }

    .job-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
      color: #333;
    }

    .company-name {
      color: #666;
      margin: 0;
    }

    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
      color: #777;
    }

    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .job-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .posted-date {
      font-size: 0.85rem;
      color: #999;
    }

    .actions {
      display: flex;
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

    .empty-state h3 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #666;
      margin-bottom: 24px;
    }
  `]
})
export class SavedJobsComponent implements OnInit {
  savedJobs: any[] = [];

  ngOnInit(): void {}

  removeJob(id: number): void {
    this.savedJobs = this.savedJobs.filter(job => job.id !== id);
  }
}
