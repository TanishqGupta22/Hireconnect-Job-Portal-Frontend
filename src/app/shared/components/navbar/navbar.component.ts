import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
    RouterLinkActive
  ],
  template: `
    <header class="navbar" [class.scrolled]="isScrolled">
      <div class="navbar-container">
        <!-- Logo/Brand -->
        <div class="navbar-brand" routerLink="/">
          <div class="brand-logo">
            <div class="brand-icon">
              <img src="assets/logo.png" alt="HireConnect Logo" class="logo-img">
            </div>
            <div class="brand-text">
              <div class="brand-title-wrapper">
                <span class="brand-name">HireConnect</span>
                <mat-icon class="brand-secondary-icon">verified</mat-icon>
              </div>
              <span class="brand-tagline">Find Your Dream Job</span>
            </div>
          </div>
        </div>
        
        <!-- Navigation Links -->
        <nav class="navbar-nav" [class.mobile-menu-open]="mobileMenuOpen">
          <div class="nav-overlay" (click)="closeMobileMenu()"></div>
          
          <div class="nav-menu">
            <!-- Close button for mobile -->
            <button class="mobile-close-btn" (click)="closeMobileMenu()">
              <mat-icon>close</mat-icon>
            </button>
            
            <!-- Navigation Items -->
            <div class="nav-items" *ngIf="!isRecruiter() && !isAdmin()">
              <a class="nav-link" routerLink="/" routerLinkActive="active" (click)="closeMobileMenu()">
                <mat-icon>home</mat-icon>
                <span>Home</span>
              </a>
              
              <a class="nav-link" routerLink="/browse-jobs" routerLinkActive="active" (click)="closeMobileMenu()">
                <mat-icon>search</mat-icon>
                <span>Browse Jobs</span>
              </a>
              
              <a class="nav-link" routerLink="/about" routerLinkActive="active" (click)="closeMobileMenu()">
                <mat-icon>info</mat-icon>
                <span>About</span>
              </a>
              
              <a class="nav-link" routerLink="/contact" routerLinkActive="active" (click)="closeMobileMenu()">
                <mat-icon>contact_support</mat-icon>
                <span>Contact</span>
              </a>
            </div>
            
            <!-- Auth Section -->
            <div class="nav-auth">
              <ng-container *ngIf="!isAuthenticated()">
                <button mat-button class="nav-btn nav-btn-secondary" routerLink="/auth/login" (click)="closeMobileMenu()">
                  <mat-icon>login</mat-icon>
                  Login
                </button>
                <button mat-raised-button class="nav-btn nav-btn-primary" routerLink="/auth/register" (click)="closeMobileMenu()">
                  <mat-icon>person_add</mat-icon>
                  Register
                </button>
              </ng-container>
              
              <ng-container *ngIf="isAuthenticated()">
                <div class="nav-actions">
                  <button mat-icon-button (click)="themeService.toggleTheme()" class="navbar-theme-toggle" [matTooltip]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
                    <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
                  </button>
                  <div class="user-menu">
                    <button mat-button class="nav-btn nav-btn-secondary user-profile-btn" [matMenuTriggerFor]="userMenu">
                      <div class="user-info">
                        <span class="user-name">{{ getCurrentUserName() }}</span>
                        <span class="user-role">{{ getUserRole() }}</span>
                      </div>
                      <mat-icon>arrow_drop_down</mat-icon>
                    </button>
                  </div>
                </div>
              </ng-container>
            </div>
          </div>
        </nav>
        
        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-toggle" (click)="toggleMobileMenu()">
          <mat-icon>menu</mat-icon>
        </button>
      </div>
      
      <!-- User Dropdown Menu -->
      <mat-menu #userMenu="matMenu" class="user-dropdown">
        <div class="dropdown-header">
          <div class="dropdown-user-info">
            <span class="dropdown-name">{{ getCurrentUserName() }}</span>
            <span class="dropdown-role">{{ getUserRole() }}</span>
          </div>
        </div>
        
        <mat-divider></mat-divider>
        
        <div class="dropdown-menu-items">
          <ng-container *ngIf="isCandidate()">
            <button mat-menu-item routerLink="/candidate/dashboard">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </button>
            <button mat-menu-item routerLink="/candidate/profile">
              <mat-icon>person</mat-icon>
              <span>My Profile</span>
            </button>
            <button mat-menu-item routerLink="/candidate/saved-jobs">
              <mat-icon>bookmark</mat-icon>
              <span>Saved Jobs</span>
            </button>
            <button mat-menu-item routerLink="/candidate/applied-jobs">
              <mat-icon>work</mat-icon>
              <span>Applied Jobs</span>
            </button>
            <button mat-menu-item routerLink="/candidate/interviews">
              <mat-icon>event</mat-icon>
              <span>Interviews</span>
            </button>
          </ng-container>
          
          <ng-container *ngIf="isRecruiter()">
            <button mat-menu-item routerLink="/recruiter/dashboard">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </button>
            <button mat-menu-item routerLink="/recruiter/company-profile">
              <mat-icon>business</mat-icon>
              <span>Company Profile</span>
            </button>
            <button mat-menu-item routerLink="/recruiter/post-job">
              <mat-icon>post_add</mat-icon>
              <span>Post Job</span>
            </button>
            <button mat-menu-item routerLink="/recruiter/my-jobs">
              <mat-icon>work</mat-icon>
              <span>My Jobs</span>
            </button>
            <button mat-menu-item routerLink="/recruiter/applicants">
              <mat-icon>people</mat-icon>
              <span>Applicants</span>
            </button>
            <button mat-menu-item routerLink="/recruiter/analytics">
              <mat-icon>analytics</mat-icon>
              <span>Analytics</span>
            </button>
          </ng-container>
          
          <ng-container *ngIf="isAdmin()">
            <button mat-menu-item (click)="navigateTo('/admin/dashboard')">
              <mat-icon>dashboard</mat-icon>
              <span>Admin Dashboard</span>
            </button>
            <button mat-menu-item (click)="navigateTo('/admin/analytics')">
              <mat-icon>analytics</mat-icon>
              <span>Analytics</span>
            </button>
            <button mat-menu-item (click)="navigateTo('/admin/users')">
              <mat-icon>people</mat-icon>
              <span>User Management</span>
            </button>
            <button mat-menu-item (click)="navigateTo('/admin/settings')">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
          </ng-container>
          
          <mat-divider></mat-divider>
          
          <button mat-menu-item (click)="logout()" class="logout-item">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </div>
      </mat-menu>
    </header>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1030;
      background: var(--bg-secondary);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border-color);
      transition: all 0.3s ease;
      height: 80px;
      color: var(--text-primary);
    }

    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      height: 70px;
    }

    .navbar-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* Brand Styles - Fixed Layout */
    .navbar-brand {
      display: flex;
      align-items: center;
      text-decoration: none;
      cursor: pointer;
      transition: transform 0.3s ease;
      min-width: fit-content;
    }

    .navbar-brand:hover {
      transform: scale(1.02);
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
      overflow: hidden;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .brand-title-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-secondary-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--primary-600);
      margin-top: 4px;
    }

    .brand-name {
      font-size: 1.65rem;
      font-weight: 900;
      color: var(--secondary-800);
      font-family: var(--font-family-secondary);
      line-height: 1;
      margin: 0;
      white-space: nowrap;
      letter-spacing: -0.03em;
    }

    .brand-tagline {
      font-size: 0.75rem;
      color: var(--secondary-600);
      font-weight: 500;
      line-height: 1;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Navigation Styles - Fixed Layout */
    .navbar-nav {
      position: relative;
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }

    .nav-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: -1;
    }

    .navbar-nav.mobile-menu-open .nav-overlay {
      opacity: 1;
      visibility: visible;
      z-index: 1039;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .nav-items {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 12px;
      text-decoration: none;
      color: var(--secondary-700);
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      position: relative;
      white-space: nowrap;
      min-width: 0;
    }

    .nav-link:hover {
      background: var(--primary-50);
      color: var(--primary-700);
      transform: translateY(-2px);
    }

    .nav-link.active {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    .nav-link .mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    /* Auth Section - Fixed Layout */
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 16px;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      transition: all 0.3s ease;
      text-transform: none;
      white-space: nowrap;
      min-height: 44px;
      min-width: fit-content;
    }

    .nav-btn .mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .nav-btn-secondary {
      background: transparent;
      color: var(--secondary-700);
      border: 2px solid var(--neutral-200);
    }

    .nav-btn-secondary:hover {
      background: var(--neutral-50);
      border-color: var(--primary-300);
      color: var(--primary-700);
      transform: translateY(-2px);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .navbar-theme-toggle {
      background: var(--primary-100) !important;
      color: var(--primary-700) !important;
      border: 1px solid var(--primary-200) !important;
      margin-right: 8px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .navbar-theme-toggle:hover {
      background: var(--primary-600) !important;
      color: white !important;
      transform: rotate(180deg) scale(1.1);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }

    .dark-theme .navbar-theme-toggle {
      background: #334155 !important;
      color: #fde047 !important; /* Yellow for sun icon in dark mode */
      border-color: #475569 !important;
    }

    .dark-theme .navbar-theme-toggle:hover {
      background: #475569 !important;
      color: white !important;
    }

    /* User Menu - Fixed Layout */
    .user-menu {
      position: relative;
    }

    .user-profile-btn {
      padding: 6px 16px !important;
      height: 48px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-width: 0;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--secondary-800);
      line-height: 1.1;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
    }

    .user-role {
      font-size: 0.7rem;
      color: var(--primary-600);
      font-weight: 800;
      line-height: 1;
      margin: 2px 0 0 0;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Mobile Menu Toggle */
    .mobile-menu-toggle {
      display: none;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--neutral-100);
      border: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mobile-menu-toggle:hover {
      background: var(--primary-100);
      color: var(--primary-700);
    }

    .mobile-menu-toggle .mat-icon {
      font-size: 24px;
    }

    .mobile-close-btn {
      display: none;
      position: absolute;
      top: 24px;
      right: 24px;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--neutral-100);
      border: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .mobile-close-btn:hover {
      background: var(--error-100);
      color: var(--error-700);
    }

    /* User Dropdown */
    .user-dropdown {
      margin-top: 8px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .dropdown-header {
      padding: 20px;
      background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .dropdown-avatar {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 28px;
    }

    .dropdown-user-info {
      display: flex;
      flex-direction: column;
    }

    .dropdown-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--secondary-800);
      line-height: 1.2;
    }

    .dropdown-role {
      font-size: 0.875rem;
      color: var(--secondary-600);
      font-weight: 500;
      line-height: 1;
    }

    .dropdown-menu-items {
      padding: 8px;
    }

    .dropdown-menu-items .mat-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: 8px;
      margin: 4px 0;
      transition: all 0.3s ease;
    }

    .dropdown-menu-items .mat-menu-item:hover {
      background: var(--primary-50);
      color: var(--primary-700);
    }

    .dropdown-menu-items .mat-menu-item .mat-icon {
      font-size: 20px;
    }

    .logout-item {
      color: var(--error-600) !important;
    }

    .logout-item:hover {
      background: var(--error-100) !important;
      color: var(--error-700) !important;
    }

    /* Responsive Design - Fixed Layout */
    @media (max-width: 1024px) {
      .navbar-container {
        padding: 0 16px;
      }

      .nav-menu {
        gap: 20px;
      }

      .nav-items {
        gap: 2px;
      }

      .nav-link {
        padding: 10px 12px;
        font-size: 0.8rem;
      }

      .nav-auth {
        gap: 8px;
        margin-left: 12px;
      }

      .nav-btn {
        padding: 10px 16px;
        font-size: 0.8rem;
      }

      .user-name,
      .user-role {
        max-width: 150px;
      }
    }

    @media (max-width: 768px) {
      .navbar {
        height: 70px;
      }

      .navbar.scrolled {
        height: 60px;
      }

      .navbar-container {
        padding: 0 12px;
      }

      .brand-tagline {
        display: none;
      }

      .brand-name {
        font-size: 1.25rem;
      }

      .brand-icon {
        width: 40px;
        height: 40px;
        font-size: 20px;
      }

      .mobile-menu-toggle {
        display: flex;
      }

      .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        max-width: 400px;
        height: 100vh;
        background: white;
        box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1);
        transition: right 0.3s ease;
        z-index: 1040;
        flex-direction: column;
        padding: 24px;
        gap: 0;
        overflow-y: auto;
      }

      .navbar-nav.mobile-menu-open .nav-menu {
        right: 0;
      }

      .mobile-close-btn {
        display: flex;
        position: sticky;
        top: 0;
        z-index: 1;
        background: white;
        margin-bottom: 16px;
      }

      .nav-items {
        flex-direction: column;
        gap: 4px;
        margin: 24px 0;
        width: 100%;
      }

      .nav-link {
        width: 100%;
        padding: 16px 20px;
        justify-content: flex-start;
        font-size: 1rem;
        border-radius: 8px;
      }

      .nav-auth {
        flex-direction: column;
        gap: 12px;
        width: 100%;
        margin-top: auto;
        margin-left: 0;
        padding-top: 24px;
        border-top: 1px solid var(--neutral-200);
      }

      .nav-btn {
        width: 100%;
        justify-content: center;
        padding: 16px 20px;
        font-size: 1rem;
        min-height: 48px;
      }

      .user-menu .nav-btn {
        justify-content: flex-start;
      }

      .user-info {
        align-items: flex-start;
        text-align: left;
      }

      .user-name,
      .user-role {
        max-width: 200px;
      }
    }

    @media (max-width: 480px) {
      .navbar {
        height: 60px;
      }

      .navbar.scrolled {
        height: 56px;
      }

      .navbar-container {
        padding: 0 8px;
      }

      .brand-name {
        font-size: 1.125rem;
      }

      .brand-icon {
        width: 36px;
        height: 36px;
        font-size: 18px;
      }

      .mobile-menu-toggle {
        width: 44px;
        height: 44px;
      }

      .nav-menu {
        padding: 20px;
        max-width: 100%;
      }

      .mobile-close-btn {
        width: 44px;
        height: 44px;
      }

      .nav-link {
        padding: 14px 16px;
        font-size: 0.95rem;
      }

      .nav-btn {
        padding: 14px 16px;
        font-size: 0.95rem;
        min-height: 44px;
      }

      .user-avatar {
        width: 36px;
        height: 36px;
      }

      .user-name,
      .user-role {
        max-width: 160px;
      }
    }
  `]
})
export class NavbarComponent {
  @Output() mobileMenuToggle = new EventEmitter<void>();
  
  isScrolled = false;
  mobileMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    public themeService: ThemeService
  ) {
    // Add scroll listener for navbar effect
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngOnInit(): void {
    // Check initial scroll position
    this.onScroll();
  }

  ngOnDestroy(): void {
    // Clean up scroll listener
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll.bind(this));
    }
  }

  onScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled = window.scrollY > 50;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.mobileMenuToggle.emit();
    
    // Prevent body scroll when menu is open
    if (typeof document !== 'undefined') {
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isCandidate(): boolean {
    return this.authService.isCandidate();
  }

  isRecruiter(): boolean {
    return this.authService.isRecruiter();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getCurrentUserName(): string {
    const user = this.authService['currentUserSubject']?.value;
    return user ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()) : '';
  }

  getUserRole(): string {
    if (this.isAdmin()) return 'Admin';
    if (this.isRecruiter()) return 'Recruiter';
    if (this.isCandidate()) return 'Candidate';
    return 'User';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.closeMobileMenu();
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
