import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recruiter-placeholder',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div style="padding: 24px; text-align: center;">
      <mat-card style="padding: 48px; border-radius: 12px;">
        <mat-icon style="font-size: 48px; width: 48px; height: 48px; color: #ccc; margin-bottom: 16px;">construction</mat-icon>
        <h2 style="font-size: 1.5rem; margin-bottom: 8px;">Page Under Construction</h2>
        <p style="color: #666;">We're working hard to bring you this feature soon!</p>
      </mat-card>
    </div>
  `
})
export class RecruiterPlaceholderComponent {}
