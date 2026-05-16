import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../core/services/auth.service';
import { JobService, Job } from '../../../core/services/job.service';
import { ApplicationService, Application } from '../../../core/services/application.service';

@Component({
  selector: 'app-recruiter-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class RecruiterDashboardComponent implements OnInit {
  recentApplications: Application[] = [];
  jobs: Job[] = [];
  isLoading = false;
  shortlistedCount = 0;
  hiredCount = 0;
  totalApplications = 0;

  constructor(
    private authService: AuthService,
    private jobService: JobService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.id) {
      this.loadDashboardData(user.id);
    }
  }

  loadDashboardData(recruiterId: number): void {
    this.isLoading = true;
    
    // Load jobs
    this.jobService.getJobsByRecruiter(recruiterId).subscribe({
      next: (data) => this.jobs = data,
      error: (err) => console.error('Error loading jobs:', err)
    });

    // Load total count
    this.applicationService.getRecruiterApplicationsCount(recruiterId).subscribe({
      next: (count) => this.totalApplications = count,
      error: (err) => console.error('Error loading application count:', err)
    });

    // Load shortlisted count
    this.applicationService.getRecruiterApplicationsCountByStatus(recruiterId, 'SHORTLISTED').subscribe({
      next: (count) => this.shortlistedCount = count,
      error: (err) => console.error('Error loading shortlisted count:', err)
    });

    // Load hired count
    this.applicationService.getRecruiterApplicationsCountByStatus(recruiterId, 'HIRED').subscribe({
      next: (count) => this.hiredCount = count,
      error: (err) => console.error('Error loading hired count:', err)
    });

    // Load applications
    this.applicationService.getApplicationsByRecruiter(recruiterId, 0, 10).subscribe({
      next: (data) => {
        this.recentApplications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.isLoading = false;
      }
    });
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.firstName || user?.name?.split(' ')[0] || 'Recruiter';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'SHORTLISTED': return 'status-shortlisted';
      default: return '';
    }
  }
}
