import { Injectable, OnDestroy } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, EMPTY, Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApplicationUpdatesService implements OnDestroy {
  private updateAvailable: BehaviorSubject<boolean>;
  updateAvailable$: Observable<boolean>;
  subscription: Subscription;

  constructor(private swUpdate: SwUpdate) {
    this.updateAvailable = new BehaviorSubject<boolean>(false);
    this.updateAvailable$ = this.updateAvailable.asObservable();

    if (this.swUpdate.isEnabled) {
      this.subscription = this.swUpdate.available
        .pipe(
          shareReplay(1),
          map(({ current, available }) => current.hash !== available.hash)
        )
        // tslint:disable-next-line: deprecation
        .subscribe((updateAvailable) => {
          this.updateAvailable.next(updateAvailable);
        });
    } else {
      this.subscription = EMPTY.subscribe();
    }
  }

  async updateApplication() {
    if (this.swUpdate.isEnabled) {
      await this.swUpdate.activateUpdate();
      document.location.reload();
    }
  }

  ngOnDestroy() {
    this.updateAvailable.complete();
    this.subscription.unsubscribe();
  }
}
