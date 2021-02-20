import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Hour } from 'src/app/shared/models/hour.model';

@Pipe({
  name: 'hour',
})
export class HourPipe implements PipeTransform {
  transform(hour: Hour): Date {
    return moment().hour(hour.hour).minutes(hour.minutes).toDate();
  }
}
