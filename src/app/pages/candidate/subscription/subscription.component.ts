import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SubscriptionService, SubscriptionResponse, SubscriptionPlan } from '../../../core/services/subscription.service';
import { AuthService } from '../../../core/services/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-candidate-subscription',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  template: `
    <div class="subscription-container">
      <div class="header-section">
        <h1 class="page-title">Candidate Premium</h1>
        <p class="page-subtitle">Unlock your career potential with advanced features</p>
      </div>

      <div class="current-status-card" *ngIf="currentSubscription">
        <div class="status-header">
          <div class="plan-badge">{{ currentSubscription.plan }}</div>
          <div class="status-indicator" [class.active]="currentSubscription.status === 'ACTIVE'">
            {{ currentSubscription.status }}
          </div>
        </div>
        <div class="usage-stats">
          <div class="stat-item">
            <span class="label">Job Applications Used</span>
            <span class="value">{{ currentSubscription.currentUsage }} / {{ currentSubscription.usageLimit === -1 ? '∞' : currentSubscription.usageLimit }}</span>
            <div class="progress-bar">
              <div class="progress" [style.width.%]="getUsagePercentage()"></div>
            </div>
          </div>
        </div>
        <div class="expiry-info">
          Valid until: {{ currentSubscription.endDate | date:'mediumDate' }}
        </div>
      </div>

      <div class="pricing-grid">
        <div class="pricing-card" *ngFor="let plan of plans" [class.featured]="plan.featured">
          <div class="plan-name">{{ plan.name }}</div>
          <div class="plan-price">
            <span class="currency">₹</span>
            <span class="amount">{{ plan.price }}</span>
            <span class="period">/mo</span>
          </div>
          <ul class="features">
            <li *ngFor="let feature of plan.features">
              <mat-icon>check</mat-icon>
              {{ feature }}
            </li>
          </ul>
          <button class="buy-button" (click)="initiatePayment(plan.type)" [disabled]="isCurrentPlan(plan.type) || isLoading">
            {{ isCurrentPlan(plan.type) ? 'Current Plan' : 'Get Started' }}
          </button>
        </div>
      </div>

      <div class="loading-overlay" *ngIf="isLoading">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>
    </div>
  `,
  styles: [`
    .subscription-container {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }

    .header-section {
      text-align: center;
      margin-bottom: 50px;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }

    .page-subtitle {
      color: #64748b;
      font-size: 1.1rem;
    }

    .current-status-card {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
      margin-bottom: 40px;
      border: 1px solid #e2e8f0;
    }

    .status-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .plan-badge {
      background: #ecfdf5;
      color: #10b981;
      padding: 6px 16px;
      border-radius: 99px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.8rem;
    }

    .status-indicator {
      font-size: 0.9rem;
      font-weight: 500;
      color: #94a3b8;
    }

    .status-indicator.active {
      color: #10b981;
    }

    .usage-stats .stat-item {
      margin-bottom: 15px;
    }

    .usage-stats .label {
      display: block;
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 8px;
    }

    .usage-stats .value {
      font-size: 1.2rem;
      font-weight: 700;
      color: #1e293b;
    }

    .progress-bar {
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }

    .progress {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .expiry-info {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-top: 15px;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
    }

    .pricing-card {
      background: white;
      border-radius: 24px;
      padding: 40px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .pricing-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }

    .pricing-card.featured {
      border: 2px solid #3b82f6;
      position: relative;
    }

    .pricing-card.featured::after {
      content: 'Most Popular';
      position: absolute;
      top: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: #3b82f6;
      color: white;
      padding: 4px 16px;
      border-radius: 99px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .plan-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 20px;
    }

    .plan-price {
      margin-bottom: 30px;
    }

    .plan-price .currency {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
    }

    .plan-price .amount {
      font-size: 3rem;
      font-weight: 800;
      color: #1e293b;
    }

    .plan-price .period {
      color: #64748b;
    }

    .features {
      list-style: none;
      padding: 0;
      margin: 0 0 40px 0;
      flex-grow: 1;
    }

    .features li {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #475569;
      margin-bottom: 12px;
      font-size: 0.95rem;
    }

    .features li mat-icon {
      color: #10b981;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .buy-button {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      background: #f1f5f9;
      color: #1e293b;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pricing-card.featured .buy-button {
      background: #3b82f6;
      color: white;
    }

    .buy-button:hover:not(:disabled) {
      background: #e2e8f0;
      transform: scale(1.02);
    }

    .pricing-card.featured .buy-button:hover:not(:disabled) {
      background: #2563eb;
    }

    .buy-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
    }
  `]
})
export class CandidateSubscriptionComponent implements OnInit {
  currentSubscription: SubscriptionResponse | null = null;
  isLoading = false;
  userId: number | null = null;

