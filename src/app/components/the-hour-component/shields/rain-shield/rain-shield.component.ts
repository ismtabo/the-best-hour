import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Drop } from './drop.model';

@Component({
  selector: 'app-rain-shield',
  templateUrl: './rain-shield.component.html',
  styleUrls: ['./rain-shield.component.scss', './rain.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RainShieldComponent implements OnInit {
  drops: Drop[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.makeItRain();
  }

  makeItRain() {
    let increment = 0;
    const drops = [];

    while (increment < 100) {
      // couple random numbers to use for various randomizations
      // random number between 98 and 1
      const randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
      // random number between 5 and 2
      const randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
      // increment
      increment += randoFiver;

      drops.push({ randoHundo, randoFiver, increment });
    }

    this.drops = drops;
  }
}
