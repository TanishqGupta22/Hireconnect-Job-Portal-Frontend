import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
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
    FormsModule
  ],
  template: `
    <div class="contact-page">
      <div class="hero-section">
        <div class="hero-content">
          <h1>Contact Us</h1>
          <p class="hero-subtitle">We're here to help you succeed</p>
          <p class="hero-description">
            Have questions about HireConnect? Need support with your job search or recruitment? 
            Our team is ready to assist you every step of the way.
          </p>
        </div>
      </div>

      <div class="contact-content">
        <div class="contact-form-section">
          <mat-card class="contact-form-card">
            <mat-card-header>
              <mat-card-title>Send us a Message</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <form class="contact-form">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>First Name</mat-label>
                    <input matInput placeholder="Enter your first name">
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Last Name</mat-label>
                    <input matInput placeholder="Enter your last name">
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" placeholder="your.email@example.com">
                    <mat-icon matSuffix>email</mat-icon>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Phone</mat-label>
                    <input matInput type="tel" placeholder="+1 (555) 123-4567">
                    <mat-icon matSuffix>phone</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="form-field">
                    <mat-label>Subject</mat-label>
                    <mat-select placeholder="Select a topic">
                      <mat-option value="general">General Inquiry</mat-option>
                      <mat-option value="support">Technical Support</mat-option>
                      <mat-option value="billing">Billing Question</mat-option>
                      <mat-option value="partnership">Partnership Opportunity</mat-option>
                      <mat-option value="feedback">Feedback</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="form-field full-width">
                  <mat-label>Message</mat-label>
                  <textarea matInput 
                            placeholder="Tell us how we can help you..." 
                            rows="6">
                  </textarea>
                </mat-form-field>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit">
                    <mat-icon>send</mat-icon>
                    Send Message
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="contact-info-section">
          <mat-card class="info-card">
            <mat-card-header>
              <mat-card-title>Get in Touch</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="contact-methods">
                <div class="contact-method">
                  <div class="method-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="method-info">
                    <h4>Email</h4>
                    <p>support&#64;hireconnect.com</p>
                    <p>sales&#64;hireconnect.com</p>
                  </div>
                </div>

                <div class="contact-method">
                  <div class="method-icon">
                    <i class="fas fa-phone"></i>
                  </div>
                  <div class="method-info">
                    <h4>Phone</h4>
                    <p>+1 (555) 123-4567</p>
                    <p>Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <div class="contact-method">
                  <div class="method-icon">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="method-info">
                    <h4>Office</h4>
                    <p>123 Tech Street</p>
                    <p>San Francisco, CA 94102</p>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="hours-card">
            <mat-card-header>
              <mat-card-title>Business Hours</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="hours-list">
                <div class="hours-item">
                  <span class="day">Monday - Friday</span>
                  <span class="time">9:00 AM - 6:00 PM EST</span>
                </div>
                <div class="hours-item">
                  <span class="day">Saturday</span>
                  <span class="time">10:00 AM - 4:00 PM EST</span>
                </div>
                <div class="hours-item">
                  <span class="day">Sunday</span>
                  <span class="time">Closed</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="social-card">
            <mat-card-header>
              <mat-card-title>Follow Us</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="social-links">
                <button mat-icon-button class="social-btn">
                  <mat-icon>facebook</mat-icon>
                </button>
                <button mat-icon-button class="social-btn">
                  <mat-icon>twitter</mat-icon>
                </button>
                <button mat-icon-button class="social-btn">
                  <mat-icon>linkedin</mat-icon>
                </button>
                <button mat-icon-button class="social-btn">
                  <mat-icon>instagram</mat-icon>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <div class="faq-section">
        <div class="section-content">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-grid">
            <mat-card class="faq-card">
              <mat-card-content>
                <h3>How do I create an account?</h3>
                <p>Click the "Sign Up" button in the top right corner and follow the registration process. It only takes a few minutes!</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="faq-card">
              <mat-card-content>
                <h3>How do I post a job?</h3>
                <p>Employers can post jobs by logging into their dashboard and clicking "Post New Job" in the quick actions menu.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="faq-card">
              <mat-card-content>
                <h3>Can I apply for multiple jobs?</h3>
                <p>Yes! You can apply for as many jobs as you'd like. We recommend applying to positions that match your skills and experience.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-page {
      max-width: var(--container-xl);
      margin: 0 auto;
      font-family: var(--font-family-primary);
    }

    .hero-section {
      background: var(--gradient-hero);
      color: white;
      padding: var(--spacing-3xl) var(--spacing-md);
      text-align: center;
      border-radius: 0 0 var(--border-radius-2xl) var(--border-radius-2xl);
    }

    .hero-content h1 {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--spacing-md);
      line-height: var(--line-height-tight);
    }

    .hero-subtitle {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
      opacity: 0.9;
      font-weight: var(--font-weight-medium);
    }

    .hero-description {
      font-size: var(--font-size-lg);
      max-width: 800px;
      margin: 0 auto;
      line-height: var(--line-height-relaxed);
      opacity: 0.8;
    }

    .contact-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-2xl);
      padding: var(--spacing-3xl) var(--spacing-md);
    }

    .contact-form-card {
      background: white;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-xl);
      border: none;
      overflow: hidden;
    }

    .contact-form-card mat-card-header {
      background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
      padding: var(--spacing-xl) var(--spacing-xl) var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid var(--neutral-100);
      text-align: center;
    }

    .contact-form-card mat-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--secondary-800);
      margin: 0;
    }

    .contact-form-card mat-card-content {
      padding: var(--spacing-xl);
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    .form-field {
      width: 100%;
    }

    .mat-mdc-form-field-flex {
      background-color: var(--neutral-50);
      border-radius: var(--border-radius-lg);
      border: 2px solid var(--neutral-200);
      transition: all var(--transition-normal);
      min-height: 56px;
    }

    .mat-mdc-form-field-flex:hover {
      border-color: var(--primary-300);
      background-color: white;
    }

    .mat-mdc-form-field-focus .mat-mdc-form-field-flex {
      border-color: var(--primary-500);
      background-color: white;
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }

    .mat-mdc-form-field-label {
      font-weight: var(--font-weight-medium);
      color: var(--secondary-600);
    }

    .mat-mdc-text-field-wrapper {
      padding: var(--spacing-sm) var(--spacing-md);
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: var(--spacing-md);
    }

    .form-actions button {
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      min-height: 48px;
      border-radius: var(--border-radius-lg);
      background: var(--primary-600);
      color: white;
      border: none;
      cursor: pointer;
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .form-actions button:hover {
      background: var(--primary-700);
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .contact-info-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .info-card,
    .hours-card,
    .social-card {
      background: white;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-card);
      border: none;
      overflow: hidden;
    }

    .info-card mat-card-header,
    .hours-card mat-card-header,
    .social-card mat-card-header {
      background: linear-gradient(135deg, var(--primary-50) 0%, white 100%);
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid var(--neutral-100);
    }

    .info-card mat-card-title,
    .hours-card mat-card-title,
    .social-card mat-card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--secondary-800);
      margin: 0;
    }

    .info-card mat-card-content,
    .hours-card mat-card-content,
    .social-card mat-card-content {
      padding: var(--spacing-lg) var(--spacing-xl);
    }

    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .contact-method {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .method-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--border-radius-full);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--font-size-xl);
      flex-shrink: 0;
    }

    .method-info h4 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--secondary-800);
      margin-bottom: var(--spacing-sm);
    }

    .method-info p {
      color: var(--secondary-600);
      margin: 0;
      line-height: var(--line-height-normal);
    }

    .hours-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .hours-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--neutral-200);
    }

    .hours-item:last-child {
      border-bottom: none;
    }

    .day {
      font-weight: var(--font-weight-medium);
      color: var(--secondary-800);
    }

    .time {
      color: var(--secondary-600);
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .social-btn {
      width: 48px;
      height: 48px;
      border-radius: var(--border-radius-full);
      background: var(--neutral-100);
      transition: all var(--transition-normal);
      border: 2px solid var(--neutral-200);
    }

    .social-btn:hover {
      background: var(--primary-600);
      border-color: var(--primary-600);
      color: white;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .faq-section {
      background: var(--neutral-50);
      padding: var(--spacing-3xl) var(--spacing-md);
    }

    .section-content {
      max-width: var(--container-xl);
      margin: 0 auto;
      text-align: center;
    }

    .section-content h2 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--secondary-800);
      margin-bottom: var(--spacing-2xl);
      line-height: var(--line-height-tight);
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
    }

    .faq-card {
      background: white;
      text-align: left;
      border-radius: var(--border-radius-xl);
      transition: all var(--transition-normal);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--neutral-100);
      overflow: hidden;
    }

    .faq-card mat-card-content {
      padding: var(--spacing-xl);
    }

    .faq-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .faq-card h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--secondary-800);
      margin-bottom: var(--spacing-md);
      line-height: var(--line-height-tight);
    }

    .faq-card p {
      color: var(--secondary-600);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: var(--spacing-2xl) var(--spacing-md);
        border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
      }

      .hero-content h1 {
        font-size: var(--font-size-3xl);
      }

      .hero-subtitle {
        font-size: var(--font-size-base);
      }

      .hero-description {
        font-size: var(--font-size-base);
      }

      .contact-content {
        grid-template-columns: 1fr;
        padding: var(--spacing-2xl) var(--spacing-md);
        gap: var(--spacing-lg);
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .section-content h2 {
        font-size: var(--font-size-2xl);
      }

      .faq-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .hero-content h1 {
        font-size: var(--font-size-2xl);
      }

      .contact-form-card mat-card-header,
      .info-card mat-card-header,
      .hours-card mat-card-header,
      .social-card mat-card-header,
      .contact-form-card mat-card-content,
      .info-card mat-card-content,
      .hours-card mat-card-content,
      .social-card mat-card-content {
        padding: var(--spacing-lg) var(--spacing-md);
      }
    }
  `]
})
export class ContactComponent {
  constructor() {}
}