  plans = [
    {
      type: SubscriptionPlan.FREE,
      name: 'Free',
      price: 0,
      features: ['10 Job Applications', 'Standard Profile', 'Basic Job Alerts'],
      featured: false
    },
    {
      type: SubscriptionPlan.BASIC,
      name: 'Basic',
      price: 49,
      features: ['20 Job Applications', 'Profile Spotlight', 'Advanced Job Filters', 'Email Alerts'],
      featured: false
    },
    {
      type: SubscriptionPlan.PRO,
      name: 'Pro',
      price: 99,
      features: ['50 Job Applications', 'Featured Profile', 'Direct Recruiter Messaging', 'Skill Assessment Tests'],
      featured: true
    },
    {
      type: SubscriptionPlan.PREMIUM,
      name: 'Premium',
      price: 199,
      features: ['Unlimited Job Applications', 'Dedicated Career Coach', 'Resume Builder Pro', 'Priority Application Review'],
      featured: false
    }
  ];

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.loadCurrentSubscription();
    }
  }

  loadCurrentSubscription(): void {
    if (!this.userId) return;
    this.isLoading = true;
    this.subscriptionService.getCurrentSubscription(this.userId, 'CANDIDATE').subscribe({
      next: (sub) => {
        this.currentSubscription = sub;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading subscription:', err);
        this.isLoading = false;
      }
    });
  }

  getUsagePercentage(): number {
    if (!this.currentSubscription || this.currentSubscription.usageLimit === -1) return 0;
    return (this.currentSubscription.currentUsage / this.currentSubscription.usageLimit) * 100;
  }

  isCurrentPlan(planType: SubscriptionPlan): boolean {
    return this.currentSubscription?.plan === planType;
  }

  initiatePayment(plan: SubscriptionPlan): void {
    if (!this.userId) {
      this.snackBar.open('Please login to subscribe', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    this.subscriptionService.initiateSubscription(this.userId, 'CANDIDATE', plan).subscribe({
      next: (response) => {
        if (response === 'FREE_PLAN') {
          this.activateFreePlan(plan);
        } else {
          this.openRazorpay(response, plan);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const errMsg = err.error || 'Failed to initiate payment. Please try again.';
        this.snackBar.open(errMsg, 'Close', { duration: 5000 });
      }
    });
  }

  activateFreePlan(plan: SubscriptionPlan): void {
    const request = {
      userId: this.userId,
      userRole: 'CANDIDATE',
      plan: plan,
      razorpayOrderId: 'FREE',
      razorpayPaymentId: 'FREE',
      razorpaySignature: 'FREE'
    };
    // For FREE plan, we need a special backend handling or we can skip verification
    // But since completeSubscription verifies signature, we should handle it in backend
    this.subscriptionService.completeSubscription(request).subscribe({
      next: (sub) => {
        this.currentSubscription = sub;
        this.isLoading = false;
        this.snackBar.open('Free plan activated successfully!', 'Close', { duration: 5000 });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Failed to activate free plan.', 'Close', { duration: 5000 });
      }
    });
  }

  openRazorpay(orderId: string, plan: SubscriptionPlan): void {
    const options = {
      key: 'rzp_live_Slehh7RyO9XnHC',
      amount: this.plans.find(p => p.type === plan)?.price! * 100,
      currency: 'INR',
      name: 'HireConnect',
      description: `Upgrade to ${plan} Plan`,
      order_id: orderId,
      handler: (response: any) => {
        this.ngZone.run(() => {
          this.verifyPayment(response, plan);
        });
      },
      prefill: {
        name: this.authService.getCurrentUser()?.firstName || '',
        email: this.authService.getCurrentUser()?.email || ''
      },
      theme: {
        color: '#10b981'
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
    this.isLoading = false;
  }

  verifyPayment(response: any, plan: SubscriptionPlan): void {
    this.isLoading = true;
    const request = {
      userId: this.userId,
      userRole: 'CANDIDATE',
      plan: plan,
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    };

    this.subscriptionService.completeSubscription(request).subscribe({
      next: (sub) => {
        this.currentSubscription = sub;
        this.isLoading = false;
        this.snackBar.open('Subscription upgraded successfully!', 'Close', { duration: 5000 });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Payment verification failed. Please contact support.', 'Close', { duration: 5000 });
      }
    });
  }
}
