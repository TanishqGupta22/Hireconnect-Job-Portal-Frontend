import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApplicationService, Application } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-slate-50/50 pt-24 pb-12 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Page Header -->
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <span class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </span>
              Manage Applicants
            </h1>
            <p class="text-slate-500 mt-2 text-lg font-medium ml-1">
              {{ jobId ? 'Showing candidates for Job ID: #' + jobId : 'Reviewing all recent applications across your jobs' }}
            </p>
          </div>
          
          <div class="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div class="px-4 py-2 text-center border-r border-slate-100">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
              <p class="text-xl font-black text-slate-900">{{ applications.length }}</p>
            </div>
            <div class="px-4 py-2 text-center">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hired</p>
              <p class="text-xl font-black text-emerald-600">{{ getCountByStatus('HIRED') }}</p>
            </div>
          </div>
        </header>

        <!-- Applicants List -->
        <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/20 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100">
                  <th class="px-8 py-6 text-sm font-black text-slate-500 uppercase tracking-widest">Candidate Info</th>
                  <th class="px-8 py-6 text-sm font-black text-slate-500 uppercase tracking-widest">Applied For</th>
                  <th class="px-8 py-6 text-sm font-black text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th class="px-8 py-6 text-sm font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr *ngFor="let app of applications" class="group hover:bg-slate-50/30 transition-all duration-300">
                  <!-- Candidate Cell -->
                  <td class="px-8 py-8">
                    <div class="flex items-center gap-5">
                      <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-black text-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        {{ app.candidateName?.charAt(0) || 'C' }}
                      </div>
                      <div>
                        <h4 class="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {{ app.candidateName || 'Candidate #' + app.candidateId }}
                        </h4>
                        <p class="text-slate-400 font-bold text-sm">{{ app.candidateEmail || 'email not available' }}</p>
                        <p class="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1">Applied {{ app.appliedAt | date:'mediumDate' }}</p>
                      </div>
                    </div>
                  </td>

                  <!-- Job Title -->
                  <td class="px-8 py-8">
                    <span class="text-slate-600 font-black text-sm uppercase tracking-tight bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      {{ app.jobTitle }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="px-8 py-8 text-center">
                    <mat-form-field appearance="outline" class="status-minimal-select" [ngClass]="app.status.toLowerCase()">
                      <mat-select [value]="app.status" (selectionChange)="onStatusChange(app.id, $event.value)">
                        <mat-option value="APPLIED">Applied</mat-option>
                        <mat-option value="SHORTLISTED">Shortlisted</mat-option>
                        <mat-option value="INTERVIEW_SCHEDULED">Interview Scheduled</mat-option>
                        <mat-option value="REJECTED">Rejected</mat-option>
                        <mat-option value="HIRED">Hired</mat-option>
                      </mat-select>
                    </mat-form-field>
                  </td>

                  <!-- Actions -->
                  <td class="px-8 py-8">
                    <div class="flex items-center justify-end gap-2">
                      <button 
                        (click)="viewResume(app)"
                        class="px-5 py-2.5 bg-white text-slate-600 font-black rounded-xl border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 transition-all text-xs uppercase tracking-widest"
                      >
                        Resume
                      </button>
                      <button [matMenuTriggerFor]="moreMenu" class="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                        </svg>
                      </button>
                      <mat-menu #moreMenu="matMenu" class="premium-menu">
                        <button mat-menu-item>
                          <mat-icon>email</mat-icon>
                          <span>Send Message</span>
                        </button>
                        <button mat-menu-item (click)="scheduleInterview(app)">
                          <mat-icon>event</mat-icon>
                          <span>Schedule Interview</span>
                        </button>
                        <mat-divider></mat-divider>
                        <button mat-menu-item class="text-rose-600" (click)="archiveApplication(app.id)">
                          <mat-icon class="text-rose-600">archive</mat-icon>
                          <span>Archive</span>
                        </button>
                      </mat-menu>
                    </div>
                  </td>
                </tr>

                <!-- Empty State -->
                <tr *ngIf="!isLoading && applications.length === 0">
                  <td colspan="4" class="px-8 py-32 text-center">
                    <div class="flex flex-col items-center">
                      <div class="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <h3 class="text-2xl font-black text-slate-900">No applicants yet</h3>
                      <p class="text-slate-500 font-medium max-w-sm mx-auto mt-2">When candidates apply for your jobs, they will appear here with their profiles and resumes.</p>
                    </div>
                  </td>
                </tr>

                <!-- Loading Skeleton -->
                <tr *ngIf="isLoading">
                  <td colspan="4" class="px-8 py-20 text-center">
                    <div class="flex items-center justify-center gap-3">
                      <div class="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
                      <div class="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div class="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .status-minimal-select .mat-mdc-text-field-wrapper {
      background-color: transparent !important;
      border: none !important;
      padding: 0 !important;
    }
    :host ::ng-deep .status-minimal-select .mat-mdc-form-field-flex {
      padding: 0 !important;
    }
    :host ::ng-deep .status-minimal-select .mat-mdc-form-field-infix {
      padding: 0 !important;
      min-height: auto !important;
      width: auto !important;
    }
    :host ::ng-deep .status-minimal-select .mat-mdc-select-trigger {
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-width: 2px;
      border-style: solid;
    }
    
    .applied ::ng-deep .mat-mdc-select-trigger { background: #f0f9ff; color: #0369a1; border-color: #e0f2fe; }
    .reviewed ::ng-deep .mat-mdc-select-trigger { background: #f5f3ff; color: #6d28d9; border-color: #ede9fe; }
    .shortlisted ::ng-deep .mat-mdc-select-trigger { background: #ecfdf5; color: #047857; border-color: #d1fae5; }
    .rejected ::ng-deep .mat-mdc-select-trigger { background: #fff1f2; color: #be123c; border-color: #ffe4e6; }
    .hired ::ng-deep .mat-mdc-select-trigger { background: #f0fdf4; color: #15803d; border-color: #dcfce7; }
    .interview_scheduled ::ng-deep .mat-mdc-select-trigger { background: #fff7ed; color: #9a3412; border-color: #ffedd5; }
  `]
})
export class ApplicantsComponent implements OnInit {
  applications: any[] = [];
  isLoading = false;
  recruiterId: number | null = null;
  jobId: number | null = null;

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
      
      this.route.queryParams.subscribe(params => {
        this.jobId = params['jobId'] ? +params['jobId'] : null;
        this.loadApplications();
      });
    }
  }

  loadApplications(): void {
    if (!this.recruiterId) return;

    this.isLoading = true;
    
    const request = this.jobId 
      ? this.applicationService.getApplicationsByJob(this.jobId)
      : this.applicationService.getApplicationsByRecruiter(this.recruiterId);

    request.subscribe({
      next: (data) => {
        this.applications = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.isLoading = false;
        this.snackBar.open('Failed to load applications.', 'Close', { duration: 3000 });
      }
    });
  }

  getCountByStatus(status: string): number {
    return this.applications.filter(a => a.status === status).length;
  }

  onStatusChange(id: number, newStatus: string): void {
    if (!this.recruiterId) return;

    this.applicationService.updateApplicationStatus(id, newStatus, this.recruiterId).subscribe({
      next: () => {
        this.snackBar.open('Status updated successfully.', 'Close', { duration: 2000 });
        this.loadApplications(); 
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.snackBar.open('Failed to update status.', 'Close', { duration: 3000 });
      }
    });
  }

  viewResume(app: any): void {
    this.router.navigate(['/recruiter/candidate-profile', app.candidateId], { 
      queryParams: { applicationId: app.id } 
    });
  }

  archiveApplication(id: number): void {
    if (!this.recruiterId) return;

    if (confirm('Are you sure you want to archive this application?')) {
      this.applicationService.archiveApplication(id, this.recruiterId).subscribe({
        next: () => {
          this.snackBar.open('Application archived.', 'Close', { duration: 2000 });
          this.loadApplications();
        },
        error: (err) => {
          console.error('Error archiving application:', err);
          this.snackBar.open('Failed to archive application.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  scheduleInterview(app: any): void {
    this.router.navigate(['/recruiter/schedule-interview'], { 
      queryParams: { 
        applicationId: app.id,
        candidateId: app.candidateId,
        candidateName: app.candidateName,
        jobTitle: app.jobTitle
      } 
    });
  }
}
