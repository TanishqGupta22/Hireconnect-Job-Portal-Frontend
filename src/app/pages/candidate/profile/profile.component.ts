import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { ProfileService } from '../../../core/services/profile.service';

@Component({
  selector: 'app-profile',
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
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-slate-50/50 pb-20">
      <!-- Page Header -->
      <header class="bg-white border-b border-slate-200 px-6 py-8 mb-8 sticky top-0 z-10">
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </span>
              My Professional Profile
            </h1>
            <p class="text-slate-500 mt-1 text-lg font-medium">Manage your personal and professional identity on HireConnect.</p>
          </div>
          <div class="flex items-center gap-3">
            <button type="button" (click)="resetForm()" class="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Reset Changes
            </button>
            <button 
              type="button" 
              (click)="onSubmit()" 
              [disabled]="isLoading || profileForm.invalid"
              class="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:pointer-events-none"
            >
              <div *ngIf="isLoading" class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              {{ isLoading ? 'Saving...' : 'Save Profile' }}
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Left Column: Avatar & Summary -->
        <aside class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm sticky top-32">
            <div class="flex flex-col items-center text-center">
              <div class="relative group mb-6">
                <div class="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-slate-50 shadow-inner cursor-pointer" (click)="photoInput.click()">
                  <img [src]="profileImageUrl || 'assets/avatar-placeholder.png'" alt="Profile" class="w-full h-full object-cover">
                  <input #photoInput type="file" (change)="onFileSelected($event, 'photo')" accept="image/*" class="hidden">
                </div>
                <button class="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-all group-hover:scale-110">
                  <mat-icon class="text-sm">photo_camera</mat-icon>
                </button>
              </div>
              <h2 class="text-xl font-black text-slate-900 mb-1">{{ profileForm.get('firstName')?.value }} {{ profileForm.get('lastName')?.value }}</h2>
              <p class="text-indigo-600 font-bold text-sm uppercase tracking-widest mb-4">{{ profileForm.get('headline')?.value || 'New Candidate' }}</p>
              
              <div class="w-full pt-6 border-t border-slate-100 flex flex-col gap-3">
                <div class="flex items-center gap-3 text-slate-600">
                  <mat-icon class="text-slate-400">email</mat-icon>
                  <span class="text-sm font-medium">{{ profileForm.get('email')?.value }}</span>
                </div>
                <div class="flex items-center gap-3 text-slate-600">
                  <mat-icon class="text-slate-400">location_on</mat-icon>
                  <span class="text-sm font-medium">{{ profileForm.get('location')?.value || 'Location not set' }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Right Column: Form -->
        <div class="lg:col-span-8">
          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-8">
            
            <!-- Personal Information -->
            <section class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
              <div class="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <span class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">01</span>
                <div>
                  <h2 class="text-xl font-black text-slate-900">Personal Information</h2>
                  <p class="text-slate-500 font-medium text-sm">Your basic identification details.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                  <input 
                    formControlName="firstName"
                    type="text" 
                    placeholder="Enter first name" 
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                  >
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                  <input 
                    formControlName="lastName"
                    type="text" 
                    placeholder="Enter last name" 
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                  >
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contact Email</label>
                  <input 
                    formControlName="email"
                    type="email" 
                    readonly
                    class="w-full px-5 py-4 bg-slate-100 border-2 border-slate-200 rounded-2xl text-slate-500 font-bold cursor-not-allowed opacity-80"
                  >
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    formControlName="phone"
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                  >
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                  <input 
                    formControlName="location"
                    type="text" 
                    placeholder="e.g. London, UK" 
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 focus:bg-white transition-all"
                  >
                </div>
              </div>
            </section>

            <!-- Professional Information -->
            <section class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
              <div class="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <span class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">02</span>
                <div>
                  <h2 class="text-xl font-black text-slate-900">Professional Summary</h2>
                  <p class="text-slate-500 font-medium text-sm">Tell recruiters about your career path.</p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Headline</label>
                  <input 
                    formControlName="headline"
                    type="text" 
                    placeholder="e.g. Senior Full Stack Developer" 
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 focus:bg-white transition-all"
                  >
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Years of Experience</label>
                  <div class="relative">
                    <select 
                      formControlName="experience"
                      class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="0-1">0-1 years</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    <mat-icon class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</mat-icon>
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Short Bio</label>
                  <textarea 
                    formControlName="bio"
                    rows="4" 
                    placeholder="Write a brief professional summary about yourself..." 
                    class="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-medium leading-relaxed placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-600 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </section>

            <!-- Technical Skills -->
            <section class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
              <div class="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">03</span>
                <div>
                  <h2 class="text-xl font-black text-slate-900">Technical Skills</h2>
                  <p class="text-slate-500 font-medium text-sm">List the technologies you're expert in.</p>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Skills (Comma separated)</label>
                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">build</mat-icon>
                  <input 
                    formControlName="skills"
                    type="text" 
                    placeholder="e.g. JavaScript, Angular, Node.js, AWS, Python" 
                    class="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-amber-50 focus:border-amber-600 focus:bg-white transition-all"
                  >
                </div>
              </div>
            </section>

            <!-- Documents Section -->
            <section class="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
              <div class="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <span class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">04</span>
                <div>
                  <h2 class="text-xl font-black text-slate-900">Documents</h2>
                  <p class="text-slate-500 font-medium text-sm">Upload your resume and other credentials.</p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="space-y-2">
                  <label class="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Professional Resume (PDF)</label>
                  <div 
                    class="w-full p-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer group relative"
                    (click)="resumeInput.click()"
                  >
                    <input #resumeInput type="file" (change)="onFileSelected($event, 'resume')" accept=".pdf" class="hidden">
                    
                    <div class="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <mat-icon class="text-3xl">picture_as_pdf</mat-icon>
                    </div>
                    
                    <div class="text-center">
                      <p class="text-slate-900 font-black">{{ selectedResumeName || 'Click to upload resume' }}</p>
                      <p class="text-slate-500 text-sm font-medium">PDF format only, Max 5MB</p>
                    </div>

                    <div *ngIf="selectedResumeName" class="absolute top-4 right-4">
                      <mat-icon class="text-emerald-500">check_circle</mat-icon>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Final Save Action -->
            <div class="pt-4 flex justify-end">
              <button 
                type="submit" 
                [disabled]="isLoading || profileForm.invalid"
                class="inline-flex items-center justify-center px-12 py-5 bg-indigo-600 text-white font-black text-xl rounded-2xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50"
              >
                {{ isLoading ? 'Saving Changes...' : 'Save Everything' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: #f8fafc;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: any;

  isLoading = false;
  selectedResumeName: string | null = null;
  profileImageUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      location: [''],
      bio: [''],
      headline: [''],
      experience: [''],
      skills: [''],
      resumeUrl: [''],
      profileImageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    const user = this.authService.getCurrentUser();
    
    if (!user || !user.id) {
      this.isLoading = false;
      return;
    }

    this.profileService.getCandidateProfile(user.id).subscribe({
      next: (profile: any) => {
        this.profileForm.patchValue({
          firstName: profile.fullName?.split(' ')[0] || '',
          lastName: profile.fullName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          phone: profile.mobile || '',
          location: profile.address || '',
          bio: profile.bio || '',
          headline: profile.headline || '',
          experience: profile.experience && profile.experience.length > 0 ? profile.experience[0] : '0-1',
          skills: profile.skills?.join(', ') || '',
          resumeUrl: profile.resumeUrl || '',
          profileImageUrl: profile.profileImageUrl || ''
        });
        
        this.profileImageUrl = profile.profileImageUrl;
        if (profile.resumeUrl) {
          this.selectedResumeName = 'Current Resume.pdf';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
        if (err.status === 404) {
          // Fallback to Auth info if profile doesn't exist
          this.profileForm.patchValue({
            firstName: user.firstName || user.name?.split(' ')[0] || '',
            lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
            email: user.email
          });
        } else {
          this.snackBar.open(`Error loading profile data (${err.status})`, 'Close', { duration: 3000 });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !user.id) return;

    this.isLoading = true;

    const profileData = {
      userId: user.id,
      fullName: `${this.profileForm.value.firstName} ${this.profileForm.value.lastName}`,
      headline: this.profileForm.value.headline,
      mobile: this.profileForm.value.phone,
      skills: this.profileForm.value.skills ? this.profileForm.value.skills.split(',').map((s: string) => s.trim()) : [],
      experience: [this.profileForm.value.experience],
      resumeUrl: this.profileForm.value.resumeUrl,
      profileImageUrl: this.profileForm.value.profileImageUrl,
      address: this.profileForm.value.location,
      bio: this.profileForm.value.bio
    };

    console.log('Sending profile data:', profileData);

    this.profileService.getCandidateProfile(user.id).subscribe({
      next: () => {
        this.http.put(`${environment.apiUrl}/profiles/candidate/${user.id}`, profileData, {
          headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
        }).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
            this.loadProfile();
          },
          error: (err) => {
            console.error('Error updating profile:', err);
            this.isLoading = false;
            this.snackBar.open('Error updating profile', 'Close', { duration: 3000 });
          }
        });
      },
      error: (err) => {
        if (err.status === 404) {
          this.http.post(`${environment.apiUrl}/profiles/candidate`, profileData, {
            headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
          }).subscribe({
            next: () => {
              this.isLoading = false;
              this.snackBar.open('Profile created successfully!', 'Close', { duration: 3000 });
              this.loadProfile();
            },
            error: (postError) => {
              console.error('Profile creation failed:', postError);
              this.isLoading = false;
              this.snackBar.open(postError.error?.message || 'Failed to create profile', 'Close', { duration: 5000 });
            }
          });
        } else {
          this.isLoading = false;
          const errorMsg = err.error?.message || err.message || 'Internal server error occurred';
          this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        }
      }
    });
  }

  onFileSelected(event: any, type: 'photo' | 'resume'): void {
    const file = event.target.files[0];
    if (file) {
      if (type === 'photo') {
        const reader = new FileReader();
        reader.onload = () => {
          this.profileImageUrl = reader.result as string;
          this.profileForm.patchValue({ profileImageUrl: this.profileImageUrl });
        };
        reader.readAsDataURL(file);
      } else {
        this.selectedResumeName = file.name;
        // In a real app, you'd upload to S3/Cloudinary here
        // We'll simulate by setting a fake URL
        this.profileForm.patchValue({ resumeUrl: `https://storage.hireconnect.com/resumes/${file.name}` });
        this.snackBar.open(`Resume "${file.name}" selected`, 'OK', { duration: 2000 });
      }
    }
  }

  resetForm(): void {
    this.loadProfile();
  }

  calculateCompletion(profile: any): number {
    const fields = [
      profile.fullName,
      profile.mobile,
      profile.headline,
      profile.bio,
      profile.address,
      profile.resumeUrl,
      profile.profileImageUrl,
      profile.skills && profile.skills.length > 0,
      profile.experience && profile.experience.length > 0 && profile.experience[0]
    ];
    
    const filledFields = fields.filter(f => !!f).length;
    return Math.round((filledFields / fields.length) * 100);
  }
}
