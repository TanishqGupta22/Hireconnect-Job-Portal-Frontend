import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService, Application } from '../../../core/services/application.service';
import { JobService, Job } from '../../../core/services/job.service';
import { ProfileService } from '../../../core/services/profile.service';

import { SubscriptionService } from '../../../core/services/subscription.service';

@Component({
  selector: 'app-candidate-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
    MatButtonModule
  ],
  template: `
    <div class="candidate-dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="welcome-text">
            <div class="dashboard-logo mb-4">
              <img src="assets/images/logo.png" alt="HireConnect Logo" class="h-10">
            </div>
            <h1 class="welcome-title flex items-center gap-4">
              Welcome back, {{ getCurrentUserName() }}! 👋
              <span *ngIf="isPremium" class="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full font-black tracking-widest shadow-lg border border-amber-300 flex items-center gap-1 uppercase">
                <mat-icon style="font-size: 16px; width: 16px; height: 16px;">workspace_premium</mat-icon> Premium
              </span>
            </h1>
            <p class="welcome-subtitle">Your career journey continues. Let's find your perfect match!</p>
          </div>
          <div class="welcome-actions">
            <button mat-raised-button color="primary" class="btn-primary" routerLink="/candidate/browse-jobs">
              <mat-icon>search</mat-icon>
              Browse Jobs
            </button>
            <button mat-outlined-button class="btn-secondary" routerLink="/candidate/profile">
              <mat-icon>edit</mat-icon>
              Update Profile
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-section">
        <h2 class="section-title">Your Progress</h2>
        <div class="stats-grid">
          <div class="stat-card applications">
            <div class="stat-icon">
              <mat-icon>send</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ applications.length }}</div>
              <div class="stat-label">Applications Sent</div>
            </div>
          </div>

          <div class="stat-card shortlisted">
            <div class="stat-icon">
              <mat-icon>star</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ shortlistedCount }}</div>
              <div class="stat-label">Shortlisted</div>
            </div>
          </div>

          <div class="stat-card hired">
            <div class="stat-icon">
              <mat-icon style="color: #4caf50;">workspace_premium</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number" style="color: #4caf50;">{{ hiredCount }}</div>
              <div class="stat-label">Hired</div>
            </div>
          </div>

          <div class="stat-card profile">
            <div class="stat-icon">
              <mat-icon>person</mat-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ profileCompletion }}%</div>
              <div class="stat-label">Profile Complete</div>
              <div class="stat-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="profileCompletion"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section" *ngIf="applications.length > 0">
        <h2 class="section-title">Recent Activity</h2>
        <mat-card class="activity-card">
          <mat-card-header>
            <mat-card-title>Activity Timeline</mat-card-title>
            <mat-card-subtitle>Your latest job search activities</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-timeline">
              <div class="activity-item" *ngFor="let app of applications | slice:0:5">
                <div class="activity-marker">
                  <div class="activity-dot" [ngClass]="app.status.toLowerCase()"></div>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <div class="activity-title">Applied for {{ app.jobTitle }}</div>
                    <div class="activity-time">{{ app.appliedAt | date:'medium' }}</div>
                  </div>
                  <div class="activity-description">
                    Status: <mat-chip>{{ app.status }}</mat-chip>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Recommended Jobs -->
      <div class="jobs-section">
        <h2 class="section-title">Recommended for You</h2>
        <div class="jobs-grid">
          <mat-card class="job-card" *ngFor="let job of recommendedJobs">
            <mat-card-content>
              <div class="job-header">
                <div class="job-company">
                  <div class="company-logo">
                    <mat-icon>business</mat-icon>
                  </div>
                  <div class="company-info">
                    <h3 class="job-title">{{ job.title }}</h3>
                    <p class="company-name">{{ job.company }}</p>
                  </div>
                </div>
                <div class="job-meta">
                  <div class="job-type">
                    <mat-icon>work</mat-icon>
                    <span>{{ job.type }}</span>
                  </div>
                  <div class="job-location">
                    <mat-icon>location_on</mat-icon>
                    <span>{{ job.location }}</span>
                  </div>
                </div>
              </div>
              <div class="job-description">
                <p>{{ job.description | slice:0:150 }}...</p>
              </div>
              <div class="job-actions">
                <button mat-raised-button color="primary" class="apply-btn" [routerLink]="['/candidate/apply-job', job.id]">
                  View Details
                </button>
              </div>
            </mat-card-content>
          </mat-card>
          <div *ngIf="recommendedJobs.length === 0 && !isLoading" class="no-jobs">
            <p>No recommended jobs at the moment. Try browsing all jobs!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .candidate-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 40px;
      margin-bottom: 32px;
      color: white;
    }

    .welcome-title {
      font-size: 2.5rem;
      margin-bottom: 8px;
    }

    .welcome-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
    }

    .btn-secondary {
      border: 1px solid white;
      color: white;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: #764ba2;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .job-card {
      border-radius: 12px;
    }

    .job-header {
      margin-bottom: 16px;
    }

    .company-info .job-title {
      margin: 0;
      font-size: 1.1rem;
    }

    .job-meta {
      display: flex;
      gap: 16px;
      font-size: 0.8rem;
      color: #888;
      margin-top: 8px;
    }

    .job-meta mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .activity-timeline {
      padding: 16px;
    }

    .activity-item {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .activity-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ccc;
      margin-top: 6px;
    }

    .activity-dot.pending { background: #ffa000; }
    .activity-dot.shortlisted { background: #4caf50; }
    .activity-dot.rejected { background: #f44336; }

    .no-jobs {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      color: #999;
    }
  `]
})
export class CandidateDashboardComponent implements OnInit {
  applications: Application[] = [];
  recommendedJobs: Job[] = [];
  isLoading = false;
  shortlistedCount = 0;
  hiredCount = 0;
  profileCompletion = 0;
  isPremium = false;

