import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService, Application as AppData } from '../../../core/services/application.service';
import { MatChipsModule } from '@angular/material/chips';

export interface Application {
  id: number;
  jobId: number;
  jobTitle?: string;
  companyName?: string;
  status: string;
  appliedAt: string;
  coverLetter?: string;
  expectedSalary?: string;
}

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatChipsModule
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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </span>
              My Applications
            </h1>
            <p class="text-slate-500 mt-2 text-lg font-medium ml-1">You have submitted {{ applications.length }} applications in total.</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              routerLink="/candidate/browse-jobs"
              class="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Browse More Jobs
            </button>
          </div>
        </header>

        <!-- Status Filters -->
        <div class="flex flex-wrap items-center gap-3 mb-10">
          <button 
            (click)="filterStatus('ALL')"
            [class]="activeFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'"
            class="px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-sm border border-slate-200"
          >
            All
          </button>
          <button 
            (click)="filterStatus('PENDING')"
            [class]="activeFilter === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'"
            class="px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-sm border border-slate-200"
          >
            Pending
          </button>
          <button 
            (click)="filterStatus('ACCEPTED')"
            [class]="activeFilter === 'ACCEPTED' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'"
            class="px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-sm border border-slate-200"
          >
            Accepted
          </button>
          <button 
            (click)="filterStatus('REJECTED')"
            [class]="activeFilter === 'REJECTED' ? 'bg-rose-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'"
            class="px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-sm border border-slate-200"
          >
            Rejected
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div *ngFor="let i of [1,2,3]" class="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm animate-pulse">
            <div class="w-14 h-14 bg-slate-100 rounded-2xl mb-6"></div>
            <div class="h-6 bg-slate-100 rounded-lg w-3/4 mb-3"></div>
            <div class="h-4 bg-slate-50 rounded-lg w-1/2 mb-8"></div>
            <div class="flex justify-between items-center pt-6 border-t border-slate-100">
              <div class="h-8 bg-slate-50 rounded-full w-24"></div>
              <div class="h-8 bg-slate-50 rounded-full w-24"></div>
            </div>
          </div>
        </div>

        <!-- Applications Grid -->
        <div *ngIf="!isLoading && filteredApplications.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            *ngFor="let app of filteredApplications" 
            class="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/20 hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            <!-- Status Ribbon/Badge -->
            <div class="absolute top-0 right-0 mt-6 mr-6">
              <span [class]="getStatusClass(app.status)" class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border">
                <span [class]="getStatusDotClass(app.status)" class="w-2 h-2 rounded-full mr-2"></span>
                {{ app.status }}
              </span>
            </div>

            <!-- Company Icon -->
            <div class="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
              <span class="text-2xl font-black uppercase">{{ (app.companyName && app.companyName.charAt(0)) || 'J' }}</span>
            </div>

            <!-- Job Info -->
            <div class="mb-8">
              <h3 class="text-2xl font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{{ app.jobTitle || 'Unknown Position' }}</h3>
              <p class="text-slate-500 font-bold flex items-center gap-2">
                {{ app.companyName || 'Unknown Company' }}
              </p>
            </div>

            <!-- Meta Info -->
            <div class="space-y-3 mb-8 pt-6 border-t border-slate-100">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-400 font-black uppercase tracking-widest">Applied On</span>
                <span class="text-slate-700 font-bold">{{ app.appliedAt | date:'mediumDate' }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-400 font-black uppercase tracking-widest">Expected Salary</span>
                <span class="text-slate-700 font-bold">{{ app.expectedSalary || 'Negotiable' }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-3">
              <button 
                [routerLink]="['/candidate/job-details', app.jobId]"
                class="flex-1 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all text-sm uppercase tracking-widest"
              >
                View Job
              </button>
              <button 
                (click)="withdrawApplication(app)"
                class="p-4 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                title="Withdraw Application"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && filteredApplications.length === 0" class="bg-white rounded-[3rem] p-20 border-2 border-dashed border-slate-200 text-center">
          <div class="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-3xl font-black text-slate-900 mb-4">No applications found</h3>
          <p class="text-slate-500 font-bold text-lg max-w-md mx-auto mb-10">You haven't submitted any applications matching this status. Time to discover your next big opportunity!</p>
          <button 
            routerLink="/candidate/browse-jobs"
            class="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            Start Applying
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = false;
  activeFilter = 'ALL';

  constructor(
    private applicationService: ApplicationService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    
    this.applicationService.getApplicationsByCandidate(user.id).subscribe({
      next: (applications) => {
        this.applications = (applications as any) || [];
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load applications.', 'Close', { duration: 5000 });
      }
    });
  }

  filterStatus(status: string): void {
    this.activeFilter = status;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'ALL') {
      this.filteredApplications = this.applications;
    } else {
      this.filteredApplications = this.applications.filter(app => app.status === this.activeFilter);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'REVIEWED': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'ACCEPTED': return 'bg-emerald-500 animate-pulse';
      case 'REJECTED': return 'bg-rose-500';
      case 'PENDING': return 'bg-amber-500 animate-pulse';
      case 'REVIEWED': return 'bg-indigo-500';
      default: return 'bg-slate-500';
    }
  }

  withdrawApplication(application: Application): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    if (confirm('Are you sure you want to withdraw this application?')) {
      this.applicationService.archiveApplication(application.id, user.id).subscribe({
        next: () => {
          this.snackBar.open('Application withdrawn successfully', 'Close', { duration: 3000 });
          this.loadApplications();
        },
        error: (error) => {
          this.snackBar.open('Failed to withdraw application.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
