import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-apply-job',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    RouterModule
  ],
  template: `
    <div class="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Back Button -->
        <button 
          (click)="goBack()" 
          class="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold mb-8 transition-all"
        >
          <div class="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-indigo-50 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </div>
          Back to Job Listings
        </button>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left: Job Summary Card -->
          <div class="lg:col-span-4 space-y-6">
            <div class="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-32">
              <div class="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 mb-6">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>

              <div *ngIf="job; else jobLoading">
                <h2 class="text-2xl font-black text-slate-900 leading-tight mb-2">{{ job.title }}</h2>
                <p class="text-indigo-600 font-black text-lg mb-6">{{ job.company }}</p>
                
                <div class="space-y-4 pt-6 border-t border-slate-100">
                  <div class="flex items-center gap-3 text-slate-600 font-bold">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    </svg>
                    {{ job.location }}
                  </div>
                  <div class="flex items-center gap-3 text-slate-600 font-bold">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ job.type }}
                  </div>
                  <div class="flex items-center gap-3 text-slate-600 font-bold">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 5V14m0 1v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ job.salary || 'Competitive Salary' }}
                  </div>
                </div>

                <div class="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p class="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Application Tip</p>
                  <p class="text-sm text-slate-600 font-medium">Be sure to highlight how your experience directly relates to the requirements mentioned in the job description.</p>
                </div>
              </div>

              <ng-template #jobLoading>
                <div class="animate-pulse space-y-4">
                  <div class="h-8 bg-slate-100 rounded-lg w-3/4"></div>
                  <div class="h-6 bg-slate-50 rounded-lg w-1/2"></div>
                  <div class="h-24 bg-slate-50 rounded-2xl w-full mt-8"></div>
                </div>
              </ng-template>
            </div>
          </div>

          <!-- Right: Application Form -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
              <div class="mb-10">
                <h3 class="text-3xl font-black text-slate-900 mb-2">Submit Your Application</h3>
                <p class="text-slate-500 font-bold text-lg">Complete the details below to apply for this position.</p>
              </div>

              <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()" class="space-y-8">
                <!-- Cover Letter -->
                <div class="space-y-2">
                  <label class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Cover Letter</label>
                  <div class="relative">
                    <textarea 
                      formControlName="coverLetter" 
                      rows="8"
                      placeholder="Tell us why you are a great fit for this role..."
                      class="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                    ></textarea>
                  </div>
                  <p *ngIf="applicationForm.get('coverLetter')?.touched && applicationForm.get('coverLetter')?.invalid" class="text-rose-500 text-sm font-black ml-1">
                    Please provide a cover letter (min 20 characters).
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Expected Salary -->
                  <div class="space-y-2">
                    <label class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Expected Salary</label>
                    <div class="relative group">
                      <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <span class="text-slate-400 font-black">₹</span>
                      </div>
                      <input 
                        type="text" 
                        formControlName="expectedSalary"
                        placeholder="e.g. 75,000"
                        class="w-full pl-10 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
                      >
                    </div>
                  </div>

                  <!-- Start Date -->
                  <div class="space-y-2">
                    <label class="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Available From</label>
                    <input 
                      type="date" 
                      formControlName="availableDate"
                      class="w-full px-6 py-5 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-900"
                    >
                  </div>
                </div>

                <!-- Resume Confirmation -->
                <div class="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-center gap-6">
                  <div class="w-14 h-14 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-black text-indigo-900">Resume from Profile</h4>
                    <p class="text-sm text-indigo-600 font-bold">Your primary resume will be attached automatically.</p>
                  </div>
                  <button type="button" routerLink="/candidate/profile" class="ml-auto text-indigo-600 font-black hover:underline text-sm uppercase tracking-widest">Update</button>
                </div>

                <!-- Action Buttons -->
                <div class="pt-8 flex items-center gap-4">
                  <button 
                    type="submit"
                    [disabled]="applicationForm.invalid || isLoading"
                    class="flex-1 inline-flex items-center justify-center px-10 py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none"
                  >
                    <span *ngIf="!isLoading">Submit Application</span>
                    <div *ngIf="isLoading" class="flex items-center gap-2">
                      <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  </button>
                  
                  <button 
                    type="button" 
                    (click)="goBack()"
                    [disabled]="isLoading"
                    class="px-10 py-5 bg-white text-slate-500 font-black rounded-[2rem] border-2 border-slate-100 hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ApplyJobComponent implements OnInit {
  applicationForm: any;

  isLoading = false;
  jobId: string = '';
  job: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.applicationForm = this.fb.group({
      jobId: ['', Validators.required],
      coverLetter: ['', [Validators.required, Validators.minLength(20)]],
      expectedSalary: ['', Validators.required],
      availableDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id') || '';
    this.applicationForm.patchValue({ jobId: this.jobId });
    this.loadJobDetails();
  }

  loadJobDetails(): void {
    if (!this.jobId) return;
    this.jobService.getJobById(Number(this.jobId)).subscribe({
      next: (job) => {
        this.job = job;
        // Fetch company name from recruiter profile
        if (job.recruiterId) {
          this.profileService.getRecruiterProfile(job.recruiterId).subscribe({
            next: (profile) => {
              if (this.job) {
                this.job.company = profile.companyName;
              }
            },
            error: (err) => console.error('Error fetching recruiter profile:', err)
          });
        }
      },
      error: (err) => {
        console.error('Error loading job details:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.applicationForm.invalid) {
      this.markFormGroupTouched(this.applicationForm);
      return;
    }

    const user = this.authService.getCurrentUser() as any;
    if (!user) {
      this.snackBar.open('Please log in to apply.', 'Close', { duration: 3000 });
      return;
    }

    if (!this.job) {
      this.snackBar.open('Job details are still loading. Please wait a moment.', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    
    const applicationData = {
      jobId: Number(this.jobId),
      candidateId: user.id,
      candidateName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      candidateEmail: user.email,
      recruiterId: this.job?.recruiterId,
      jobTitle: this.job?.title || 'Unknown Position',
      companyName: this.job?.company || 'Unknown Company',
      coverLetter: this.applicationForm.value.coverLetter,
      expectedSalary: this.applicationForm.value.expectedSalary,
      availableDate: this.applicationForm.value.availableDate,
      resumeUrl: user.resumeUrl || 'default_resume.pdf'
    };

    this.applicationService.applyForJob(applicationData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Application submitted successfully!', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/candidate/applied-jobs']);
      },
      error: (err) => {
        this.isLoading = false;
        let msg = 'Failed to submit application.';
        if (err.error && typeof err.error === 'string') msg = err.error;
        this.snackBar.open(msg, 'Close', { duration: 5000 });
      }
    });
  }

  private markFormGroupTouched(formGroup: any) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/candidate/browse-jobs']);
  }
}
