import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { SwUpdate } from '@angular/service-worker';
import { Observable, of } from 'rxjs';
import { filter, map, pluck } from 'rxjs/operators';
import { ApplicationUpdatesService } from 'src/app/shared/services/application-updates.service';

@Component({
  selector: 'app-profile-avatar',
  template: `
    <span
      class="user-badge"
      routerLink="/config"
      style="font-size: 2rem"
      severity="danger"
    >
      <span pBadge *ngIf="updateAvailable | async; else avatarTemplate">
        <ng-container *ngTemplateOutlet="avatarTemplate"></ng-container>
      </span>
      <ng-template #avatarTemplate>
        <span
          *ngIf="(photo | async) == null; else userBadge"
          class="mdi mdi-account-circle-outline"
        ></span>
        <ng-template #userBadge>
          <img [src]="photo | async" alt="user image" />
        </ng-template>
      </ng-template>
    </span>
  `,
  styles: [
    `
      .user-badge img {
        width: 1em;
        border-radius: 50%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileAvatarComponent {
  photo: Observable<string>;
  updateAvailable: Observable<boolean>;

  constructor(
    public auth: AngularFireAuth,
    private updates: ApplicationUpdatesService
  ) {
    this.photo = this.auth.user.pipe(
      filter((x) => x != null),
      pluck('photoURL')
    );
    this.updateAvailable = updates.updateAvailable$;
  }
}
