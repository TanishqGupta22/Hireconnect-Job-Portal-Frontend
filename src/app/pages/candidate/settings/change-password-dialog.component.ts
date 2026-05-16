import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Change Password</h2>
    <mat-dialog-content>
      <form [formGroup]="passwordForm" class="password-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Current Password</mat-label>
          <input matInput [type]="showCurrent ? 'text' : 'password'" formControlName="currentPassword">
          <button mat-icon-button matSuffix (click)="showCurrent = !showCurrent" type="button">
            <mat-icon>{{ showCurrent ? 'visibility' : 'visibility_off' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>New Password</mat-label>
          <input matInput [type]="showNew ? 'text' : 'password'" formControlName="newPassword">
          <button mat-icon-button matSuffix (click)="showNew = !showNew" type="button">
            <mat-icon>{{ showNew ? 'visibility' : 'visibility_off' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm New Password</mat-label>
          <input matInput [type]="showConfirm ? 'text' : 'password'" formControlName="confirmPassword">
          <button mat-icon-button matSuffix (click)="showConfirm = !showConfirm" type="button">
            <mat-icon>{{ showConfirm ? 'visibility' : 'visibility_off' }}</mat-icon>
          </button>
          <mat-error *ngIf="passwordForm.errors?.['mismatch']">Passwords do not match</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              [disabled]="passwordForm.invalid || isLoading" 
              (click)="onSubmit()">
        {{ isLoading ? 'Updating...' : 'Update Password' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-top: 10px;
      min-width: 350px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class ChangePasswordDialogComponent {
  passwordForm: FormGroup;
  showCurrent = false;
  showNew = false;
  showConfirm = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      this.authService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.snackBar.open('Password updated successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.snackBar.open(err.error?.message || 'Failed to update password', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
