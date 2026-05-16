import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { AdminService } from '../../../core/services/admin.service';
import { ApplicationService, Application } from '../../../core/services/application.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    FormsModule
  ],
  template: `
    <div class="manage-applications">
      <div class="header">
        <div class="title-section">
          <h1>Manage Applications 📄</h1>
          <p>View all job applications across the platform</p>
        </div>
      </div>

      <mat-card class="table-card">
        <table mat-table [dataSource]="applications" class="apps-table">
          <!-- Candidate Column -->
          <ng-container matColumnDef="candidate">
            <th mat-header-cell *matHeaderCellDef>Candidate</th>
            <td mat-cell *matCellDef="let app">
              <div class="user-info">
                <span class="name">{{ app.candidateName || 'Candidate #' + app.candidateId }}</span>
                <span class="email">{{ app.candidateEmail }}</span>
              </div>
            </td>
          </ng-container>

          <!-- Job Column -->
          <ng-container matColumnDef="job">
            <th mat-header-cell *matHeaderCellDef>Job Title</th>
            <td mat-cell *matCellDef="let app">
              <span class="job-title">{{ app.jobTitle || 'Job #' + app.jobId }}</span>
            </td>
          </ng-container>

          <!-- Applied At Column -->
          <ng-container matColumnDef="appliedAt">
            <th mat-header-cell *matHeaderCellDef>Applied Date</th>
            <td mat-cell *matCellDef="let app">
              {{ app.appliedAt | date:'medium' }}
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let app">
              <mat-chip [ngClass]="app.status.toLowerCase()">{{ app.status }}</mat-chip>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div class="no-results" *ngIf="applications.length === 0">
          <mat-icon>description_off</mat-icon>
          <p>No applications found in the system</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .manage-applications {
      padding: 24px;
      animation: fadeIn 0.5s ease-out;
    }
    .header { margin-bottom: 24px; }
    .title-section h1 { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0; }
    .table-card { border-radius: 12px; overflow: hidden; }
    .apps-table { width: 100%; }
    .user-info { display: flex; flex-direction: column; padding: 12px 0; }
    .name { font-weight: 600; color: #1e293b; }
    .email { font-size: 12px; color: #64748b; }
    .job-title { font-weight: 500; }
    mat-chip.pending { background: #fff7ed; color: #c2410c; }
    mat-chip.shortlisted { background: #dcfce7; color: #15803d; }
    .no-results { padding: 48px; text-align: center; color: #64748b; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class ManageApplicationsComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns: string[] = ['candidate', 'job', 'appliedAt', 'status'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.adminService.getAllApplications().subscribe({
      next: (data) => this.applications = data || [],
      error: (err) => console.error('Error loading applications:', err)
    });
  }
}
