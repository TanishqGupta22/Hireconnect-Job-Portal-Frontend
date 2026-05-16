import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="home-page">
      <!-- Premium Hero Section -->
      <section class="hero">
        <div class="hero-background">
          <div class="hero-pattern"></div>
        </div>
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <div class="hero-badge">
                <span class="badge badge-primary">🚀 Now Hiring</span>
                <span class="badge-text">Join 50,000+ professionals</span>
              </div>
              <h1 class="hero-title">
                Find Your <span class="text-gradient">Dream Job</span>
                <br>in Leading Companies
              </h1>
              <p class="hero-subtitle">
                Connect with top employers worldwide and accelerate your career journey with AI-powered job matching
              </p>
              
              <!-- Premium Search Bar -->
              <div class="search-container">
                <div class="search-wrapper">
                  <div class="search-field">
                    <mat-icon class="search-icon">search</mat-icon>
                    <input matInput placeholder="Job title, keywords, or company" [(ngModel)]="searchQuery" class="search-input">
                  </div>
                  
                  <div class="location-field">
                    <mat-icon class="location-icon">location_on</mat-icon>
                    <mat-select [(ngModel)]="selectedLocation" class="location-select" placeholder="All Locations">
                      <mat-option value="">All Locations</mat-option>
                      <mat-option value="remote">🌍 Remote</mat-option>
                      <mat-option value="bangalore">🏙️ Bangalore</mat-option>
                      <mat-option value="gurgaon">🏙️ Gurgaon</mat-option>
                      <mat-option value="mumbai">🏙️ Mumbai</mat-option>
                      <mat-option value="hyderabad">🏙️ Hyderabad</mat-option>
                      <mat-option value="lucknow">🏙️ Lucknow</mat-option>
                    </mat-select>
                  </div>
                  
                  <button mat-raised-button color="primary" class="search-btn" (click)="searchJobs()">
                    <mat-icon>search</mat-icon>
                    <span>Search Jobs</span>
                  </button>
                </div>
                
                <div class="search-suggestions">
                  <span class="suggestion-label">Popular searches:</span>
                  <button class="suggestion-chip" (click)="searchQuery = 'Software Engineer'; searchJobs()">Software Engineer</button>
                  <button class="suggestion-chip" (click)="searchQuery = 'Data Scientist'; searchJobs()">Data Scientist</button>
                  <button class="suggestion-chip" (click)="searchQuery = 'Product Manager'; searchJobs()">Product Manager</button>
                  <button class="suggestion-chip" (click)="searchQuery = 'UX Designer'; searchJobs()">UX Designer</button>
                </div>
              </div>
            </div>
            
            <div class="hero-visual">
              <div class="hero-image-container">
                <div class="hero-image-wrapper">
                  <img src="https://picsum.photos/seed/hireconnect-hero/600/400.jpg" alt="Career opportunities" class="hero-image">
                  <div class="hero-image-overlay"></div>
                </div>
                <div class="floating-cards">
                  <div class="floating-card card-1">
                    <div class="card-icon">💼</div>
                    <div class="card-text">50+ Jobs</div>
                  </div>
                  <div class="floating-card card-2">
                    <div class="card-icon">🏢</div>
                    <div class="card-text">100+ Companies</div>
                  </div>
                  <div class="floating-card card-3">
                    <div class="card-icon">⭐</div>
                    <div class="card-text">95% Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Premium Stats Section -->
      <section class="stats">
        <div class="container">
          <div class="stats-container">
            <div class="stat-item">
              <div class="stat-icon">
                <mat-icon>work</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">50+</div>
                <div class="stat-label">Active Jobs</div>
                <div class="stat-change positive">+12% this month</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <mat-icon>business</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">100+</div>
                <div class="stat-label">Companies</div>
                <div class="stat-change positive">+8% this month</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <mat-icon>people</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">100+</div>
                <div class="stat-label">Job Seekers</div>
                <div class="stat-change positive">+15% this month</div>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-icon">
                <mat-icon>trending_up</mat-icon>
              </div>
              <div class="stat-content">
                <div class="stat-number">95%</div>
                <div class="stat-label">Success Rate</div>
                <div class="stat-change positive">+2% this month</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Features Section -->
      <section class="features">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Why Choose <span class="text-gradient">HireConnect</span>?</h2>
            <p class="section-subtitle">Powerful features designed to accelerate your career growth</p>
          </div>
          
          <div class="features-grid">
            <mat-card class="feature-card card-hover">
              <mat-card-content>
                <div class="feature-illustration">
                  <img src="assets/images/smart_job_search_feature.png" alt="Smart Search Illustration">
                </div>
                <h3>Smart Job Search</h3>
                <p>Advanced AI-powered filters and personalized recommendations to find your perfect match</p>
                <div class="feature-features">
                  <span class="feature-tag">AI-Powered</span>
                  <span class="feature-tag">Smart Filters</span>
                </div>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="feature-card card-hover">
              <mat-card-content>
                <div class="feature-illustration">
                  <img src="assets/images/top_companies_feature.png" alt="Top Companies Illustration">
                </div>
                <h3>Top Companies</h3>
                <p>Connect with leading Fortune 500 companies and innovative startups worldwide</p>
                <div class="feature-features">
                  <span class="feature-tag">Fortune 500</span>
                  <span class="feature-tag">Startups</span>
                </div>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="feature-card card-hover">
              <mat-card-content>
                <div class="feature-illustration">
                  <img src="assets/images/one_click_apply_feature.png" alt="One-Click Apply Illustration">
                </div>
                <h3>One-Click Apply</h3>
                <p>Seamless application process with smart profile management and tracking</p>
                <div class="feature-features">
                  <span class="feature-tag">Fast Apply</span>
                  <span class="feature-tag">Profile Sync</span>
                </div>
              </mat-card-content>
            </mat-card>
            
            <mat-card class="feature-card card-hover">
              <mat-card-content>
                <div class="feature-illustration">
                  <img src="assets/images/career_analytics_feature.png" alt="Career Analytics Illustration">
                </div>
                <h3>Career Analytics</h3>
                <p>Track your progress with detailed insights and personalized career advice</p>
                <div class="feature-features">
                  <span class="feature-tag">Analytics</span>
                  <span class="feature-tag">Insights</span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- Trusted Companies Section -->
      <section class="trusted-companies">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Trusted by <span class="text-gradient">Leading Companies</span></h2>
            <p class="section-subtitle">Join thousands of companies finding their next great hire</p>
          </div>
          
          <div class="companies-showcase">
            <div class="companies-grid">
              <div class="company-item card-lift" *ngFor="let company of topCompanies">
                <div class="company-logo-wrapper">
                  <img [src]="'https://picsum.photos/seed/' + company.name.toLowerCase() + '/80/80.jpg'" 
                       [alt]="company.name" 
                       class="company-logo">
                </div>
                <div class="company-info">
                  <h4>{{ company.name }}</h4>
                  <div class="company-tags">
                    <span class="company-tag">Tech</span>
                    <span class="company-tag">Innovation</span>
                  </div>
                  <p class="company-about">{{ company.about }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Premium CTA Section -->
      <section class="cta">
        <div class="cta-background">
          <div class="cta-pattern"></div>
        </div>
        <div class="container">
          <div class="cta-content">
            <div class="cta-badge">
              <span class="badge badge-primary">🎯 Start Your Journey</span>
            </div>
            <h2 class="cta-title">
              Ready to Find Your <span class="text-gradient">Dream Job</span>?
            </h2>
            <p class="cta-subtitle">
              Join 50,000+ professionals who have already found their perfect match through HireConnect
            </p>
            <div class="cta-buttons">
              <button mat-raised-button color="primary" class="cta-primary" (click)="navigateToRegister()">
                <mat-icon>rocket_launch</mat-icon>
                Get Started Free
              </button>
              <button mat-button class="cta-secondary" (click)="navigateToBrowseJobs()">
                <mat-icon>search</mat-icon>
                Browse Jobs
              </button>
            </div>
            <div class="cta-stats">
              <div class="cta-stat">
                <div class="cta-stat-number">50K+</div>
                <div class="cta-stat-label">Active Users</div>
              </div>
              <div class="cta-stat">
                <div class="cta-stat-number">95%</div>
                <div class="cta-stat-label">Success Rate</div>
              </div>
              <div class="cta-stat">
                <div class="cta-stat-number">4.9⭐</div>
                <div class="cta-stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      background-color: var(--neutral-50);
    }

    /* Premium Hero Section - Fixed Layout */
    .hero {
      position: relative;
      padding: 120px 0 100px;
      overflow: hidden;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 50%, var(--secondary-900) 100%);
      min-height: 80vh;
      display: flex;
      align-items: center;
    }

    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.1;
      pointer-events: none;
    }

    .hero-pattern {
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      background-size: 200% 200%;
      animation: float 20s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      align-items: center;
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .hero-text {
      color: white;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      padding: 12px 20px;
      margin-bottom: 0;
      animation: slideUp 0.8s ease-out;
      align-self: flex-start;
    }

    .badge-text {
      font-size: 0.875rem;
      font-weight: 500;
      opacity: 0.9;
      line-height: 1.4;
      white-space: nowrap;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      margin: 0;
      font-family: var(--font-family-secondary);
      animation: slideUp 0.8s ease-out 0.2s both;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      margin: 0;
      opacity: 0.9;
      max-width: 500px;
      animation: slideUp 0.8s ease-out 0.4s both;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    /* Premium Search Bar - Fixed Layout */
    .search-container {
      animation: slideUp 0.8s ease-out 0.6s both;
      margin-top: 32px;
    }

    .search-wrapper {
      display: grid;
      grid-template-columns: 2fr 1fr auto;
      gap: 16px;
      background: white;
      border-radius: var(--border-radius-2xl);
      padding: 16px;
      box-shadow: var(--shadow-xl);
      min-height: 80px;
      align-items: center;
    }

    .search-field,
    .location-field {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: 0 var(--spacing-lg);
      border: 2px solid var(--neutral-200);
      border-radius: var(--border-radius-lg);
      background: white;
      min-height: 56px;
      transition: all var(--transition-normal);
    }

    .search-field:hover,
    .location-field:hover {
      border-color: var(--primary-300);
    }

    .search-field:focus-within,
    .location-field:focus-within {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }

    .location-field {
      display: flex;
      align-items: center;
    }

    .location-select {
      border: none;
      width: 100%;
      height: 100%;
      background: transparent;
      padding: 0;
      margin: 0;
    }

    .location-select ::ng-deep .mat-mdc-select-trigger {
      display: flex;
      align-items: center;
      height: 56px;
    }

    .search-icon,
    .location-icon {
      color: var(--secondary-600);
      font-size: var(--font-size-lg);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: var(--font-size-base);
      color: var(--secondary-800);
      line-height: var(--line-height-normal);
      padding: 0;
      margin: 0;
    }

    .search-input::placeholder {
      color: var(--secondary-400);
      opacity: 1;
    }

    .location-select {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: var(--font-size-base);
      color: var(--secondary-800);
      line-height: var(--line-height-normal);
      padding: 0;
      margin: 0;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
    }

    .location-select::placeholder {
      color: var(--secondary-400);
      opacity: 1;
      color: var(--primary-600);
    }

    .search-btn {
      min-height: 48px;
      padding: var(--spacing-md) var(--spacing-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      border: none;
      border-radius: var(--border-radius-lg);
      background: var(--primary-600);
      color: white;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-md);
      white-space: nowrap;
      min-width: 160px;
    }

    .search-btn:hover {
      background: var(--primary-700);
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }

    .search-suggestions {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .suggestion-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 500;
      white-space: nowrap;
    }

    .suggestion-chip {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .suggestion-chip:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Hero Visual - Fixed Layout */
    .hero-visual {
      position: relative;
      animation: slideUp 0.8s ease-out 0.8s both;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }

    .hero-image-container {
      position: relative;
      width: 100%;
      max-width: 500px;
      height: 400px;
    }

    .hero-image-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      pointer-events: none;
    }

    .floating-cards {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
    }

    .floating-card {
      position: absolute;
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 12px;
      animation: float 3s ease-in-out infinite;
      white-space: nowrap;
    }

    .floating-card.card-1 {
      top: 20px;
      right: -20px;
      animation-delay: 0s;
    }

    .floating-card.card-2 {
      bottom: 40px;
      right: 40px;
      animation-delay: 1s;
    }

    .floating-card.card-3 {
      top: 50%;
      left: -30px;
      animation-delay: 2s;
    }

    .card-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .card-text {
      font-weight: 600;
      color: var(--secondary-800);
      font-size: 0.875rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Premium Stats Section */
    .stats {
      padding: 80px 0;
      background: white;
      position: relative;
    }

    .stats::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neutral-200), transparent);
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 48px;
    }

    .stat-item {
      text-align: center;
      padding: 32px;
      border-radius: 16px;
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-8px);
      background: var(--neutral-50);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-700) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      color: white;
      font-size: 28px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--secondary-800);
      margin-bottom: 8px;
      font-family: var(--font-family-secondary);
    }

    .stat-label {
      font-size: 1.125rem;
      color: var(--secondary-600);
      font-weight: 500;
      margin-bottom: 8px;
    }

    .stat-change {
      font-size: 0.875rem;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      border-radius: 20px;
    }

    .stat-change.positive {
      color: var(--success-700);
      background: var(--success-100);
    }

    /* Enhanced Features Section */
    .features {
      padding: 100px 0;
      background: var(--neutral-50);
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--secondary-800);
      margin-bottom: 16px;
      font-family: var(--font-family-secondary);
    }

    .section-subtitle {
      font-size: 1.25rem;
      color: var(--secondary-600);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }

    .feature-card {
      padding: 40px;
      border-radius: 20px;
      border: 1px solid var(--neutral-200);
      background: white;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-500), var(--primary-700));
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .feature-card:hover::before {
      transform: scaleX(1);
    }

    .feature-illustration {
      width: 100%;
      height: 200px;
      margin-bottom: 32px;
      border-radius: 16px;
      overflow: hidden;
      background: var(--neutral-50);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .feature-illustration img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .feature-card:hover .feature-illustration {
      transform: scale(1.05) translateY(-8px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .feature-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--secondary-800);
      margin-bottom: 16px;
      font-family: var(--font-family-secondary);
    }

    .feature-card p {
      color: var(--secondary-600);
      line-height: 1.6;
      margin-bottom: 24px;
    }

    .feature-features {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .feature-tag {
      background: var(--primary-100);
      color: var(--primary-700);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    /* Trusted Companies Section */
    .trusted-companies {
      padding: 100px 0;
      background: white;
    }

    .companies-showcase {
      margin-top: 60px;
    }

    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .company-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      border: 1px solid var(--neutral-200);
      border-radius: 16px;
      background: white;
      transition: all 0.3s ease;
      position: relative;
    }

    .company-logo-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--neutral-200);
    }

    .company-logo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .company-info {
      flex: 1;
    }

    .company-info h4 {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--secondary-800);
      margin-bottom: 4px;
    }

    .company-info p {
      color: var(--secondary-600);
      font-size: 0.875rem;
      margin-bottom: 12px;
    }

    .company-tags {
      display: flex;
      gap: 8px;
    }

    .company-tag {
      background: var(--neutral-100);
      color: var(--secondary-700);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .company-about {
      margin-top: 12px;
      color: var(--secondary-600);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .company-action {
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Premium CTA Section */
    .cta {
      position: relative;
      padding: 120px 0;
      overflow: hidden;
      background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 50%, var(--secondary-900) 100%);
    }

    .cta-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.1;
    }

    .cta-pattern {
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      background-size: 200% 200%;
      animation: float 15s ease-in-out infinite reverse;
    }

    .cta-content {
      text-align: center;
      color: white;
      position: relative;
      z-index: 1;
    }

    .cta-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50px;
      padding: 8px 16px;
      margin-bottom: 32px;
    }

    .cta-title {
      font-size: 2.5rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 24px;
      font-family: var(--font-family-secondary);
    }

    .cta-subtitle {
      font-size: 1.25rem;
      line-height: 1.6;
      margin-bottom: 48px;
      opacity: 0.9;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 48px;
      flex-wrap: wrap;
    }

    .cta-primary {
      height: 56px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background: white;
      color: var(--primary-600);
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .cta-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .cta-secondary {
      height: 56px;
      padding: 0 32px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background: transparent;
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
    }

    .cta-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
      transform: translateY(-2px);
    }

    .cta-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }

    .cta-stat {
      text-align: center;
    }

    .cta-stat-number {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 8px;
      font-family: var(--font-family-secondary);
    }

    .cta-stat-label {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    /* Responsive Design - Fixed Layout */
    @media (max-width: 1024px) {
      .hero {
        padding: 100px 0 80px;
        min-height: 70vh;
      }

      .hero-content {
        grid-template-columns: 1fr;
        gap: 60px;
        text-align: center;
        max-width: 800px;
      }

      .hero-text {
        align-items: center;
        gap: 24px;
      }

      .hero-title {
        font-size: clamp(2rem, 4vw, 3rem);
      }

      .hero-subtitle {
        max-width: 600px;
        margin: 0 auto;
      }

      .search-wrapper {
        grid-template-columns: 1fr;
        gap: 16px;
        max-width: 600px;
        margin: 0 auto;
      }

      .hero-visual {
        order: 2;
      }

      .stats-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
      }

      .features-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      }

      .companies-grid {
        grid-template-columns: 1fr;
      }

      .cta-stats {
        gap: 32px;
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 80px 0 60px;
        min-height: 60vh;
      }

      .hero-content {
        padding: 0 16px;
        gap: 48px;
      }

      .hero-text {
        gap: 20px;
      }

      .hero-badge {
        padding: 10px 16px;
        font-size: 0.8rem;
      }

      .hero-title {
        font-size: clamp(1.75rem, 5vw, 2.5rem);
        line-height: 1.2;
      }

      .hero-subtitle {
        font-size: 1.125rem;
        line-height: 1.6;
        max-width: 100%;
      }

      .search-wrapper {
        padding: 12px;
        min-height: auto;
      }

      .search-btn {
        height: 48px;
        padding: 0 24px;
        font-size: 14px;
        min-width: 120px;
      }

      .search-suggestions {
        justify-content: center;
        margin-top: 16px;
      }

      .hero-visual {
        min-height: 300px;
      }

      .hero-image-container {
        height: 300px;
        max-width: 400px;
      }

      .floating-card.card-1,
      .floating-card.card-2,
      .floating-card.card-3 {
        display: none;
      }

      .stats-container {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .section-title {
        font-size: 2rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .cta-title {
        font-size: 2rem;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
        gap: 12px;
      }

      .cta-stats {
        gap: 24px;
        flex-direction: column;
      }

      .company-item {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .company-action {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .hero {
        padding: 60px 0 40px;
        min-height: 50vh;
      }

      .hero-content {
        padding: 0 12px;
        gap: 32px;
      }

      .hero-text {
        gap: 16px;
      }

      .hero-badge {
        padding: 8px 12px;
        font-size: 0.75rem;
      }

      .hero-title {
        font-size: clamp(1.5rem, 6vw, 2rem);
        line-height: 1.2;
      }

      .hero-subtitle {
        font-size: 1rem;
        line-height: 1.5;
      }

      .search-wrapper {
        padding: 8px;
        gap: 12px;
      }

      .search-btn {
        height: 44px;
        padding: 0 20px;
        font-size: 13px;
        min-width: 100px;
      }

      .suggestion-chip {
        padding: 6px 12px;
        font-size: 0.75rem;
      }

      .hero-visual {
        min-height: 250px;
      }

      .hero-image-container {
        height: 250px;
        max-width: 300px;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .cta-title {
        font-size: 1.75rem;
      }

      .stats-container {
        gap: 20px;
      }

      .features-grid {
        gap: 20px;
      }

      .companies-grid {
        gap: 16px;
      }
    }
  `]
})
export class HomeComponent {
  searchQuery = '';
  selectedLocation = '';

  topCompanies = [
    { name: 'Google', about: 'Global leader in search and cloud technology.' },
    { name: 'Microsoft', about: 'Driving innovation in productivity and cloud computing.' },
    { name: 'Amazon', about: 'Worlds largest e-commerce and cloud services provider.' },
    { name: 'Apple', about: 'Pioneering premium consumer electronics and software.' },
    { name: 'Meta', about: 'Building the future of social connection and VR.' },
    { name: 'Netflix', about: 'Leading global streaming entertainment service.' }
  ];

  constructor(private router: Router) {}

  searchJobs(): void {
    this.router.navigate(['/browse-jobs'], {
      queryParams: {
        q: this.searchQuery,
        location: this.selectedLocation
      }
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToBrowseJobs(): void {
    this.router.navigate(['/browse-jobs']);
  }
}
