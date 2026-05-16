import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <p>Chart placeholder - Line chart for {{ title }}</p>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      height: 400px;
      width: 100%;
    }
  `]
})
export class LineChartComponent {
  @Input() title: string = '';
  @Input() color: string = '#667eea';
  @Input() data: any = null;
}
