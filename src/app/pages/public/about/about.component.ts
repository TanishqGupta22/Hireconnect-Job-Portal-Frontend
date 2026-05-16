import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="about-page">
      <div class="hero-section">
        <div class="hero-content">
          <h1>About HireConnect</h1>
          <p class="hero-subtitle">Connecting talent with opportunity since 2020</p>
          <p class="hero-description">
            We're on a mission to make the hiring process simpler, faster, and more effective for everyone involved. 
            Whether you're a job seeker looking for your dream role or a recruiter searching for the perfect candidate, 
            HireConnect is here to help you succeed.
          </p>
        </div>
      </div>

      <div class="mission-section">
        <div class="section-content">
          <h2>Our Mission</h2>
          <p>
            To revolutionize the hiring industry by creating a platform that truly understands the needs of both 
            job seekers and employers. We believe that the right job can change lives, and the right talent can transform businesses.
          </p>
        </div>
      </div>

      <div class="values-section">
        <div class="section-content">
          <h2>Our Values</h2>
          <div class="values-grid">
            <mat-card class="value-card">
              <mat-card-content>
                <div class="value-icon">
                  <i class="fas fa-users"></i>
                </div>
                <h3>People First</h3>
                <p>We put people at the center of everything we do, creating meaningful connections that last.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="value-card">
              <mat-card-content>
                <div class="value-icon">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <h3>Innovation</h3>
                <p>We constantly push boundaries and explore new ways to improve the hiring experience.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="value-card">
              <mat-card-content>
                <div class="value-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <h3>Trust & Security</h3>
                <p>We prioritize the privacy and security of our users' data above all else.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="value-card">
              <mat-card-content>
                <div class="value-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <h3>Growth</h3>
                <p>We're committed to helping professionals and companies grow together.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="section-content">
          <h2>By the Numbers</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-number">1M+</div>
              <div class="stat-label">Active Job Seekers</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Partner Companies</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500K+</div>
              <div class="stat-label">Jobs Posted</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">2M+</div>
              <div class="stat-label">Successful Placements</div>
            </div>
          </div>
        </div>
      </div>


      <div class="cta-section">
        <div class="section-content">
          <h2>Ready to Join Us?</h2>
          <p>Whether you're looking for your next career move or seeking top talent, we're here to help.</p>
          <div class="cta-buttons">
            <button mat-raised-button color="primary" class="cta-btn">
              <mat-icon>work</mat-icon>
              Find Jobs
            </button>
            <button mat-raised-button color="accent" class="cta-btn">
              <mat-icon>business</mat-icon>
              Post Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 24px;
      text-align: center;
      border-radius: 0 0 50px 50px;
    }

    .hero-content h1 {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 16px;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 24px;
      opacity: 0.9;
    }

    .hero-description {
      font-size: 1.125rem;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
      opacity: 0.8;
    }

    .section-content {
      padding: 80px 24px;
      text-align: center;
    }

    .section-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #212529;
      margin-bottom: 24px;
    }

    .section-content p {
      font-size: 1.125rem;
      color: #6c757d;
      max-width: 800px;
      margin: 0 auto 48px;
      line-height: 1.6;
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 48px;
    }

    .value-card {
      text-align: center;
      padding: 32px;
      border-radius: 12px;
      transition: transform 0.3s ease;
      border: none;
    }

    .value-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
    }

    .value-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      color: white;
      font-size: 2rem;
    }

    .value-card h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin-bottom: 16px;
    }

    .value-card p {
      color: #6c757d;
      line-height: 1.6;
      margin: 0;
    }

    .stats-section {
      background: #f8f9fa;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
      margin-bottom: 48px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      font-size: 3rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 1.125rem;
      color: #6c757d;
      font-weight: 500;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
      margin-bottom: 48px;
    }

    .team-member {
      text-align: center;
    }

    .member-photo {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 24px;
      border: 4px solid #667eea;
    }

    .member-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .team-member h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin-bottom: 8px;
    }

    .member-title {
      font-size: 1.125rem;
      color: #667eea;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .member-bio {
      color: #6c757d;
      line-height: 1.6;
      margin: 0;
    }

    .cta-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 50px 50px 0 0;
    }

    .cta-section h2 {
      color: white;
    }

    .cta-section p {
      color: white;
      opacity: 0.9;
    }

    .cta-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .cta-btn {
      padding: 16px 32px;
      font-size: 1.125rem;
      font-weight: 600;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 60px 16px;
        border-radius: 0 0 30px 30px;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .hero-description {
        font-size: 1rem;
      }

      .section-content {
        padding: 60px 16px;
      }

      .section-content h2 {
        font-size: 2rem;
      }

      .section-content p {
        font-size: 1rem;
      }

      .values-grid,
      .team-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
      }

      .stat-number {
        font-size: 2rem;
      }

      .member-photo {
        width: 150px;
        height: 150px;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .cta-btn {
        width: 200px;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent {
  constructor() {}
}
