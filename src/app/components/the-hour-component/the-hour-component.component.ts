import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NightShieldComponent } from './shields/night-shield/night-shield.component';
import { RainShieldComponent } from './shields/rain-shield/rain-shield.component';

@Component({
  selector: 'app-the-hour-component',
  templateUrl: './the-hour-component.component.html',
  styleUrls: ['./the-hour-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheHourComponentComponent implements OnInit {
  ShieldComponents = [NightShieldComponent, RainShieldComponent];
  ShieldComponent = this.ShieldComponents[1];

  constructor() {}

  ngOnInit(): void {}
}
