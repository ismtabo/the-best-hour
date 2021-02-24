import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { BehaviorSubject, EMPTY, from, Observable } from 'rxjs';
import { concatMap, concatMapTo, skip, tap } from 'rxjs/operators';
import { HoursProvider, IndexedDbHour } from './hour-provider.model';

@Injectable({
  providedIn: 'root',
})
export class HoursIndexedDbProviderService
  implements HoursProvider<IndexedDbHour> {
  private hoursSubject: BehaviorSubject<IndexedDbHour[]>;
  get hours$(): Observable<IndexedDbHour[]> {
    this.refreshHours();
    return this.hourS;
  }
  private hourS: Observable<IndexedDbHour[]>;

  constructor(private dbService: NgxIndexedDBService) {
    this.initialize();
  }

  private initialize() {
    this.hoursSubject = new BehaviorSubject<IndexedDbHour[]>(null);
    this.hourS = this.hoursSubject.asObservable().pipe(skip(1));
  }

  private async refreshHours() {
    const hours = await this.getHours();
    this.hoursSubject.next(hours);
  }

  getHours(): Promise<IndexedDbHour[]> {
    return this.dbService.getAll('hours').toPromise();
  }

  getHour(key: number): Promise<IndexedDbHour> {
    return this.dbService.getByKey('hours', key).toPromise();
  }

  addHour(hour: IndexedDbHour): Promise<IndexedDbHour> {
    return this.dbService
      .add('hours', hour)
      .pipe(
        tap(() => this.refreshHours()),
        concatMap((key) => from(this.getHour(key)))
      )
      .toPromise();
  }

  updateHour(hour: IndexedDbHour): Promise<IndexedDbHour> {
    return this.dbService
      .update('hours', hour)
      .pipe(
        tap((hours) => this.hoursSubject.next(hours)),
        concatMap(() => from(this.getHour(hour.id)))
      )
      .toPromise();
  }

  deleteHour(hour: IndexedDbHour): Promise<void> {
    return this.dbService
      .delete('hours', hour.id)
      .pipe(
        tap((hours) => this.hoursSubject.next(hours)),
        concatMapTo(EMPTY)
      )
      .toPromise();
  }
}
