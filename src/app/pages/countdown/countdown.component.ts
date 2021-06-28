import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import moment, { Moment } from 'moment';
import { from, merge, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TheHourComponentComponent } from '../../components/the-hour-component/the-hour-component.component';
import { Hour } from '../../shared/models/hour.model';
import { HoursService } from '../../shared/services/hours/hours.service';

@Component({
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnDestroy {
  private targetHour: Hour;
  target: Moment;
  diff = { hours: 0, minutes: 0, seconds: 0 };
  interval: number;
  TheHourComponentComponent = TheHourComponentComponent;
  private subscription: Subscription;
  isHourFacetVissible: boolean;
  isSkipButtonVisisble: boolean;

  constructor(private hourService: HoursService, public auth: AngularFireAuth) {
    this.subscription = new Subscription();
    this.subscription.add(
      merge(
        this.hourService.target$,
        this.auth.authState.pipe(
          concatMap(() => from(this.hourService.getTargetHour()))
        )
      ).subscribe((hour) => this.initializeTarget(hour))
    );
  }

  private async initializeTarget(targetHour: Hour) {
    this.isHourFacetVissible = false;
    this.targetHour = targetHour;
    this.updateTarget();
    this.updateDate();
    this.resetInterval();
  }

  private resetInterval() {
    if (!Number.isNaN(Number(this.interval))) {
      clearInterval(this.interval);
    }

    setTimeout(() => {
      this.interval = setInterval(() => this.updateDate(), 1000);
    }, 1000 - new Date().getMilliseconds());
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

  private async updateDate() {
    const current = moment();
    const hours = this.target.diff(current, 'hours');
    const minutes = this.target.diff(current, 'minutes') % 60;
    const seconds = this.target.diff(current, 'seconds') % 60;
    if (!this.isTargetHour()) {
      this.diff = { hours, minutes, seconds };
    } else if (!this.isHourFacetVissible) {
      this.isHourFacetVissible = true;
    }

    if (this.target.isBefore(current, 'minutes')) {
      this.showSkipButton();
    }
  }

  isTargetHour() {
    if (environment.alwaysShowFacet) {
      return true;
    }

    if (this.target == null) {
      return false;
    }

    const current = moment();
    return this.target.isSame(current, 'minute');
  }

  isTheHour() {
    return this.targetHour === environment.targetHour;
  }

  showSkipButton() {
    this.isSkipButtonVisisble = true;
  }

  async skipFacet() {
    this.isSkipButtonVisisble = false;
    await this.initializeTarget(await this.hourService.getTargetHour());
  }

  ngOnDestroy() {
    if (!Number.isNaN(Number(this.interval))) {
      clearInterval(this.interval);
    }
    if (this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }
}
