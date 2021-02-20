import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hour } from 'src/app/shared/models/hour.model';
import { HoursService } from '../../shared/services/hours.service';

@Component({
  selector: 'app-hour',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.scss'],
})
export class HourComponent {
  @ViewChild(NgForm) form: NgForm;
  @Input() hour: Hour;
  @Output() hourChange: EventEmitter<Hour> = new EventEmitter<Hour>();
  editable = false;

  constructor(private hoursService: HoursService) {}

  enableEdition() {
    this.editable = true;
  }

  disableEdition() {
    this.form.reset();
    this.editable = false;
  }

  async removeHour() {
    await this.hoursService.deleteHour(this.hour);
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      const hourControl = form.form.get('hour');
      const rawHour = hourControl.value as string;
      const [hour, minutes] = rawHour.split(':', 2).map((x) => parseInt(x, 10));
      const newHour = { ...this.hour, hour, minutes };
      await this.hoursService.updateHour(newHour);
      this.hour = newHour;
      this.hourChange.emit(newHour);
      this.disableEdition();
    }
  }
}
