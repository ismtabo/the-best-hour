import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hour } from '../../shared/models/hour.model';

@Injectable({
  providedIn: 'root',
})
export class HoursService {
  private hoursSubject: BehaviorSubject<Hour[]>;
  hours$: Observable<Hour[]>;
  private targetHourSubject: BehaviorSubject<Hour>;
  targetHour$: Observable<Hour>;

  constructor(private dbService: NgxIndexedDBService) {
    this.targetHourSubject = new BehaviorSubject<Hour>(environment.targetHour);
    this.targetHour$ = this.targetHourSubject.asObservable();

    this.hoursSubject = new BehaviorSubject<Hour[]>([]);
    this.hours$ = this.hoursSubject.asObservable().pipe(
      shareReplay(1),
      tap((hours) =>
        this.calculateTargetHour(hours).then((hour) =>
          this.targetHourSubject.next(hour)
        )
      )
    );

    this.refreshHours();
  }

  private refreshHours() {
    this.getHours()
      .toPromise()
      .then((hours) => this.hoursSubject.next(hours));
  }

  getHours(): Observable<Hour[]> {
    return this.dbService.getAll('hours').pipe(take(1));
  }

  async getTargetHour(): Promise<Hour> {
    return this.calculateTargetHour(await this.getHours().toPromise());
  }

  private async calculateTargetHour(hours: Hour[]): Promise<Hour> {
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

  async addHour(hour: Hour): Promise<number> {
    return this.dbService
      .add('hours', hour)
      .pipe(tap(() => this.refreshHours()))
      .toPromise();
  }

  async updateHour(hour: Hour) {
    return this.dbService
      .update('hours', hour)
      .pipe(tap((hours) => this.hoursSubject.next(hours)))
      .toPromise();
  }

  async deleteHour(hour: Hour) {
    return this.dbService
      .delete('hours', hour.id)
      .pipe(tap((hours) => this.hoursSubject.next(hours)))
      .toPromise();
  }
}
