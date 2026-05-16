import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="reports-page">
      <div class="header">
        <h1>System Reports 📊</h1>
        <p>Generate and export system-wide performance reports</p>
      </div>

      <div class="reports-grid">
        <mat-card class="report-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>User Growth Report</mat-card-title>
            <mat-card-subtitle>Monthly user registration trends</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-button color="primary">GENERATE PDF</button>
            <button mat-button>EXPORT CSV</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="report-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>work</mat-icon>
            <mat-card-title>Job Market Analysis</mat-card-title>
            <mat-card-subtitle>Top categories and hiring trends</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-button color="primary">GENERATE PDF</button>
            <button mat-button>EXPORT CSV</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="report-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>payments</mat-icon>
            <mat-card-title>Financial Summary</mat-card-title>
            <mat-card-subtitle>Quarterly revenue and subscription stats</mat-card-subtitle>
          </mat-card-header>
          <mat-card-actions>
            <button mat-button color="primary">GENERATE PDF</button>
            <button mat-button>EXPORT CSV</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reports-page { padding: 24px; animation: fadeIn 0.5s; }
    .header { margin-bottom: 24px; }
    .header h1 { font-size: 28px; font-weight: 700; }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
    .report-card { border-radius: 12px; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ReportsComponent {}

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="settings-page">
      <div class="header">
        <h1>Admin Settings ⚙️</h1>
        <p>Configure system preferences and security</p>
      </div>

      <mat-card class="settings-section">
        <mat-card-header>
          <mat-card-title>System Configuration</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="setting-item">
            <div class="info">
              <span class="label">Maintenance Mode</span>
              <span class="desc">Disable access for non-admin users during updates</span>
            </div>
            <button mat-stroked-button [color]="isMaintenanceMode ? 'accent' : 'warn'" (click)="toggleMaintenance()">
              {{ isMaintenanceMode ? 'DISABLE' : 'ENABLE' }}
            </button>
          </div>
          <div class="setting-item">
            <div class="info">
              <span class="label">Email Notifications</span>
              <span class="desc">System alerts for high server load or errors</span>
            </div>
            <button mat-stroked-button color="primary" (click)="configureEmail()">CONFIGURE</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-page { padding: 24px; animation: fadeIn 0.5s; }
    .header { margin-bottom: 24px; }
    .settings-section { border-radius: 12px; max-width: 800px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; border-bottom: 1px solid #f1f5f9; }
    .setting-item:last-child { border-bottom: none; }
    .info { display: flex; flex-direction: column; gap: 4px; }
    .label { font-weight: 700; color: #1e293b; font-size: 16px; }
    .desc { font-size: 14px; color: #64748b; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class SettingsComponent {
  isMaintenanceMode = false;

  constructor(private snackBar: MatSnackBar) {}

  toggleMaintenance() {
    this.isMaintenanceMode = !this.isMaintenanceMode;
    const msg = this.isMaintenanceMode ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled';
    this.snackBar.open(msg, 'OK', { duration: 3000 });
  }

  configureEmail() {
    this.snackBar.open('Email Notification settings opened', 'OK', { duration: 3000 });
  }
}
