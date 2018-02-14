import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tracklistparsepipe'})
export class TracklistParsePipe implements PipeTransform {
  transform(value: any[]): string {
    // console.log('value:' + value['name']);
    let str = '';
    if (value == null) {
      str = 'Track Not Found';
      return str;
    }

    str += (value['name'] != null ? value['name'] : 'Unknown Song');

    if (value != null && value['artists'] != null && value['artists'][0]['name'] != null) {
      str += ' - ' + value['artists'][0]['name'];
    } else {
      str += 'Unknown Artist';
    }

    return str;
  }
}
