import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Hour } from 'src/app/shared/models/hour.model';
import { HoursProvider, FirebaseHour } from './hour-provider.model';

@Injectable({
  providedIn: 'root',
})
export class HoursFirebaseProviderService
  implements HoursProvider<FirebaseHour> {
  hours$: Observable<FirebaseHour[]>;
  private collection: AngularFirestoreCollection<FirebaseHour>;

  constructor(private firestores: AngularFirestore) {
    this.collection = this.firestores.collection<FirebaseHour>('hours');
    this.hours$ = this.collection.snapshotChanges().pipe(
      map((hours) =>
        hours.map(({ payload: { doc: hourDocument } }) => ({
          id: hourDocument.id,
          ...hourDocument.data(),
        }))
      )
    );
  }

  async getHours(): Promise<FirebaseHour[]> {
    const collection = await this.collection.get().toPromise();
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

  addHour(hour: FirebaseHour): Promise<FirebaseHour> {
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
