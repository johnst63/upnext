import {AppPage} from './app.po';
import {browser, by, element} from 'protractor';
import {async} from '@angular/core/testing';
import {getBrowserConfig} from '@angular/cli/models/webpack-configs';
import {browserDetection} from '@angular/platform-browser/testing/src/browser_util';
import {until, WebElement} from 'selenium-webdriver';
import elementIsVisible = until.elementIsVisible;
import {timeout} from 'q';
import {protractor} from 'protractor/built/ptor';

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
    expect(page.getURL()).toBe('http://localhost:5000/login');
  });
  it('should navigate to Radio', function () {
    page.clickHeaderByID('radio');
    expect(page.getURL()).toBe('http://localhost:5000/radio');
  });
  it('should navigate to Home', function () {
    page.navigateTo('http://localhost:5000/login');
    page.clickHeaderByID('home');
    expect(page.getURL()).toBe('http://localhost:5000/home');

  });
  it('should should default go to home', function () {
    page.navigateTo('/');
    expect(page.getURL()).toBe('http://localhost:5000/home');
  });

  it('should authenticate', function () {
    browser.executeScript('window.localStorage.clear();');
    page.navigateTo('login');
    element(by.css('#login_here')).click();


    browser.getAllWindowHandles().then(function (handles) {
      browser.switchTo().window(handles[1]);
      browser.element(by.cssContainingText('a', 'Log in to Spotify')).click();
      browser.element(by.css('#login-username')).sendKeys('bduffy2019@gmail.com');
      browser.element(by.css('#login-password')).sendKeys(LOGIN);
      browser.element(by.cssContainingText('button', 'Log In')).click();

      expect(page.getURL()).not.toBe('http://localhost:5000/callback');
      browser.switchTo().window(handles[0]);

    });
    let token = browser.executeScript('localStorage.getItem(\'spotify-token\');');
    expect(token).not.toBe(undefined);

  });


  it('should search "abc"', function () {
    browser.executeScript('window.localStorage.clear();');
    page.navigateTo('/login');
    element(by.css('#login_here')).click();
    browser.getAllWindowHandles().then(function (handles) {


    }).then(function () {
      page.navigateTo('/radio');
      browser.driver.sleep(100);
      browser.element(by.css('#searchterm')).sendKeys('abc');
      browser.driver.sleep(100);
      browser.element(by.css('#searchbutton')).click();
      browser.driver.sleep(300);

      let elem = browser.element(by.cssContainingText('#list', 'abc')); // css selector might be causing issues
      browser.driver.sleep(100);
      expect(elem).toBe('abc');
    });
    expect();


  });
});
