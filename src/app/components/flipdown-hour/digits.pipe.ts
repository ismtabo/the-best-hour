import { Pipe, PipeTransform } from '@angular/core';

export enum DIGIT {
  TENS = 'tens',
  UNITS = 'units',
}

@Pipe({
  name: 'digits',
})
export class DigitsPipe implements PipeTransform {
  transform(value: number, format: DIGIT): unknown {
    switch (format) {
      case DIGIT.TENS:
        return Math.floor((value % 100) / 10);
      case DIGIT.UNITS:
        return Math.floor(value % 10);
      default:
        return value;
    }
  }
}
