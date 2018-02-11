import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tracklistparsepipe'})
export class TracklistParsePipe implements PipeTransform {
  transform(value: any[]): string {
    console.log('value:' + value['name']);
    let str = '';
    str += value['name'];
    str += '-' + value['artists'][0]['name'];
    return str;
  }
}
