import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DryerShieldComponent } from './shields/dryer-shield/dryer-shield.component';
import { NightShieldComponent } from './shields/night-shield/night-shield.component';
import { RainShieldComponent } from './shields/rain-shield/rain-shield.component';

@Component({
  selector: 'app-the-hour-component',
  templateUrl: './the-hour-component.component.html',
  styleUrls: ['./the-hour-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheHourComponentComponent implements OnInit {
  ShieldComponents = [
    NightShieldComponent,
    RainShieldComponent,
    DryerShieldComponent,
  ];
  ShieldComponent = this.ShieldComponents[2];

  constructor() {}

  ngOnInit(): void {}
}
