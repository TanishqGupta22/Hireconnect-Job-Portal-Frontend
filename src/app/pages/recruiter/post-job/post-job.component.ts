import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JobService, Job } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  templateUrl: './post-job.component.html',
  styleUrls: ['./post-job.component.css']
})
export class PostJobComponent implements OnInit {
  jobForm: FormGroup;
  isLoading = false;
  recruiterId: number | null = null;
  companyName: string = '';

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      type: ['FULL_TIME', Validators.required],
      workMode: ['REMOTE', Validators.required],
      location: ['', Validators.required],
      salary: [''],
      experience: [''],
      skills: [''],
      deadline: [''],
      description: ['', [Validators.required, Validators.minLength(50)]],
      requirements: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
      // In a real app, we might fetch the company name from a profile service
      const firstName = user.firstName || user.name?.split(' ')[0] || 'My';
      this.companyName = `${firstName}'s Company`;
    }
  }

  onCancel(): void {
    this.router.navigate(['/recruiter/my-jobs']);
  }

  onSubmit(): void {
    if (this.jobForm.invalid || !this.recruiterId) return;

    this.isLoading = true;
    const formValue = this.jobForm.value;
    
    // Process skills: convert string to array
    const skillsArray = typeof formValue.skills === 'string' 
      ? formValue.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
      : [];

    // Process salary into min and max
    let salaryMin: number | undefined;
    let salaryMax: number | undefined;
    
    if (formValue.salary) {
      const salaryStr = String(formValue.salary).trim();
      const parts = salaryStr.split('-').map(p => parseInt(p.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
      
      if (parts.length > 0) {
        salaryMin = parts[0];
        if (parts.length > 1) {
          salaryMax = parts[1];
        } else {
          salaryMax = parts[0]; // If single number provided
        }
      }
    }

    const jobData: Job = {
      ...formValue,
      skills: skillsArray,
      salaryMin,
      salaryMax,
      salaryCurrency: 'INR', // Explicitly set INR since we removed USD
      company: this.companyName,
      recruiterId: this.recruiterId
    };

    this.jobService.postJob(jobData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Job posted successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/recruiter/my-jobs']);
      },
      error: (err) => {
        console.error('Error posting job:', err);
        console.log('Error Body:', err.error);
        this.isLoading = false;
        let errorMessage = 'Failed to post job. Please try again.';
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if (err.statusText) {
          errorMessage = `Server Error: ${err.statusText}`;
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 7000 });
      }
    });
  }
}
