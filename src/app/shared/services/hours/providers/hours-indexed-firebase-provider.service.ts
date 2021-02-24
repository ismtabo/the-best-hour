import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import { Hour } from 'src/app/shared/models/hour.model';
import { HoursProvider, FirebaseHour } from './hour-provider.model';

@Injectable({
  providedIn: 'root',
})
export class HoursFirebaseProviderService
  implements HoursProvider<FirebaseHour> {
  hours$: Observable<FirebaseHour[]>;
  private collection: AngularFirestoreCollection<FirebaseHour>;

  constructor(
    private firestores: AngularFirestore,
    private auth: AngularFireAuth
  ) {
    this.collection = this.firestores.collection<FirebaseHour>('hours');
    this.hours$ = this.auth.authState.pipe(
      filter((user) => user?.uid != null),
      concatMap((user) =>
        this.firestores
          .collection<FirebaseHour>('hours', (ref) =>
            ref.where('uid', '==', user.uid)
          )
          .snapshotChanges()
      ),
      map((hours) =>
        hours.map(({ payload: { doc: hourDocument } }) => ({
          id: hourDocument.id,
          ...hourDocument.data(),
        }))
      )
    );
  }

  async getHours(): Promise<FirebaseHour[]> {
    const { uid } = await this.auth.currentUser;
    const collection = await this.firestores
      .collection('hours', (ref) => ref.where('uid', '==', uid))
      .get()
      .toPromise();
    return collection.docs.map((doc) => doc.data() as FirebaseHour);
  }

  private getHourDocument(key: string) {
    return this.collection.doc(key.toString());
  }

  getHour(id: string): Promise<FirebaseHour> {
    const data = this.getHourDocument(id);
    return data
      .get()
      .pipe(map((doc) => doc.data()))
      .toPromise();
  }

  async addHour(hour: FirebaseHour): Promise<FirebaseHour> {
    const { uid } = await this.auth.currentUser;
    hour.uid = uid;
    const document = this.collection.add(hour);
    return document.then((d) => d.get()).then((d) => d.data());
  }

  updateHour(hour: FirebaseHour): Promise<FirebaseHour> {
    const document = this.getHourDocument(hour.id);
    return document.update(hour).then(() => this.getHour(hour.id));
  }

  deleteHour(hour: FirebaseHour): Promise<void> {
    const document = this.getHourDocument(hour.id);
    return document.delete();
  }
}
