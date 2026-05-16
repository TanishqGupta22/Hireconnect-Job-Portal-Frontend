import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../core/services/admin.service';
import { Job } from '../../../core/services/job.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    FormsModule
  ],
  template: `
    <div class="manage-jobs">
      <div class="header">
        <div class="title-section">
          <h1>Manage Jobs 💼</h1>
          <p>Monitor and moderate all job postings across the platform</p>
        </div>
        <div class="actions">
          <button mat-raised-button color="primary">
            <mat-icon>assessment</mat-icon>
            Jobs Report
          </button>
        </div>
      </div>

      <mat-card class="filter-card">
        <mat-card-content>
          <div class="filters-grid">
            <div class="search-wrapper">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Search jobs</mat-label>
                <input matInput placeholder="Search job title or company..." [(ngModel)]="searchQuery" (keyup)="applyFilters()">
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
            </div>

            <div class="dropdowns-wrapper">
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select [(ngModel)]="statusFilter" (selectionChange)="applyFilters()">
                  <mat-option value="">All Status</mat-option>
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="CLOSED">Closed</mat-option>
                  <mat-option value="PENDING">Pending Approval</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Work Mode</mat-label>
                <mat-select [(ngModel)]="modeFilter" (selectionChange)="applyFilters()">
                  <mat-option value="">All Modes</mat-option>
                  <mat-option value="REMOTE">Remote</mat-option>
                  <mat-option value="OFFICE">On-site</mat-option>
                  <mat-option value="HYBRID">Hybrid</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <table mat-table [dataSource]="filteredJobs" class="jobs-table">
          <!-- Job Title Column -->
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Job Details</th>
            <td mat-cell *matCellDef="let job">
              <div class="job-info">
                <span class="title">{{ job.title }}</span>
                <span class="company">{{ job.company }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Type Column -->
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let job">
              <mat-chip>{{ job.type }}</mat-chip>
            </td>
          </ng-container>

          <!-- Deadline Column -->
          <ng-container matColumnDef="deadline">
            <th mat-header-cell *matHeaderCellDef>Deadline</th>
            <td mat-cell *matCellDef="let job">
              <span [class.overdue]="isOverdue(job.deadline)">
                {{ job.deadline | date:'mediumDate' }}
              </span>
            </td>
          </ng-container>

          <!-- Applicants Column -->
          <ng-container matColumnDef="applicants">
            <th mat-header-cell *matHeaderCellDef>Applicants</th>
            <td mat-cell *matCellDef="let job">
              <div class="applicant-stat">
                <mat-icon>people</mat-icon>
                {{ job.applicantCount || 0 }}
              </div>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let job">
              <span class="status-badge" [ngClass]="(job.status || 'ACTIVE').toLowerCase()">
                {{ job.status || 'ACTIVE' }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let job">
              <button mat-icon-button color="warn" (click)="deleteJob(job.id)" matTooltip="Delete job">
                <mat-icon>delete</mat-icon>
              </button>
              <button mat-icon-button color="primary" matTooltip="View details">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="no-results" *ngIf="filteredJobs.length === 0">
          <mat-icon>work_off</mat-icon>
          <p>No jobs found matching your filters</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .manage-jobs {
      padding: 24px;
      animation: fadeIn 0.5s ease-out;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .title-section h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .title-section p {
      color: #64748b;
      margin: 4px 0 0 0;
    }

    .filter-card {
      margin-bottom: 24px;
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      border: 1px solid #f1f5f9;
    }

    .filters-grid {
      display: flex;
      gap: 20px;
      align-items: center;
      padding: 12px 0;
    }

    .search-wrapper {
      flex: 2;
    }

    .dropdowns-wrapper {
      flex: 2;
      display: flex;
      gap: 16px;
    }

    .filters-grid mat-form-field {
      width: 100%;
    }

    ::ng-deep .filters-grid .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .table-card {
      border-radius: 12px;
      overflow: hidden;
    }

    .jobs-table {
      width: 100%;
    }

    .job-info {
      display: flex;
      flex-direction: column;
      padding: 8px 0;
    }

    .title {
      font-weight: 600;
      color: #1e293b;
    }

    .company {
      font-size: 12px;
      color: #64748b;
    }

    .applicant-stat {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #64748b;
    }

    .applicant-stat mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.active { background: #dcfce7; color: #15803d; }
    .status-badge.closed { background: #f1f5f9; color: #475569; }
    .status-badge.pending { background: #fff7ed; color: #c2410c; }

    .overdue {
      color: #ef4444;
      font-weight: 600;
    }

    .no-results {
      padding: 48px;
      text-align: center;
      color: #64748b;
    }

    .no-results mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ManageJobsComponent implements OnInit {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  displayedColumns: string[] = ['title', 'type', 'deadline', 'applicants', 'status', 'actions'];

  searchQuery: string = '';
  statusFilter: string = '';
  modeFilter: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    forkJoin([
      this.adminService.getAllJobs(),
      this.adminService.getAllApplications()
    ]).subscribe({
      next: ([jobs, applications]) => {
        // Create a map of jobId -> count
        const counts = applications.reduce((acc: any, app: any) => {
          acc[app.jobId] = (acc[app.jobId] || 0) + 1;
          return acc;
        }, {});

        this.jobs = (jobs || []).map(job => ({
          ...job,
          applicantCount: counts[job.id] || 0
        }));
        
        this.filteredJobs = [...this.jobs];
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading jobs and applications:', err);
        this.jobs = [];
        this.filteredJobs = [];
      }
    });
  }

  loadMockJobs(): void {
    // Dummy data removed
    this.jobs = [];
    this.filteredJobs = [];
  }

  applyFilters(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !this.searchQuery || 
        job.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = !this.statusFilter || job.status === this.statusFilter;
      const matchesMode = !this.modeFilter || job.workMode === this.modeFilter;

      return matchesSearch && matchesStatus && matchesMode;
    });
  }

  isOverdue(deadline: string): boolean {
    return new Date(deadline) < new Date();
  }

  deleteJob(id: number): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.adminService.deleteJob(id).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(j => j.id !== id);
          this.applyFilters();
        },
        error: (err) => console.error('Error deleting job:', err)
      });
    }
  }
}
