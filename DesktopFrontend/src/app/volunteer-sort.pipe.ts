
import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({ name: 'volunteerSort' })
export class VolunteerSortPipe implements PipeTransform {

  transform(data: any[], field: string = ''): any[] {
    if (!data) {
        return data;
    }
    if (data.length <= 1) {
        return data;
    }
    if (!field || field === '') {
        return data.sort()
    }
    return orderBy(data, [field], ["asc"]);
  }
}
