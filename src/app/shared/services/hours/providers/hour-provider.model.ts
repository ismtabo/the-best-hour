import { Observable } from 'rxjs';
import { Hour } from '../../../models/hour.model';

export interface HoursProvider<H extends Hour = Hour> {
  hours$: Observable<H[]>;
  getHours(): Promise<H[]>;
  getHour(key: Extract<H, 'id'>): Promise<H>;
  addHour(hour: H): Promise<H>;
  updateHour(hour: H): Promise<H>;
  deleteHour(hour: H): Promise<void>;
}

interface ProviderHour<T> extends Hour {
  id?: T;
}

export type IndexedDbHour = ProviderHour<number>;

export type FirebaseHour = ProviderHour<string>;
