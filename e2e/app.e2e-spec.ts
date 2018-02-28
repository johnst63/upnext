import {AppPage} from './app.po';
import {browser, by, element} from 'protractor';
import {async} from '@angular/core/testing';
import {getBrowserConfig} from '@angular/cli/models/webpack-configs';
import {browserDetection} from '@angular/platform-browser/testing/src/browser_util';

describe('up-next App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    browser.ignoreSynchronization = true;
  });

  it('should display UpNext', () => {
    page.navigateTo('/');
    expect(page.getParagraphText()).toEqual('UpNext');
  });

  /* NAVIGATION TESTS */
  it('should navigate to Login', function () {
    page.clickHeaderByID('login');
    expect(page.getURL()).toBe('http://localhost:4200/login');
  });
  it('should navigate to Radio', function () {
    page.clickHeaderByID('radio');
    expect(page.getURL()).toBe('http://localhost:4200/radio');
  });
  it('should navigate to Home', function () {
    page.navigateTo('http://localhost:4200/login');
    page.clickHeaderByID('home');
    expect(page.getURL()).toBe('http://localhost:4200/home');

  });
  it('should should default go to home', function () {
    page.navigateTo('/');
    expect(page.getURL()).toBe('http://localhost:4200/home');
  });

  it('should authenticate',  async function () {
    debugger;

    page.navigateTo('login');
    element(by.css('#login_here')).click();
    //TODO figure out window open for auth
    debugger;
   // browser.pause();

    browser.getAllWindowHandles().then( function (handles) {
      debugger;
      browser.switchTo().window(handles[1]);
      browser.element(by.cssContainingText('a','Log in to Spotify')).click();

      browser.element(by.css('#login-username')).sendKeys('bduffy2019@gmail.com');
      let LOGIN = 'Password';
      //TODO change above
      browser.element(by.css('#login-password')).sendKeys(LOGIN);
      browser.element(by.cssContainingText('button', 'Log In')).click();
      debugger;
      // go back to the main window
      expect(page.getURL()).toBe('http://localhost:4200/callback');
      browser.switchTo().window(handles[0]);

    });
    debugger;
    expect(page.getURL()).toBe('http://localhost:4200/home');
  });

});
