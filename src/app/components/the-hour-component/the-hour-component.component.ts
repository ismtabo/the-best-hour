import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserConfigService } from 'src/app/shared/services/user-config.service';
import { DryerShieldComponent } from './shields/dryer-shield/dryer-shield.component';
import { FruitCakeShieldComponent } from './shields/fruit-cake-shield/fruit-cake-shield.component';
import { NightShieldComponent } from './shields/night-shield/night-shield.component';
import { RainShieldComponent } from './shields/rain-shield/rain-shield.component';
import { TaxiShieldComponent } from './shields/taxi-shield/taxi-shield.component';

@Component({
  selector: 'app-the-hour-component',
  templateUrl: './the-hour-component.component.html',
  styleUrls: ['./the-hour-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheHourComponentComponent implements OnInit {
  private shieldComponents = {
    night: NightShieldComponent,
    rain: RainShieldComponent,
    dryer: DryerShieldComponent,
    taxi: TaxiShieldComponent,
    fruit: FruitCakeShieldComponent,
  };
  shieldComponent;

  constructor(private userConfig: UserConfigService) {
    this.shieldComponent = this.shieldComponents[userConfig.getShield()];
  }

  ngOnInit(): void {}
}
