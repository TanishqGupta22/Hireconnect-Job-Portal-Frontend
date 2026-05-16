import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProfileService, CompanyProfile } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  logoUrl: string | null = null;
  recruiterId: number | null = null;
  profileExists = false;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      website: ['', [Validators.pattern('https?://.+')]],
      industry: [''],
      companySize: [''],
      address: ['', [Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
      linkedin: ['', [Validators.pattern('https?://(www\\.)?linkedin\\.com/.+')]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
      this.loadProfile();
    }
  }

  get profileStrength(): number {
    if (!this.profileForm) return 0;
    let filledFields = 0;
    const totalFields = 10; // 9 form fields + 1 logo

    const values = this.profileForm.value;
    if (values.companyName) filledFields++;
    if (values.website) filledFields++;
    if (values.industry) filledFields++;
    if (values.companySize) filledFields++;
    if (values.address) filledFields++;
    if (values.description) filledFields++;
    if (values.contactEmail) filledFields++;
    if (values.contactPhone) filledFields++;
    if (values.linkedin) filledFields++;
    if (this.logoUrl) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }

  loadProfile(): void {
    if (!this.recruiterId) return;
    
    this.isLoading = true;
    this.profileService.getRecruiterProfile(this.recruiterId).subscribe({
      next: (profile) => {
        if (profile) {
          this.profileExists = true;
          // Map backend fields to form
          this.profileForm.patchValue({
            companyName: profile.companyName,
            website: profile.website,
            industry: profile.industry,
            companySize: profile.companySize,
            address: profile.address,
            description: profile.description,
            contactEmail: profile.contactEmail,
            contactPhone: profile.contactPhone,
            linkedin: profile.linkedin
          });
          this.logoUrl = profile.logoUrl || null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
        // If it's a 404, it just means the profile doesn't exist yet, which is fine
        if (err.status === 404) {
          this.profileExists = false;
          console.log('Profile does not exist yet. Will create on first save.');
        } else {
          this.snackBar.open('Failed to load profile data.', 'Close', { duration: 3000 });
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.snackBar.open('File size exceeds 2MB limit.', 'Close', { duration: 3000 });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.recruiterId) {
      this.markFormGroupTouched(this.profileForm);
      this.snackBar.open('Please fix the errors in the form before saving.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const profileData = {
      ...this.profileForm.value,
      userId: this.recruiterId,
      logoUrl: this.logoUrl
    };

    const saveObs = this.profileExists 
      ? this.profileService.updateRecruiterProfile(this.recruiterId, profileData)
      : this.profileService.createRecruiterProfile(profileData);

    saveObs.subscribe({
      next: (res) => {
        this.isLoading = false;
        this.profileExists = true; // Now it definitely exists
        this.snackBar.open('Profile updated successfully!', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (err) => {
        console.error('Full error object:', err);
        this.isLoading = false;
        
        let errorMessage = 'Failed to update profile.';
        
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error.errors && Array.isArray(err.error.errors)) {
            const fieldErrors = err.error.errors.map((e: any) => `${e.field}: ${e.defaultMessage}`).join('; ');
            errorMessage = `Validation Error: ${fieldErrors}`;
          } else if (err.error.message) {
            errorMessage = err.error.message;
          }
        }
        
        this.snackBar.open(errorMessage, 'Close', { 
          duration: 10000, 
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as any);
      }
    });
  }
}
