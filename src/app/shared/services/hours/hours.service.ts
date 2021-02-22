import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hour } from '../../models/hour.model';
import { HoursProvider } from './providers/hour-provider.model';
import { HoursIndexedDbProviderService } from './providers/hours-indexed-db-provider.service';
import { HoursFirebaseProviderService } from './providers/hours-indexed-firebase-provider.service';

@Injectable({
  providedIn: 'root',
})
export class HoursService implements OnDestroy {
  hours$: Observable<Hour[]>;
  private targetHourSubject: BehaviorSubject<Hour>;
  targetHour$: Observable<Hour>;
  provider: HoursProvider;
  subscription: Subscription;

  constructor(
    private hoursIndexedDB: HoursIndexedDbProviderService,
    private hoursFirestore: HoursFirebaseProviderService,
    private auth: AngularFireAuth
  ) {
    this.targetHourSubject = new BehaviorSubject<Hour>(environment.targetHour);
    this.targetHour$ = this.targetHourSubject.asObservable();

    this.subscription = new Subscription();
    this.subscription.add(
      this.auth.authState.subscribe((user) => {
        this.changeProvider(user != null);
      })
    );
    this.changeProvider(auth.currentUser != null);
  }

  private async changeProvider(authenticated: boolean) {
    this.provider = authenticated ? this.hoursFirestore : this.hoursIndexedDB;
    await this.updateTargetHour();
    this.hours$ = this.provider.hours$.pipe(
      tap((hours) => this.updateTargetHour(hours))
    );
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

  ngOnDestroy() {
    if (this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }
}
