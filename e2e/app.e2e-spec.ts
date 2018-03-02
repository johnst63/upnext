import {AppPage} from './app.po';
import {browser, by, element} from 'protractor';
import {async} from '@angular/core/testing';
import {getBrowserConfig} from '@angular/cli/models/webpack-configs';
import {browserDetection} from '@angular/platform-browser/testing/src/browser_util';
import {until} from 'selenium-webdriver';
import elementIsVisible = until.elementIsVisible;

describe('up-next App', () => {
  let page: AppPage;
  let LOGIN = 'UpNext408';

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
    expect(page.getURL()).toBe('https://upnext-efec3.firebaseapp.com/login');
  });
  it('should navigate to Radio', function () {
    page.clickHeaderByID('radio');
    expect(page.getURL()).toBe('https://upnext-efec3.firebaseapp.com/radio');
  });
  it('should navigate to Home', function () {
    page.navigateTo('https://upnext-efec3.firebaseapp.com/login');
    page.clickHeaderByID('home');
    expect(page.getURL()).toBe('https://upnext-efec3.firebaseapp.com/home');

  });
  it('should should default go to home', function () {
    page.navigateTo('/');
    expect(page.getURL()).toBe('https://upnext-efec3.firebaseapp.com/home');
  });

  it('should authenticate',  async function () {

    page.navigateTo('login');
    element(by.css('#login_here')).click();
    //TODO figure out window open for auth


    browser.getAllWindowHandles().then( function (handles) {
      browser.switchTo().window(handles[1]);
      browser.element(by.cssContainingText('a','Log in to Spotify')).click();

      browser.element(by.css('#login-username')).sendKeys('bduffy2019@gmail.com');

      browser.element(by.css('#login-password')).sendKeys(LOGIN);
      browser.element(by.cssContainingText('button', 'Log In')).click();
      // go back to the main window
      expect(page.getURL()).not.toBe('https://upnext-efec3.firebaseapp.com/callback');
      browser.switchTo().window(handles[0]);

    });

    expect(page.getURL()).toBe('https://upnext-efec3.firebaseapp.com/home');
  });
  it('should search "abc"',  async function () {
    await page.navigateTo('/radio');
      await browser.element(by.css('#searchterm')).sendKeys('abc');
       await browser.element(by.css('#searchbutton')).click();
     await expect( browser.element(by.cssContainingText('#list','abc'))).toContain('abc');

  });

});
