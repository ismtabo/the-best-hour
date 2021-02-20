import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { GuidedTour } from 'ngx-guided-tour';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TheHourComponentComponent } from '../../components/the-hour-component/the-hour-component.component';
import { Hour } from '../../shared/models/hour.model';
import { HoursService } from '../../shared/services/hours.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
})
export class CountdownComponent implements OnInit, OnDestroy {
  private targetHour: Hour;
  target: Moment;
  diff = { hours: 0, minutes: 0, seconds: 0 };
  interval: number;
  TheHourComponentComponent = TheHourComponentComponent;
  subscription: Subscription;
  public countdownTour: GuidedTour;

  constructor(
    private hourService: HoursService,
    private cd: ChangeDetectorRef
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.hourService.targetHour$.subscribe((hour) =>
        this.initializeTarget(hour)
      )
    );
  }

  private async initializeTarget(hour: Hour) {
    this.targetHour = hour;
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

  private async updateDate() {
    const current = moment();
    const hours = this.target.diff(current, 'hours');
    const minutes = this.target.diff(current, 'minutes') % 60;
    const seconds = this.target.diff(current, 'seconds') % 60;
    if (!this.isTargetHour()) {
      this.diff = { hours, minutes, seconds };
    }

    if (this.target.isBefore(current, 'minutes')) {
      this.targetHour = await this.hourService.getTargetHour();
      this.updateTarget();
    }

    this.cd.detectChanges();
  }

  isTargetHour() {
    if (this.target == null) {
      return false;
    }

    const current = moment();
    return this.target.isSame(current, 'minute');
  }

  isTheHour() {
    return this.targetHour === environment.targetHour;
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
