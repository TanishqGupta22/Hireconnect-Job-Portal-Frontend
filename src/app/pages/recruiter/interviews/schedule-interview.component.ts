import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InterviewService } from '../../../core/services/interview.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-schedule-interview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <header class="mb-10 text-center">
          <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Schedule Interview</h1>
          <p class="text-slate-500 font-medium">Setting up a meeting with <span class="text-indigo-600 font-bold">{{ candidateName }}</span></p>
          <p class="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black">For Position: {{ jobTitle }}</p>
        </header>

        <mat-card class="premium-card p-8 md:p-12">
          <form [formGroup]="interviewForm" (ngSubmit)="onSubmit()" class="space-y-8">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

              <!-- Interview Mode -->
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Interview Mode</label>
                <div class="relative">
                  <select 
                    formControlName="mode"
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="ONLINE">Online / Video</option>
                    <option value="OFFLINE">Offline / In-person</option>
                    <option value="PHONE">Phone Call</option>
                  </select>
                  <mat-icon class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</mat-icon>
                </div>
              </div>

              <!-- Interviewer Name -->
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Interviewer Name</label>
                <input 
                  formControlName="interviewerName"
                  type="text" 
                  placeholder="e.g. John Doe" 
                  class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                >
              </div>

              <!-- Date -->
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Interview Date</label>
                <div class="relative">
                  <input 
                    [matDatepicker]="picker" 
                    formControlName="date"
                    placeholder="MM/DD/YYYY"
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                  >
                  <mat-datepicker-toggle [for]="picker" class="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </div>
              </div>

              <!-- Time -->
              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Start Time</label>
                <input 
                  formControlName="time"
                  type="time" 
                  class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                >
              </div>
            </div>

            <!-- Location or Link -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                {{ interviewForm.get('mode')?.value === 'ONLINE' ? 'Meeting Link' : 'Location / Address' }}
              </label>
              <div class="relative">
                <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                  {{ interviewForm.get('mode')?.value === 'ONLINE' ? 'link' : 'location_on' }}
                </mat-icon>
                <input 
                  [formControlName]="interviewForm.get('mode')?.value === 'ONLINE' ? 'meetingLink' : 'location'"
                  type="text" 
                  [placeholder]="interviewForm.get('mode')?.value === 'ONLINE' ? 'Zoom, Google Meet, or Teams link' : 'Office address or meeting room'" 
                  class="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                >
              </div>
            </div>

            <!-- Notes -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Interview Notes / Instructions</label>
              <textarea 
                formControlName="notes"
                rows="4" 
                placeholder="Any specific instructions for the candidate..." 
                class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium leading-relaxed placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>

            <!-- Actions -->
            <div class="pt-6 flex flex-col md:flex-row gap-4">
              <button 
                type="button" 
                (click)="onCancel()"
                class="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="isLoading"
                class="flex-[2] px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all uppercase tracking-widest text-sm"
              >
                {{ isLoading ? (isEditMode ? 'Updating...' : 'Scheduling...') : (isEditMode ? 'Update Interview' : 'Schedule Interview') }}
              </button>
            </div>

          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .premium-card {
      border-radius: 3rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
    }
  `]
})
export class ScheduleInterviewComponent implements OnInit {
  interviewForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  existingInterviewId: number | null = null;
  applicationId: number | null = null;
  candidateId: number | null = null;
  recruiterId: number | null = null;
  candidateName = '';
  jobTitle = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.interviewForm = this.fb.group({
      mode: ['ONLINE', Validators.required],
      interviewerName: ['', Validators.required],
      date: [null, Validators.required],
      time: ['', Validators.required],
      meetingLink: [''],
      location: [''],
      notes: [''],
      duration: [60]
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
      const name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Recruiter';
      this.interviewForm.patchValue({ interviewerName: name });
    }

    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'] ? +params['applicationId'] : null;
      this.candidateId = params['candidateId'] ? +params['candidateId'] : null;
      this.candidateName = params['candidateName'] || 'Candidate';
      this.jobTitle = params['jobTitle'] || 'Position';

      if (this.applicationId) {
        this.checkForExistingInterview();
      }
    });
  }

  checkForExistingInterview(): void {
    if (!this.applicationId) return;

    this.interviewService.getInterviewByApplicationId(this.applicationId).subscribe({
      next: (interview) => {
        this.isEditMode = true;
        this.existingInterviewId = interview.id;
        
        // Populate form
        const scheduledDate = new Date(interview.scheduledAt);
        const hours = scheduledDate.getHours();
        const minutes = scheduledDate.getMinutes();
        const timeStr = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

        this.interviewForm.patchValue({
          mode: interview.mode,
          interviewerName: interview.interviewerName,
          date: scheduledDate,
          time: timeStr,
          meetingLink: interview.meetingLink,
          location: interview.location,
          notes: interview.notes,
          duration: interview.duration
        });

        this.snackBar.open('Existing interview found. You can update the details.', 'OK', { duration: 5000 });
      },
      error: (err) => {
        // If not found, that's fine, we stay in create mode
        console.log('No existing interview for this application.');
      }
    });
  }

  onSubmit(): void {
    if (this.interviewForm.invalid || !this.applicationId || !this.candidateId) {
      this.interviewForm.markAllAsTouched();
      
      const invalidFields = [];
      const controls = this.interviewForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidFields.push(name);
        }
      }
      
      const missingFieldsMsg = invalidFields.length > 0 
        ? `Please check these fields: ${invalidFields.join(', ')}` 
        : 'Please fill all required fields correctly.';
        
      this.snackBar.open(missingFieldsMsg, 'Close', { duration: 5000 });
      return;
    }

    if (!this.recruiterId) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.recruiterId = user.id;
      } else {
        this.snackBar.open('Recruiter session not found. Please log in again.', 'Close', { duration: 3000 });
        return;
      }
    }

    this.isLoading = true;

    const formValue = this.interviewForm.value;
    const date = new Date(formValue.date);
    
    if (isNaN(date.getTime())) {
      this.isLoading = false;
      this.snackBar.open('Invalid date format selected.', 'Close', { duration: 3000 });
      return;
    }

    const [hours, minutes] = formValue.time.split(':');
    date.setHours(+hours, +minutes, 0, 0);

    // Format date for Spring Boot LocalDateTime (yyyy-MM-ddTHH:mm:ss)
    const pad = (n: number) => n < 10 ? '0' + n : n;
    const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

    const interviewData = {
      applicationId: this.applicationId,
      candidateId: this.candidateId,
      recruiterId: this.recruiterId,
      scheduledAt: formattedDate,
      mode: formValue.mode,
      meetingLink: formValue.meetingLink,
      location: formValue.location,
      notes: formValue.notes,
      duration: formValue.duration,
      interviewerName: formValue.interviewerName,
      candidateName: this.candidateName,
      jobTitle: this.jobTitle,
      interviewType: 'Technical' // Default
    };

    const request = this.isEditMode && this.existingInterviewId
      ? this.interviewService.updateInterview(this.existingInterviewId, interviewData)
      : this.interviewService.scheduleInterview(interviewData);

    request.subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open(this.isEditMode ? 'Interview updated successfully!' : 'Interview scheduled successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/recruiter/interviews']);
      },
      error: (err) => {
        console.error('Error saving interview:', err);
        this.isLoading = false;
        const errorMessage = err.error?.message || 'Failed to save interview. Please try again.';
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/recruiter/interviews']);
  }
}
