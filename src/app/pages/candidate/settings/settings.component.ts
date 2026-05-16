import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    ChangePasswordDialogComponent
  ],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your account preferences and notifications</p>
      </div>

      <div class="settings-grid">
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>notifications</mat-icon>
            <mat-card-title>Notification Preferences</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Email Notifications</h4>
                <p>Receive job alerts and application updates via email</p>
              </div>
              <mat-slide-toggle color="primary" checked></mat-slide-toggle>
            </div>
            <mat-divider></mat-divider>
            <div class="setting-item">
              <div class="setting-info">
                <h4>SMS Alerts</h4>
                <p>Get instant updates about interviews on your phone</p>
              </div>
              <mat-slide-toggle color="primary"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>security</mat-icon>
            <mat-card-title>Security Settings</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item">
              <div class="setting-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <mat-slide-toggle color="primary"></mat-slide-toggle>
            </div>
            <mat-divider></mat-divider>
            <div class="setting-item action-item">
              <div class="setting-info">
                <h4>Change Password</h4>
                <p>Update your login credentials regularly</p>
              </div>
              <button mat-stroked-button color="primary" (click)="openChangePasswordDialog()">Update</button>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card danger-zone">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">delete_forever</mat-icon>
            <mat-card-title>Danger Zone</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="setting-item action-item">
              <div class="setting-info">
                <h4>Deactivate Account</h4>
                <p>Temporarily disable your profile and applications</p>
              </div>
              <button mat-stroked-button color="warn" (click)="deactivateAccount()">Deactivate</button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
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

    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .settings-card {
      border-radius: 12px;
      border: 1px solid #eee;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
    }

    .setting-info h4 {
      margin: 0 0 4px 0;
      font-size: 1.05rem;
      font-weight: 600;
      color: #333;
    }

    .setting-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .action-item {
      padding-bottom: 0;
    }

    .danger-zone {
      border: 1px solid #ffcdd2;
    }

    .danger-zone mat-card-title {
      color: #d32f2f;
    }
  `]
})
export class SettingsComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  deactivateAccount(): void {
    if (confirm('Are you sure you want to deactivate your account? This action will log you out and disable your profile.')) {
      this.authService.deactivateAccount().subscribe({
        next: () => {
          this.snackBar.open('Account deactivated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.snackBar.open(err.error?.message || 'Failed to deactivate account', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
