import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginService} from '../login.service';
import {User} from '../models/user.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit {

  user: User;
  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.getUsername();
  }
  getUsername(): void {
    this.user = this.loginService.getUsername();

  }

}