  constructor(
    private authService: AuthService,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private profileService: ProfileService,
    private subscriptionService: SubscriptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadDashboardData(user.id);
      this.checkSubscription(user.id);
    }
  }

  checkSubscription(userId: number): void {
    this.subscriptionService.getCurrentSubscription(userId, 'CANDIDATE').subscribe({
      next: (sub) => {
        if (sub && sub.plan && sub.status) {
          const plan = String(sub.plan).toUpperCase();
          const status = String(sub.status).toUpperCase();
          if ((plan === 'PRO' || plan === 'PREMIUM') && status === 'ACTIVE') {
            this.isPremium = true;
          }
        }
      },
      error: () => console.log('No active subscription found or error checking subscription')
    });
  }

  loadDashboardData(userId: number): void {
    this.isLoading = true;
    
    // Load applications
    this.applicationService.getApplicationsByCandidate(userId).subscribe({
      next: (data) => {
        this.applications = data;
        this.shortlistedCount = data.filter(a => a.status === 'SHORTLISTED').length;
        this.hiredCount = data.filter(a => a.status === 'HIRED').length;
      },
      error: (err) => console.error('Error loading applications:', err)
    });

    // Load recommended jobs (simulated by fetching all jobs for now)
    this.jobService.getJobs().subscribe({
      next: (data) => {
        this.recommendedJobs = data.slice(0, 3);
      },
      error: (err) => {
        console.error('Error loading jobs:', err);
      }
    });

    // Load profile completion
    this.profileService.getCandidateProfile(userId).subscribe({
      next: (profile) => {
        this.profileCompletion = this.calculateCompletion(profile);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
      }
    });
  }

  calculateCompletion(profile: any): number {
    if (!profile) return 0;
    const fields = [
      profile.fullName,
      profile.mobile,
      profile.headline,
      profile.bio,
      profile.address,
      profile.resumeUrl,
      profile.profileImageUrl,
      profile.skills && profile.skills.length > 0,
      profile.experience && profile.experience.length > 0 && profile.experience[0]
    ];
    
    const filledFields = fields.filter(f => !!f).length;
    return Math.round((filledFields / fields.length) * 100);
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.firstName || user?.name?.split(' ')[0] || 'User';
  }
}
