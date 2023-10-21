import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({ name: 'volunteerFilterCheckout' })
export class VolunteerFilterCheckoutPipe implements PipeTransform {

  transform(data: any[], field: string = ''): any[] {
    if (!data) {
        return data;
    }

    // Remove items which have checked out.
    let newData = data.filter(item => !item.checkout);

    // Then put in alphabetical order
    if (newData.length <= 1) {
        return newData;
    }
    if (!field || field === '') {
        return newData.sort()
    }
    return orderBy(newData, [field], ["asc"]);
  }
}