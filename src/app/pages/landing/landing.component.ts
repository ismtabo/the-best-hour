import { Component, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnDestroy {
  private targetHour = { hour: 0, minutes: 13 };
  private target: Moment;
  diff: { hours: number; minutes: number; seconds: number };
  interval: number;

  constructor() {
    this.updateTarget();

    this.updateDate();
    this.interval = setInterval(() => this.updateDate(), 1000);
  }

  private updateTarget() {
    this.diff = { hours: 0, minutes: 0, seconds: 0 };
    this.target = moment()
      .hour(this.targetHour.hour)
      .minute(this.targetHour.minutes)
      .seconds(0);

    const current = moment();
    if (this.target.isBefore(current, 'minutes')) {
      this.target = this.target.add(1, 'day');
    }
  }

  private updateDate() {
    const current = moment();
    const hours = this.target.diff(current, 'hours');
    const minutes = this.target.diff(current, 'minutes') % 60;
    const seconds = this.target.diff(current, 'seconds') % 60;
    if (!this.isTargetHour()) {
      this.diff = { hours, minutes, seconds };
    }

    if (this.target.isBefore(current, 'minutes')) {
      this.updateTarget();
    }
  }

  isTargetHour() {
    const current = moment();
    return this.target.isSame(current, 'minute');
  }

  ngOnDestroy() {
    if (!Number.isNaN(Number(this.interval))) {
      clearInterval(this.interval);
    }
  }
}
