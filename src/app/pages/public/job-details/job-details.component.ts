import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { JobService, Job } from '../../../core/services/job.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="job-details" *ngIf="job">
      <div class="job-header">
        <div class="job-info">
          <h1>{{ job.title }}</h1>
          <h2>{{ job.company }}</h2>
          <div class="job-meta">
            <span class="location">
              <mat-icon>location_on</mat-icon>
              {{ job.location }}
            </span>
            <span class="type">
              <mat-icon>work</mat-icon>
              {{ job.type }}
            </span>
            <span class="salary">
              <mat-icon>payments</mat-icon>
              {{ job.salaryMin | currency:'INR':'symbol':'1.0-0' }} - {{ job.salaryMax | currency:'INR':'symbol':'1.0-0' }}
            </span>
            <span class="experience">
              <mat-icon>timeline</mat-icon>
              {{ job.experienceRequired }} Years Required
            </span>
          </div>
        </div>
        <div class="company-logo">
          <img [src]="job.companyLogo" [alt]="job.company">
        </div>
      </div>

      <div class="job-content">
        <div class="job-main">
          <mat-card class="description-card">
            <mat-card-header>
              <mat-card-title>Job Description</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="description">
                <p>{{ job.description }}</p>
                <h3>Requirements</h3>
                <p>{{ job.requirements }}</p>
                
                <h3 *ngIf="job.responsibilities">Responsibilities</h3>
                <p *ngIf="job.responsibilities">{{ job.responsibilities }}</p>

                <h3 *ngIf="job.benefits">Benefits</h3>
                <p *ngIf="job.benefits">{{ job.benefits }}</p>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="skills-card">
            <mat-card-header>
              <mat-card-title>Required Skills</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="skills-list">
                <mat-chip *ngFor="let skill of job.skills">{{ skill }}</mat-chip>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="company-card">
            <mat-card-header>
              <mat-card-title>About {{ job.company }}</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="company-info">
                <p>{{ job.companyDescription }}</p>
                <div class="company-stats">
                  <div class="stat">
                    <div class="stat-value">{{ job.companySize }}</div>
                    <div class="stat-label">Employees</div>
                  </div>
                  <div class="stat">
                    <div class="stat-value">{{ job.companyFounded }}</div>
                    <div class="stat-label">Founded</div>
                  </div>
                  <div class="stat">
                    <div class="stat-value">{{ job.companyIndustry }}</div>
                    <div class="stat-label">Industry</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="job-sidebar">
          <mat-card class="apply-card">
            <mat-card-content>
              <button mat-raised-button color="primary" class="apply-btn" (click)="applyForJob()">
                Apply Now
              </button>
              <div class="job-stats">
                <div class="stat">
                  <mat-icon>visibility</mat-icon>
                  <span>{{ job.views }} views</span>
                </div>
                <div class="stat">
                  <mat-icon>people</mat-icon>
                  <span>{{ job.applicantCount || 0 }} applicants</span>
                </div>
                <div class="stat">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ job.postedTime }}</span>
                </div>
              </div>
              <div class="job-actions">
                <button mat-icon-button (click)="saveJob()">
                  <mat-icon [color]="job.saved ? 'warn' : 'action'">
                    {{ job.saved ? 'favorite' : 'favorite_border' }}
                  </mat-icon>
                </button>
                <button mat-icon-button>
                  <mat-icon>share</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="contact-card">
            <mat-card-header>
              <mat-card-title>Contact Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="contact-info">
                <div class="contact-item">
                  <mat-icon>person</mat-icon>
                  <span>{{ job.contactPerson }}</span>
                </div>
                <div class="contact-item">
                  <mat-icon>email</mat-icon>
                  <span>{{ job.contactEmail }}</span>
                </div>
                <div class="contact-item">
                  <mat-icon>phone</mat-icon>
                  <span>{{ job.contactPhone }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="similar-jobs-card">
            <mat-card-header>
              <mat-card-title>Similar Jobs</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="similar-jobs">
                <div class="similar-job" *ngFor="let similarJob of similarJobs">
                  <h4>{{ similarJob.title }}</h4>
                  <p>{{ similarJob.company }}</p>
                  <p class="salary">{{ similarJob.salary }}</p>
                  <button mat-button color="primary">View Job</button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-details {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding: 24px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .job-info h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #212529;
      margin-bottom: 8px;
    }

    .job-info h2 {
      font-size: 1.25rem;
      font-weight: 500;
      color: #6c757d;
      margin-bottom: 16px;
    }

    .job-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .job-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .job-meta mat-icon {
      font-size: 1rem;
      width: 16px;
      height: 16px;
    }

    .company-logo {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e9ecef;
    }

    .company-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .job-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .job-main {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .description-card,
    .skills-card,
    .company-card {
      border-radius: 12px;
    }

    .description h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #212529;
      margin: 24px 0 12px 0;
    }

    .description h3:first-child {
      margin-top: 0;
    }

    .description p {
      color: #6c757d;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .description ul {
      margin: 0;
      padding-left: 20px;
    }

    .description li {
      color: #6c757d;
      margin-bottom: 8px;
    }

    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .company-info p {
      color: #6c757d;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .company-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 16px;
    }

    .stat {
      text-align: center;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #212529;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6c757d;
      margin-top: 4px;
    }

    .job-sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .apply-card,
    .contact-card,
    .similar-jobs-card {
      border-radius: 12px;
    }

    .apply-btn {
      width: 100%;
      padding: 16px;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .job-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .job-stats .stat {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .job-stats mat-icon {
      font-size: 1rem;
      width: 16px;
      height: 16px;
    }

    .job-actions {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding-top: 16px;
      border-top: 1px solid #e9ecef;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .contact-item mat-icon {
      font-size: 1rem;
      width: 16px;
      height: 16px;
    }

    .similar-jobs {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .similar-job {
      padding: 16px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .similar-job:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .similar-job h4 {
      font-size: 0.875rem;
      font-weight: 600;
      color: #212529;
      margin-bottom: 4px;
    }

    .similar-job p {
      font-size: 0.75rem;
      color: #6c757d;
      margin-bottom: 4px;
    }

    .similar-job .salary {
      font-weight: 600;
      color: #667eea;
    }

    @media (max-width: 768px) {
      .job-details {
        padding: 16px;
      }

      .job-header {
        flex-direction: column;
        gap: 16px;
      }

      .job-content {
        grid-template-columns: 1fr;
      }

      .job-meta {
        flex-direction: column;
        gap: 8px;
      }

      .company-stats {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .job-info h1 {
        font-size: 1.5rem;
      }

      .job-info h2 {
        font-size: 1rem;
      }
    }
  `]
})
export class JobDetailsComponent implements OnInit {
  job: any = null;

  similarJobs: any[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private jobService: JobService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.params['id'];
    if (jobId) {
      this.loadJobDetails(jobId);
    }
  }

  loadJobDetails(id: number): void {
    this.isLoading = true;
    this.jobService.getJobById(id).subscribe({
      next: (job) => {
        this.job = {
          ...job,
          company: 'Loading...',
          companyLogo: 'assets/images/default-company.png',
          saved: false,
          views: Math.floor(Math.random() * 5000), // Mock views
          postedTime: this.formatDate(job.createdAt)
        };
        this.fetchCompanyDetails(job.recruiterId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading job details:', err);
        this.snackBar.open('Job not found or error loading details.', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  fetchCompanyDetails(recruiterId: number): void {
    this.profileService.getRecruiterProfile(recruiterId).subscribe({
      next: (profile) => {
        this.job.company = profile.companyName;
        this.job.companyLogo = profile.logoUrl;
        this.job.companyDescription = profile.description;
        this.job.companySize = profile.companySize;
        this.job.companyIndustry = profile.industry;
        this.job.contactEmail = profile.contactEmail;
        this.job.contactPhone = profile.contactPhone;
      },
      error: (err) => console.error('Error loading company profile:', err)
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  }

  applyForJob(): void {
    // Check if user is a recruiter
    if (this.authService.getUserRole() === 'RECRUITER') {
      this.snackBar.open('As a recruiter, you cannot apply for jobs. Please use a candidate account.', 'Close', {
        duration: 5000,
        panelClass: ['warning-snackbar']
      });
      return;
    }

    console.log('Applying for job:', this.job.title);
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      this.snackBar.open('Please login to apply for jobs', 'Login', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      }).onAction().subscribe(() => {
        this.router.navigate(['/auth/login'], { 
          queryParams: { returnUrl: this.router.url } 
        });
      });
      return;
    }

    // Navigate to application page
    this.router.navigate(['/candidate/apply-job', this.job.id]);
  }

  saveJob(): void {
    this.job.saved = !this.job.saved;
    const message = this.job.saved ? 'Job saved!' : 'Job removed from saved';
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  shareJob(): void {
    // Copy job URL to clipboard
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('Job URL copied to clipboard!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    });
  }
}
