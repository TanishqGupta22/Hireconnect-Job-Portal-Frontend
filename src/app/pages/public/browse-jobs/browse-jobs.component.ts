import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { JobService, Job } from '../../../core/services/job.service';
import { ProfileService } from '../../../core/services/profile.service';
import { ApplicationService } from '../../../core/services/application.service';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-browse-jobs',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './browse-jobs.component.html',
  styleUrls: ['./browse-jobs.component.css']
})
export class BrowseJobsComponent implements OnInit {
  searchQuery = '';
  selectedLocation = '';
  selectedJobType = '';
  selectedExperience = '';
  selectedSalary = '';
  locations = ['Remote', 'San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Bangalore', 'Singapore'];
  jobTypes = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'];
  experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  popularSkills = ['JavaScript', 'React', 'Python', 'Java', 'AWS', 'Docker', 'TypeScript', 'Node.js', 'Angular', 'Go', 'SQL'];
  
  selectedSkills: string[] = [];
  selectedRemote = '';
  sortBy = 'relevance';
  pageSize = 10;
  currentPage = 0;
  
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  appliedJobIds: Set<number> = new Set();
  isLoading = false;
  totalJobs = 0;
  alertsEnabled = false;
  isAlertsLoading = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private jobService: JobService,
    private profileService: ProfileService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    
    // Explicitly type the observables to avoid forkJoin type mismatch
    const tasks: Observable<any>[] = [
      this.jobService.getJobs(0, 100).pipe(catchError(() => of([] as Job[])))
    ];

    if (user && user.role === 'CANDIDATE') {
      tasks.push(this.applicationService.getApplicationsByCandidate(user.id).pipe(catchError(() => of([] as any[]))));
      tasks.push(this.profileService.getCandidateProfile(user.id).pipe(catchError(() => of(null))));
    }

