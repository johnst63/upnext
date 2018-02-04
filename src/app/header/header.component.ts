import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LoginComponent} from '../login/login.component';
import {LoginService} from '../login.service';
import {User} from '../user';
import {$} from 'protractor';

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

  // getUsername(): void {
  //   this.loginService.getUsername()
  //     .subscribe(user => this.user = user);
  // }

}
