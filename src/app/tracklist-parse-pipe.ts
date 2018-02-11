import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'tracklistparsepipe'})
export class TracklistParsePipe implements PipeTransform {
  transform(value: any[]): string {
    console.log('value: ' + JSON.stringify(value));
    return value['artists']['name'];
  }
}
