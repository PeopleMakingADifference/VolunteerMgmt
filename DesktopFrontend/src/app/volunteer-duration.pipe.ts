import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'volunteerDuration'})
export class VolunteerDurationPipe implements PipeTransform {
  transform(value: number): string {
    if(!(value > 0)) return '';
    const seconds = value / 1000;
    let hoursDuration = Math.floor(seconds / (60 * 60));
    let minutesDuration = Math.floor((seconds - (hoursDuration * (60 * 60))) / 60);
    if(minutesDuration === 60){
      hoursDuration++;
      minutesDuration = 0;
    }
    // Show in fractional hours
    minutesDuration = Math.floor((100 * minutesDuration) / 60);
    return `${String(hoursDuration)}.${String(minutesDuration).padStart(2, '0')}`
  }
}