    forkJoin(tasks).subscribe({
      next: (results: any[]) => {
        const jobs = results[0] as Job[];
        const applications = results.length > 1 ? results[1] as any[] : [];

        if (applications) {
          applications.forEach(app => this.appliedJobIds.add(app.jobId));
        }
        
        const candidateProfile = results.length > 2 ? results[2] : null;
        if (candidateProfile) {
          this.alertsEnabled = candidateProfile.jobAlertsEnabled || false;
        }
        
        this.jobs = jobs.map(job => ({
          ...job,
          company: 'Loading...',
          applied: this.appliedJobIds.has(job.id)
        }));
        
        this.totalJobs = this.jobs.length;
        this.filterJobs();
        this.fetchCompanyDetails();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
        this.isLoading = false;
        this.snackBar.open('Failed to load jobs. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }

  fetchCompanyDetails(): void {
    const recruiterIds = [...new Set(this.jobs.map(j => j.recruiterId))];
    recruiterIds.forEach(id => {
      this.profileService.getRecruiterProfile(id).subscribe({
        next: (profile) => {
          this.jobs.forEach(job => {
            if (job.recruiterId === id) {
              // Using bracket notation or casting to any to satisfy the compiler if needed, 
              // though companyLogo is in the interface.
              (job as any).company = profile.companyName;
              (job as any).companyLogo = profile.logoUrl;
            }
          });
          this.filterJobs();
        },
        error: (err) => console.error(`Error fetching profile for recruiter ${id}:`, err)
      });
    });
  }

  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const query = this.searchQuery.toLowerCase();
      const matchesSearch = !this.searchQuery || 
        job.title.toLowerCase().includes(query) ||
        (job.company && job.company.toLowerCase().includes(query)) ||
        (job.description && job.description.toLowerCase().includes(query));

      const matchesLocation = !this.selectedLocation || 
        (job.location && job.location.toLowerCase().includes(this.selectedLocation.toLowerCase()));

      const matchesType = !this.selectedJobType || job.type === this.selectedJobType;

      const matchesSkills = this.selectedSkills.length === 0 || 
        this.selectedSkills.some(skill => 
          (job.requirements && job.requirements.toLowerCase().includes(skill.toLowerCase())) ||
          job.title.toLowerCase().includes(skill.toLowerCase()) ||
          (job.skills && job.skills.some(s => s.toLowerCase() === skill.toLowerCase()))
        );
      
      let matchesExperience = true;
      if (this.selectedExperience && this.selectedExperience !== 'All Career Stages') {
        const expReq = (job as any).experienceRequired;
        const reqStr = (job.requirements || '').toLowerCase();
        
        if (this.selectedExperience === 'Entry Level') {
          matchesExperience = (expReq !== undefined && expReq <= 1) || reqStr.includes('entry') || reqStr.includes('0-1');
        } else if (this.selectedExperience === 'Mid Level') {
          matchesExperience = (expReq !== undefined && expReq > 1 && expReq <= 2) || reqStr.includes('mid') || reqStr.includes('1-2');
        } else if (this.selectedExperience === 'Senior Level') {
          matchesExperience = (expReq !== undefined && expReq > 2 && expReq <= 5) || reqStr.includes('senior') || reqStr.includes('2-5');
        } else if (this.selectedExperience === 'Executive') {
          matchesExperience = (expReq !== undefined && expReq > 5) || reqStr.includes('executive') || reqStr.includes('director') || reqStr.includes('5+');
        }
      }

      const matchesRemote = !this.selectedRemote || 
        (job.workMode && job.workMode.toLowerCase() === this.selectedRemote.toLowerCase()) ||
        ((job as any).isRemote && this.selectedRemote === 'remote') ||
        (job.location && job.location.toLowerCase().includes(this.selectedRemote.toLowerCase()));
      
      return matchesSearch && matchesLocation && matchesType && matchesSkills && matchesExperience && matchesRemote;
    });

    if (this.sortBy === 'date') {
      this.filteredJobs.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    } else {
      // Relevance sort: title matches search query first
      if (this.searchQuery) {
        this.filteredJobs.sort((a, b) => {
          const aTitleMatch = a.title.toLowerCase().includes(this.searchQuery.toLowerCase());
          const bTitleMatch = b.title.toLowerCase().includes(this.searchQuery.toLowerCase());
          if (aTitleMatch && !bTitleMatch) return -1;
          if (!aTitleMatch && bTitleMatch) return 1;
          return 0;
        });
      }
    }
    
    // Reset to first page on filter change
    this.currentPage = 0;
  }

  get paginatedJobs() {
    const start = this.currentPage * this.pageSize;
    return this.filteredJobs.slice(start, start + this.pageSize);
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  searchJobs(): void {
    this.filterJobs();
  }

  toggleSkill(skill: string): void {
    const idx = this.selectedSkills.indexOf(skill);
    if (idx > -1) this.selectedSkills.splice(idx, 1);
    else this.selectedSkills.push(skill);
    this.filterJobs();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedLocation = '';
    this.selectedJobType = '';
    this.selectedExperience = '';
    this.selectedSkills = [];
    this.selectedRemote = '';
    this.filterJobs();
  }

  applyForJob(job: Job): void {
    if (this.authService.getUserRole() === 'RECRUITER') {
      this.snackBar.open('Recruiters cannot apply for jobs', 'Close', { duration: 3000 });
      return;
    }
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.router.navigate(['/candidate/apply-job', job.id]);
  }

  viewJobDetails(job: Job): void {
    this.router.navigate(['/job-details', job.id]);
  }

  formatPostedTime(dateStr?: string | Date): string {
    if (!dateStr) return 'Recently';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const diff = new Date().getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return hours === 0 ? 'Just now' : `${hours}h ago`;
    }
    return days === 1 ? 'Yesterday' : `${days} days ago`;
  }

  toggleAlerts(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (user.role !== 'CANDIDATE') {
      this.snackBar.open('Job alerts are only available for candidates', 'Close', { duration: 3000 });
      return;
    }

    this.isAlertsLoading = true;
    const newState = !this.alertsEnabled;
    
    this.profileService.toggleJobAlerts(user.id, newState).subscribe({
      next: () => {
        this.alertsEnabled = newState;
        this.isAlertsLoading = false;
        this.snackBar.open(
          newState ? 'Job alerts enabled! We will notify you of new matching jobs.' : 'Job alerts disabled.', 
          'Close', 
          { duration: 3000 }
        );
      },
      error: (err) => {
        console.error('Error toggling alerts:', err);
        this.isAlertsLoading = false;
        this.snackBar.open('Failed to update job alerts. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
}

