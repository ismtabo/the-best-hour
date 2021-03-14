import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { ApplicationUpdatesService } from 'src/app/shared/services/application-updates.service';
import { UserConfigService } from 'src/app/shared/services/user-config.service';

@Component({
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent {
  shields: Array<{ key: string; value: string }> = [
    {
      key: 'app.config.shields.night',
      value: 'night',
    },
    {
      key: 'app.config.shields.rain',
      value: 'rain',
    },
    {
      key: 'app.config.shields.dryer',
      value: 'dryer',
    },
  ];
  currentShield: { key: string; value: string };
  updateAvailable: Observable<boolean>;

  constructor(
    public auth: AngularFireAuth,
    private userConfig: UserConfigService,
    private updates: ApplicationUpdatesService
  ) {
    this.currentShield = this.shields.find(
      ({ value }) => value === this.userConfig.getShield()
    );
    this.updateAvailable = this.updates.updateAvailable$;
  }

  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.auth.signOut();
  }

  onShieldChange(shield: string) {
    this.currentShield = this.shields.find(({ value }) => value === shield);
    this.userConfig.setShield(shield);
  }

  updateApplication() {
    this.updates.updateApplication();
  }
}
