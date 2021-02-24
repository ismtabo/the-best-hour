import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import * as moment from 'moment';
import { from, Observable, Subscription } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hour } from '../../models/hour.model';
import { HoursProvider } from './providers/hour-provider.model';
import { HoursIndexedDbProviderService } from './providers/hours-indexed-db-provider.service';
import { HoursFirebaseProviderService } from './providers/hours-indexed-firebase-provider.service';

@Injectable({
  providedIn: 'root',
})
export class HoursService implements OnDestroy {
  get hours$(): Observable<Hour[]> {
    return this.provider.hours$;
  }
  target$: Observable<Hour>;
  provider: HoursProvider;
  subscription: Subscription;

  constructor(
    private hoursIndexedDB: HoursIndexedDbProviderService,
    private hoursFirestore: HoursFirebaseProviderService,
    private auth: AngularFireAuth
  ) {
    this.provider = this.hoursIndexedDB;
    this.target$ = from(this.getTargetHour());
    this.subscription = new Subscription();
    this.subscription.add(
      this.auth.authState.subscribe((user) => {
        this.changeProvider(user);
      })
    );
    this.initializeProvider();
  }

  private async initializeProvider() {
    this.changeProvider(await this.auth.currentUser);
  }

  private async changeProvider(user: firebase.User) {
    this.provider =
      user?.uid != null ? this.hoursFirestore : this.hoursIndexedDB;
    this.target$ = this.hours$.pipe(
      concatMap(() => from(this.getTargetHour()))
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
    const hours = await this.getHours();

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

    return currentHours[0];
  }

  ngOnDestroy() {
    if (this.subscription instanceof Subscription) {
      this.subscription.unsubscribe();
    }
  }
}
