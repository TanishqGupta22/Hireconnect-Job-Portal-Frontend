import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ApplicationService } from '../../../core/services/application.service';
import { InterviewService, Interview } from '../../../core/services/interview.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-candidate-profile-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4">
      <div class="max-w-6xl mx-auto" *ngIf="!isLoading; else loading">
        <!-- Back Button & Header -->
        <div class="mb-8 flex items-center justify-between">
          <button mat-button (click)="goBack()" class="text-slate-600 font-bold">
            <mat-icon>arrow_back</mat-icon>
            Back to Applicants
          </button>
          <div class="flex gap-3">
             <button mat-flat-button color="primary" (click)="scheduleInterview()" class="rounded-xl px-6 py-2 shadow-lg shadow-indigo-100">
               <mat-icon>event</mat-icon>
               Schedule Interview
             </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- Left Column: Profile Card -->
          <div class="lg:col-span-4 space-y-6">
            <mat-card class="premium-card text-center p-8">
              <div class="w-32 h-32 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-6 text-4xl font-black border border-indigo-100 shadow-inner">
                {{ profile?.fullName?.charAt(0) || 'C' }}
              </div>
              <h2 class="text-2xl font-black text-slate-900 mb-1">{{ profile?.fullName || 'Candidate' }}</h2>
              <p class="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-6">{{ profile?.headline || 'No Headline' }}</p>
              
              <div class="flex flex-col gap-4 text-left border-t border-slate-100 pt-6">
                <div class="flex items-center gap-3 text-slate-600">
                  <mat-icon class="text-slate-400">email</mat-icon>
                  <span class="text-sm font-medium">{{ profile?.email || 'N/A' }}</span>
                </div>
                <div class="flex items-center gap-3 text-slate-600">
                  <mat-icon class="text-slate-400">phone</mat-icon>
                  <span class="text-sm font-medium">{{ profile?.mobile || 'N/A' }}</span>
                </div>
                <div class="flex items-center gap-3 text-slate-600">
                  <mat-icon class="text-slate-400">location_on</mat-icon>
                  <span class="text-sm font-medium">{{ profile?.address || 'N/A' }}</span>
                </div>
              </div>

              <div class="mt-8 pt-6 border-t border-slate-100">
                <button mat-stroked-button color="primary" class="w-full rounded-xl py-2" (click)="downloadResume()" *ngIf="profile?.resumeUrl">
                  <mat-icon>download</mat-icon>
                  Download Resume
                </button>
              </div>
            </mat-card>

            <!-- Application Status Card -->
            <mat-card class="premium-card p-6" *ngIf="application">
              <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Application Management</h3>
              <div class="space-y-4">
                <div>
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Status</label>
                  <mat-form-field appearance="outline" class="w-full" [ngClass]="application.status.toLowerCase()">
                    <mat-select [value]="application.status" (selectionChange)="onStatusChange($event.value)">
                      <mat-option value="APPLIED">Applied</mat-option>
                      <mat-option value="SHORTLISTED">Shortlisted</mat-option>
                      <mat-option value="INTERVIEW_SCHEDULED">Interview Scheduled</mat-option>
                      <mat-option value="REJECTED">Rejected</mat-option>
                      <mat-option value="HIRED">Hired</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Applied For</p>
                  <p class="font-bold text-slate-900">{{ application.jobTitle }}</p>
                  <p class="text-[10px] text-slate-400 mt-2">ID: #{{ application.id }}</p>
                </div>
              </div>
            </mat-card>
          </div>

          <!-- Right Column: Details -->
          <div class="lg:col-span-8 space-y-8">
            <!-- About Section -->
            <mat-card class="premium-card p-8">
              <h3 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <mat-icon class="text-indigo-600">person</mat-icon>
                Professional Bio
              </h3>
              <p class="text-slate-600 leading-relaxed font-medium">
                {{ profile?.bio || 'No professional bio provided yet.' }}
              </p>
            </mat-card>

            <!-- Skills Section -->
            <mat-card class="premium-card p-8">
              <h3 class="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <mat-icon class="text-amber-500">bolt</mat-icon>
                Technical Skills
              </h3>
              <div class="flex flex-wrap gap-3">
                <span *ngFor="let skill of profile?.skills" class="px-4 py-2 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-100 text-sm">
                  {{ skill }}
                </span>
                <span *ngIf="!profile?.skills?.length" class="text-slate-400">No skills listed.</span>
              </div>
            </mat-card>

            <!-- Interviews Section -->
            <mat-card class="premium-card p-8">
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-xl font-black text-slate-900 flex items-center gap-3">
                  <mat-icon class="text-emerald-500">event_available</mat-icon>
                  Interview History
                </h3>
                <button mat-button color="primary" (click)="scheduleInterview()">
                  <mat-icon>add</mat-icon>
                  New Interview
                </button>
              </div>

              <div class="space-y-4" *ngIf="interviews.length > 0; else noInterviews">
                <div *ngFor="let interview of interviews" class="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-indigo-200 transition-all">
                  <div class="flex gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center shrink-0">
                      <span class="text-[10px] font-black text-slate-400 uppercase">{{ interview.startTime | date:'MMM' }}</span>
                      <span class="text-xl font-black text-indigo-600">{{ interview.startTime | date:'dd' }}</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-3 mb-1">
                        <h4 class="font-black text-slate-900">{{ interview.jobTitle || 'Technical Interview' }}</h4>
                        <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider" 
                              [ngClass]="{
                                'bg-blue-50 text-blue-600': interview.status === 'SCHEDULED',
                                'bg-emerald-50 text-emerald-600': interview.status === 'COMPLETED',
                                'bg-rose-50 text-rose-600': interview.status === 'CANCELLED'
                              }">
                          {{ interview.status }}
                        </span>
                      </div>
                      <p class="text-sm text-slate-500 font-medium">Mode: <span class="text-slate-900">{{ interview.mode }}</span> • Time: <span class="text-slate-900">{{ interview.startTime | date:'shortTime' }}</span></p>
                      <p class="text-xs text-indigo-600 font-bold mt-2 flex items-center gap-1" *ngIf="interview.meetingLink">
                        <mat-icon class="text-sm">videocam</mat-icon>
                        <a [href]="interview.meetingLink" target="_blank" class="hover:underline">Join Meeting</a>
                      </p>
                      <p class="text-xs text-slate-600 font-bold mt-2 flex items-center gap-1" *ngIf="interview.location">
                        <mat-icon class="text-sm">location_on</mat-icon>
                        {{ interview.location }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ng-template #noInterviews>
                <div class="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <mat-icon class="text-slate-200 text-4xl mb-3">calendar_today</mat-icon>
                  <p class="text-slate-400 font-bold">No interviews scheduled yet.</p>
                </div>
              </ng-template>
            </mat-card>
          </div>
        </div>
      </div>

      <ng-template #loading>
        <div class="flex flex-col items-center justify-center py-32">
          <mat-spinner diameter="50"></mat-spinner>
          <p class="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Candidate Profile...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .premium-card {
      border-radius: 2.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      background: white;
    }
    :host ::ng-deep .mat-mdc-form-field-flex {
      background-color: transparent !important;
    }
    :host ::ng-deep .mat-mdc-select-trigger {
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border: 2px solid #e2e8f0;
    }
    .applied ::ng-deep .mat-mdc-select-trigger { background: #f0f9ff; color: #0369a1; border-color: #e0f2fe; }
    .reviewed ::ng-deep .mat-mdc-select-trigger { background: #f5f3ff; color: #6d28d9; border-color: #ede9fe; }
    .shortlisted ::ng-deep .mat-mdc-select-trigger { background: #ecfdf5; color: #047857; border-color: #d1fae5; }
    .rejected ::ng-deep .mat-mdc-select-trigger { background: #fff1f2; color: #be123c; border-color: #ffe4e6; }
    .hired ::ng-deep .mat-mdc-select-trigger { background: #f0fdf4; color: #15803d; border-color: #dcfce7; }
    .interview_scheduled ::ng-deep .mat-mdc-select-trigger { background: #fff7ed; color: #9a3412; border-color: #ffedd5; }
  `]
})
export class CandidateProfileViewComponent implements OnInit {
  candidateId: number | null = null;
  applicationId: number | null = null;
  profile: any = null;
  application: any = null;
  interviews: any[] = [];
  isLoading = true;
  recruiterId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private applicationService: ApplicationService,
    private interviewService: InterviewService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
    }

    this.route.params.subscribe(params => {
      this.candidateId = +params['id'];
      this.route.queryParams.subscribe(qParams => {
        this.applicationId = qParams['applicationId'] ? +qParams['applicationId'] : null;
        this.loadAllData();
        this.trackProfileView();
      });
    });
  }

  loadAllData(): void {
    if (!this.candidateId) return;
    this.isLoading = true;

    // Load Profile
    this.http.get(`${environment.apiUrl}/profiles/candidate/${this.candidateId}`).subscribe({
      next: (profile: any) => {
        this.profile = profile;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.snackBar.open('Error loading candidate profile.', 'Close', { duration: 3000 });
        this.checkLoadingComplete();
      }
    });

    // Load Application if ID provided
    if (this.applicationId) {
      this.http.get(`${environment.apiUrl}/applications/${this.applicationId}`).subscribe({
        next: (app: any) => {
          this.application = app;
          this.checkLoadingComplete();
        },
        error: (err) => {
          console.error('Error loading application:', err);
          this.checkLoadingComplete();
        }
      });
    }

    // Load Interviews
    this.interviewService.getInterviewsByCandidate(this.candidateId).subscribe({
      next: (interviews) => {
        this.interviews = interviews;
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error loading interviews:', err);
        this.checkLoadingComplete();
      }
    });
  }

  private loadCount = 0;
  private checkLoadingComplete(): void {
    this.loadCount++;
    const targetCount = this.applicationId ? 3 : 2;
    if (this.loadCount >= targetCount) {
      this.isLoading = false;
    }
  }

  private trackProfileView(): void {
    if (!this.candidateId || !this.recruiterId) return;

    const user = this.authService.getCurrentUser();
    const viewerName = user ? (user.name || `${user.firstName} ${user.lastName}`) : 'A Recruiter';

    this.http.post(`${environment.apiUrl}/profiles/candidate/${this.candidateId}/view`, {}, {
      params: {
        viewerId: this.recruiterId.toString(),
        viewerName: viewerName
      }
    }).subscribe({
      next: () => console.log('Profile view tracked'),
      error: (err) => console.error('Error tracking profile view:', err)
    });
  }

  onStatusChange(newStatus: string): void {
    if (!this.applicationId || !this.recruiterId) return;

    this.applicationService.updateApplicationStatus(this.applicationId, newStatus, this.recruiterId).subscribe({
      next: (updated) => {
        this.application = updated;
        this.snackBar.open('Application status updated.', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
      }
    });
  }

  scheduleInterview(): void {
    this.router.navigate(['/recruiter/schedule-interview'], {
      queryParams: {
        applicationId: this.applicationId,
        candidateId: this.candidateId,
        candidateName: this.profile?.fullName,
        jobTitle: this.application?.jobTitle
      }
    });
  }

  downloadResume(): void {
    if (this.profile?.resumeUrl) {
      window.open(this.profile.resumeUrl, '_blank');
    }
  }

  goBack(): void {
    this.router.navigate(['/recruiter/applicants']);
  }
}
