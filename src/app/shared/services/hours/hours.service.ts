import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hour } from '../../models/hour.model';
import { HoursProvider } from './providers/hour-provider.model';
import { HoursIndexedDbProviderService } from './providers/hours-indexed-db-provider.service';

@Injectable({
  providedIn: 'root',
})
export class HoursService {
  hours$: Observable<Hour[]>;
  private targetHourSubject: BehaviorSubject<Hour>;
  targetHour$: Observable<Hour>;
  provider: HoursProvider;

  constructor(
    private hoursIndexedDB: HoursIndexedDbProviderService,
    private auth: AngularFireAuth
  ) {
    this.provider = hoursIndexedDB;
    this.hours$ = this.provider.hours$.pipe(
      tap((hours) => this.updateTargetHour(hours))
    );

    this.targetHourSubject = new BehaviorSubject<Hour>(environment.targetHour);
    this.targetHour$ = this.targetHourSubject.asObservable();
  }

  getHours(): Promise<Hour[]> {
    return this.provider.getHours();
  }

  addHour(hour: Hour): Promise<Hour> {
    return this.provider.addHour(hour);
  }

  updateHour(hour: Hour): Promise<Hour> {
    return this.provider.updateHour(hour);
  }

  deleteHour(hour: Hour): Promise<void> {
    return this.provider.deleteHour(hour);
  }

  async getTargetHour(): Promise<Hour> {
    return this.targetHourSubject.getValue();
  }

  async updateTargetHour(hours?: Hour[]) {
    if (!Array.isArray(hours)) {
      hours = await this.getHours();
    }

    const current = moment();
    const currentHours = [environment.targetHour, ...hours];

    const diff = (hour: Hour) => {
      const time = moment().hour(hour.hour).minutes(hour.minutes).seconds(0);
      if (time.isBefore(current, 'minutes')) {
        time.add(1, 'days');
      }
      return time.diff(current, 'minutes');
    };

    currentHours.sort((a, b) => diff(a) - diff(b));

    this.targetHourSubject.next(currentHours[0]);
  }
}
