import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Hour } from 'src/app/shared/models/hour.model';

@Pipe({
  name: 'sortHours',
})
export class SortHoursPipe implements PipeTransform {
  transform(value: Hour[]): unknown {
    return value.sort((a, b) =>
      this.toMoment(a).isBefore(this.toMoment(b)) ? -1 : 1
    );
  }

  toMoment(hour: Hour): Moment {
    return moment().hour(hour.hour).minutes(hour.minutes).seconds(0);
  }
}
