import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InterviewService, Interview } from '../../../core/services/interview.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-interviews',
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
    MatTooltipModule
  ],
  template: `
    <div class="min-h-screen bg-slate-50/50 pt-24 pb-12 px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-2">Interview Schedule</h1>
            <p class="text-slate-500 font-medium text-lg">Manage your interactions with top talent</p>
          </div>
          <div class="flex gap-4">
            <button mat-flat-button color="primary" routerLink="/recruiter/applicants" class="premium-btn">
              <mat-icon>add</mat-icon>
              Schedule New
            </button>
          </div>
        </header>

        <mat-progress-bar *ngIf="isLoading" mode="indeterminate" class="mb-8 rounded-full h-1.5"></mat-progress-bar>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10" *ngIf="!isLoading">
          
          <!-- Today's Focus -->
          <div class="lg:col-span-5 space-y-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                <mat-icon>today</mat-icon>
              </div>
              <h2 class="text-2xl font-black text-slate-900">Today's Sessions</h2>
            </div>

            <div class="space-y-4">
              <div *ngFor="let interview of todayInterviews" class="premium-card p-6 bg-white border border-slate-100 hover:border-indigo-200 transition-all group">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-indigo-600 border border-slate-100">
                      <span class="text-[10px] font-black uppercase opacity-50">{{ interview.scheduledAt | date:'HH:mm' }}</span>
                      <mat-icon class="text-xl">videocam</mat-icon>
                    </div>
                    <div>
                      <h3 class="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{{ interview.candidateName || 'Candidate' }}</h3>
                      <p class="text-slate-500 font-bold text-xs uppercase tracking-widest">{{ interview.jobTitle }}</p>
                      <div class="mt-3 flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <mat-icon class="text-[14px] w-auto h-auto">check_circle</mat-icon>
                          {{ interview.status }}
                        </span>
                        <span class="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <mat-icon class="text-[14px] w-auto h-auto">timer</mat-icon>
                          {{ interview.duration || 60 }} Min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button mat-flat-button color="primary" *ngIf="interview.meetingLink" (click)="joinMeeting(interview.meetingLink)" class="join-btn">
                      Join
                    </button>
                    <button mat-stroked-button (click)="viewProfile(interview.candidateId, interview.applicationId)" class="profile-btn">
                      Profile
                    </button>
                  </div>
                </div>
                
                <div class="mt-6 pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                   <div class="flex items-center gap-3 text-slate-500">
                      <mat-icon class="text-slate-300">person_outline</mat-icon>
                      <span class="text-xs font-bold">{{ interview.interviewerName || 'Me' }}</span>
                   </div>
                   <div class="flex items-center gap-3 text-slate-500">
                      <mat-icon class="text-slate-300">public</mat-icon>
                      <span class="text-xs font-bold">{{ interview.mode }}</span>
                   </div>
                </div>
              </div>

              <div *ngIf="todayInterviews.length === 0" class="py-16 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                <mat-icon class="text-slate-200 text-5xl mb-3">calendar_today</mat-icon>
                <p class="text-slate-400 font-bold">No interviews for today.</p>
              </div>
            </div>
          </div>

          <!-- Upcoming Timeline -->
          <div class="lg:col-span-7 space-y-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                <mat-icon>event_note</mat-icon>
              </div>
              <h2 class="text-2xl font-black text-slate-900">Upcoming Pipeline</h2>
            </div>

            <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div class="space-y-10">
                <div *ngFor="let interview of upcomingInterviews" class="relative pl-12 pb-10 last:pb-0">
                  <!-- Timeline connector -->
                  <div class="absolute left-4 top-2 bottom-0 w-0.5 bg-slate-100 last:hidden"></div>
                  <!-- Timeline dot -->
                  <div class="absolute left-0 top-2 w-8 h-8 rounded-full bg-white border-4 border-indigo-600 z-10"></div>
                  
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="space-y-2">
                      <div class="flex items-center gap-3">
                        <span class="text-indigo-600 font-black text-sm uppercase tracking-widest">{{ interview.scheduledAt | date:'EEE, MMM dd' }}</span>
                        <span class="text-slate-300">•</span>
                        <span class="text-slate-500 font-bold text-sm">{{ interview.scheduledAt | date:'shortTime' }}</span>
                      </div>
                      <h3 class="text-xl font-black text-slate-900">{{ interview.candidateName || 'Candidate' }}</h3>
                      <p class="text-slate-500 font-medium italic text-sm">{{ interview.jobTitle }}</p>
                      
                      <div class="flex items-center gap-6 mt-4">
                        <div class="flex items-center gap-2 text-slate-400">
                           <mat-icon class="text-[18px] w-auto h-auto">location_on</mat-icon>
                           <span class="text-xs font-bold">{{ interview.mode }} {{ interview.location ? ' - ' + interview.location : '' }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="flex gap-3">
                      <button mat-stroked-button (click)="viewProfile(interview.candidateId, interview.applicationId)" class="rounded-xl border-slate-200 text-slate-600 font-bold">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                <div *ngIf="upcomingInterviews.length === 0" class="text-center py-20">
                  <mat-icon class="text-slate-100 text-6xl mb-4">auto_stories</mat-icon>
                  <p class="text-slate-400 font-bold uppercase tracking-widest text-sm">Clear schedule ahead</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .premium-btn {
      border-radius: 1rem;
      padding: 0 2rem;
      height: 48px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.3);
    }
    .premium-card {
      border-radius: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .join-btn {
      border-radius: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 11px;
      height: 36px;
    }
    .profile-btn {
      border-radius: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 11px;
      height: 36px;
      border-color: #e2e8f0;
    }
  `]
})
export class InterviewsComponent implements OnInit {
  todayInterviews: Interview[] = [];
  upcomingInterviews: Interview[] = [];
  isLoading = false;
  recruiterId: number | null = null;

  constructor(
    private interviewService: InterviewService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.recruiterId = user.id;
      this.loadInterviews();
    }
  }

  loadInterviews(): void {
    if (!this.recruiterId) return;

    this.isLoading = true;
    this.interviewService.getInterviewsByRecruiter(this.recruiterId).subscribe({
      next: (data) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        this.todayInterviews = data.filter(i => {
          const scheduledAt = new Date(i.scheduledAt);
          return scheduledAt.getFullYear() === today.getFullYear() &&
                 scheduledAt.getMonth() === today.getMonth() &&
                 scheduledAt.getDate() === today.getDate();
        }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        this.upcomingInterviews = data.filter(i => {
          const scheduledAt = new Date(i.scheduledAt);
          // Future but not today
          return scheduledAt > now && !this.todayInterviews.some(todayI => todayI.id === i.id);
        }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading interviews:', err);
        this.isLoading = false;
      }
    });
  }

  joinMeeting(url: string): void {
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      window.open(`https://${url}`, '_blank');
    }
  }

  viewProfile(candidateId: number, applicationId: number): void {
    this.router.navigate(['/recruiter/candidate-profile', candidateId], {
      queryParams: { applicationId }
    });
  }
}

