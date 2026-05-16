import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recruiter-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <div class="header-section">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your account preferences and notifications</p>
      </div>

      <mat-card class="settings-card">
        <mat-card-content>
          <form [formGroup]="settingsForm">
            <div class="settings-section">
              <h3>Email Notifications</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">New Applications</span>
                  <span class="setting-description">Get notified when a candidate applies for your jobs</span>
                </div>
                <mat-slide-toggle formControlName="newAppNotify"></mat-slide-toggle>
              </div>
              <mat-divider></mat-divider>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Interview Reminders</span>
                  <span class="setting-description">Receive reminders before scheduled interviews</span>
                </div>
                <mat-slide-toggle formControlName="interviewReminders"></mat-slide-toggle>
              </div>
            </div>

            <div class="settings-section">
              <h3>Security</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Two-Factor Authentication</span>
                  <span class="setting-description">Add an extra layer of security to your account</span>
                </div>
                <mat-slide-toggle formControlName="twoFactor"></mat-slide-toggle>
              </div>
            </div>

            <div class="settings-section">
              <h3>Account Visibility</h3>
              <div class="setting-item">
                <div class="setting-info">
                  <span class="setting-label">Public Company Profile</span>
                  <span class="setting-description">Make your company profile visible to all candidates</span>
                </div>
                <mat-slide-toggle formControlName="publicProfile"></mat-slide-toggle>
              </div>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" (click)="onSave()">Save Preferences</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header-section {
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

    .settings-card {
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      border: 1px solid #eee;
    }

    .settings-section {
      margin-bottom: 32px;
    }

    .settings-section h3 {
      font-weight: 600;
      margin-bottom: 16px;
      color: #333;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
    }

    .setting-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .setting-label {
      font-weight: 600;
      color: #333;
    }

    .setting-description {
      font-size: 13px;
      color: #666;
    }

    .form-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }

    mat-divider {
      opacity: 0.5;
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.settingsForm = this.fb.group({
      newAppNotify: [true],
      interviewReminders: [true],
      twoFactor: [false],
      publicProfile: [true]
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    this.snackBar.open('Settings saved successfully!', 'Close', { duration: 3000 });
  }
}
