import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-flipdown-hour',
  templateUrl: './flipdown-hour.component.html',
  styleUrls: ['./flipdown-hour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlipdownHourComponent {
  @Input()
  hour: { hours: number; minutes: number; seconds: number };
}
