import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { AdminService } from '../../../core/services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-recruiters',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCardModule,
    MatProgressBarModule,
    MatMenuModule,
    FormsModule
  ],
  template: `
    <div class="manage-recruiters">
      <div class="header">
        <div class="title-section">
          <h1>Manage Recruiters 🏢</h1>
          <p>Verify companies and monitor recruiter activity</p>
        </div>
      </div>

      <div class="stats-row">
        <mat-card class="stat-mini">
          <mat-card-content>
            <div class="mini-label">Total Recruiters</div>
            <div class="mini-value">{{ stats.total }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-mini">
          <mat-card-content>
            <div class="mini-label">Pending Verification</div>
            <div class="mini-value warning">{{ stats.pending }}</div>
          </mat-card-content>
        </mat-card>
        <mat-card class="stat-mini">
          <mat-card-content>
            <div class="mini-label">Premium Partners</div>
            <div class="mini-value primary">{{ stats.premium }}</div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="table-card">
        <table mat-table [dataSource]="recruiters" class="recruiters-table">
          <!-- Company Column -->
          <ng-container matColumnDef="company">
            <th mat-header-cell *matHeaderCellDef>Recruiter & Company</th>
            <td mat-cell *matCellDef="let recruiter">
              <div class="recruiter-info">
                <div class="company-logo">
                  <mat-icon>business</mat-icon>
                </div>
                <div class="details">
                  <span class="name">{{ recruiter.name }}</span>
                  <div class="sub-details">
                    <span class="company">{{ recruiter.companyName || 'Not Set' }}</span>
                    <span class="dot">•</span>
                    <span class="email">{{ recruiter.email }}</span>
                  </div>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Jobs Posted Column -->
          <ng-container matColumnDef="jobs">
            <th mat-header-cell *matHeaderCellDef>Joined Date</th>
            <td mat-cell *matCellDef="let recruiter">
              {{ recruiter.createdAt | date:'mediumDate' }}
            </td>
          </ng-container>

          <!-- Plan Column -->
          <ng-container matColumnDef="plan">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let recruiter">
              <mat-chip class="recruiter">{{ recruiter.role }}</mat-chip>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let recruiter">
              <span class="status-badge" [ngClass]="(recruiter.status || 'ACTIVE').toLowerCase()">
                {{ recruiter.status || 'ACTIVE' }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let recruiter">
              <button mat-icon-button color="primary" [matMenuTriggerFor]="null">
                <mat-icon>more_vert</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .manage-recruiters {
      padding: 24px;
      animation: fadeIn 0.5s ease-out;
    }

    .header {
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
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-mini {
      border-radius: 12px;
    }

    .mini-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .mini-value {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 4px;
    }

    .mini-value.warning { color: #f59e0b; }
    .mini-value.primary { color: #3b82f6; }

    .table-card {
      border-radius: 12px;
      overflow: hidden;
    }

    .recruiter-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
    }

    .company-logo {
      width: 40px;
      height: 40px;
      background: #f1f5f9;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }

    .details .name {
      display: block;
      font-weight: 600;
      color: #1e293b;
    }

    .details .company {
      font-size: 13px;
      font-weight: 600;
      color: #3b82f6;
    }

    .sub-details {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #64748b;
    }

    .dot {
      color: #cbd5e1;
    }

    .job-count {
      width: 120px;
    }

    .job-count span {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
      display: block;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.active { background: #dcfce7; color: #15803d; }
    .status-badge.pending { background: #fff7ed; color: #c2410c; }

    mat-chip.enterprise { background: #fef2f2; color: #991b1b; }
    mat-chip.pro { background: #eff6ff; color: #1d4ed8; }
    mat-chip.free { background: #f1f5f9; color: #475569; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ManageRecruitersComponent implements OnInit {
  displayedColumns: string[] = ['company', 'jobs', 'plan', 'status', 'actions'];
  recruiters: any[] = [];
  stats = {
    total: 0,
    pending: 0,
    premium: 0
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRecruiters();
  }

  loadRecruiters(): void {
    this.adminService.getRecruiters().subscribe({
      next: (data) => {
        this.recruiters = data || [];
        this.stats.total = this.recruiters.length;
        this.stats.pending = this.recruiters.filter(r => r.status === 'PENDING').length;
        this.stats.premium = 0; // Currently no premium logic implemented
      },
      error: (err) => {
        console.error('Error loading recruiters:', err);
        this.recruiters = [];
      }
    });
  }
}
