import { Injectable } from '@angular/core';
import {User} from './models/user.interface';
import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

@Injectable()
export class LoginService {

  public user = new User();
  constructor() {
  }

  getUsername(): User {

    return this.user;
  }
  // getUsername(): Observable<User> {
  //
  //   return of(this.user);
  // }

}
