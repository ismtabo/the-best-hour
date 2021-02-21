import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Hour } from '../../shared/models/hour.model';
import { HoursService } from '../../shared/services/hours/hours.service';

@Component({
  selector: 'app-hours-list',
  templateUrl: './hours-list.component.html',
  styleUrls: ['./hours-list.component.scss'],
})
export class HoursListComponent {
  hours$: Observable<Hour[]>;

  constructor(private hoursService: HoursService) {
    this.hours$ = this.hoursService.hours$;
  }

  async addHour(form: NgForm) {
    if (form.form.valid) {
      const hourControl = form.form.get('hour');
      const rawHour = hourControl.value as string;
      const [hour, minutes] = rawHour.split(':', 2).map((x) => parseInt(x, 10));
      await this.hoursService.addHour({ hour, minutes });
      form.reset();
    }
  }
}
