import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JobService, Job } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';

import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.css']
})
export class MyJobsComponent implements OnInit {
  jobs: Job[] = [];
  isLoading = false;
  displayedColumns: string[] = ['title', 'status', 'applicants', 'date', 'actions'];
  recruiterId: number | null = null;

  constructor(
    private jobService: JobService,
    private authService: AuthService,
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
      this.loadJobs();
    }
  }

  loadJobs(): void {
    if (!this.recruiterId) return;

    this.isLoading = true;
    this.jobService.getJobsByRecruiter(this.recruiterId).subscribe({
      next: (data) => {
        this.jobs = data;
        this.isLoading = false;
        // Fetch applicant count for each job
        this.jobs.forEach(job => {
          this.applicationService.getJobApplicationsCount(job.id).subscribe({
            next: (count) => {
              job.applicantCount = count;
            },
            error: (err) => console.error(`Error fetching count for job ${job.id}:`, err)
          });
        });
      },
      error: (err) => {
        console.error('Error loading jobs:', err);
        this.isLoading = false;
        this.snackBar.open('Failed to load jobs.', 'Close', { duration: 3000 });
      }
    });
  }

  getTotalApplicants(): number {
    return this.jobs.reduce((total, job) => total + (job.applicantCount || 0), 0);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this job posting?') && this.recruiterId) {
      this.jobService.deleteJob(id, this.recruiterId).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(j => j.id !== id);
          this.snackBar.open('Job deleted successfully.', 'Close', { duration: 3000 });
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          this.snackBar.open('Failed to delete job.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
