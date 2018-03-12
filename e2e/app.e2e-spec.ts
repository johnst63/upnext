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
    //browser.executeScript('window.localStorage.clear();');
    page.navigateTo('/login');
    element(by.css('#login_here')).click().then(function () {
      return expect(page.getURL()).toBe('http://localhost:5000/login');
    });
    browser.driver.sleep(1000);
    expect(page.getURL()).toBe('http://localhost:5000/home');
    browser.element(by.id('radio')).click();
    browser.driver.sleep(100);
    expect(page.getURL()).toBe('http://localhost:5000/radio');
    browser.element(by.css('#searchterm')).sendKeys('abc');
    //browser.driver.sleep(100);
    browser.element(by.css('#searchbutton')).click();
    browser.driver.sleep(1000);
    expect(browser.element(by.cssContainingText('p', 'ABC')).isPresent()).toBe(true);

  });

  it('should not show full home page', function () {
    page.navigateTo('/home');
    browser.driver.sleep(1000);
    expect(browser.element(by.id('loginnow')).isPresent()).toBe(true);
    page.navigateTo('/login');
    browser.element(by.id('login_here')).click().then(function () {
      return expect(page.getURL()).toBe('http://localhost:5000/login');
    });
    browser.driver.sleep(2000);
    expect(page.getURL()).toBe('http://localhost:5000/home');

  });
  // it('should add to database', function () {
  //   page.navigateTo('/login');
  //   browser.element(by.id('login_here')).click();
  //   browser.driver.sleep(2000);
  //   expect(page.getURL()).toBe('http://localhost:5000/home');
  //   browser.element(by.id('radio')).click();
  //   browser.driver.sleep(100);
  //   browser.element(by.css('#searchterm')).sendKeys('dark necessities');
  //
  //   browser.element(by.css('#searchbutton')).click();
  //   browser.driver.sleep(1000);
  //   browser.element(by.className('add_track_button')).click();
  //   browser.element(by.id('home')).click();
  //   browser.driver.sleep(1000);
  //   expect(browser.element(by.cssContainingText('p','Dark Necessities')).isPresent()).toBe(true);
  //
  // });
  it('should search multiple times', function () {
    page.navigateTo('/radio');
    browser.driver.sleep(100);
    browser.element(by.css('#searchterm')).sendKeys('123');
    browser.element(by.css('#searchbutton')).click();
    let EC = protractor.ExpectedConditions;
    browser.wait(EC.alertIsPresent(), 5000, 'Alert is not getting present');
    let temp = browser.switchTo().alert();
    expect(temp.getText()).toBe('Error: Please login before searching a term!');
    temp.accept();
    browser.driver.sleep(1000);
    expect(browser.element(by.id('tracks_dne')).isPresent()).toBe(true);
    page.clickHeaderByID('login');
    browser.element(by.id('login_here')).click();
    browser.driver.sleep(1000);
    expect(page.getURL()).toBe('http://localhost:5000/home');
    page.clickHeaderByID('radio');
    browser.element(by.id('searchbutton')).click();
    temp = browser.switchTo().alert();
    expect(temp.getText()).toBe('Error: Please type a search term in!');
    temp.accept();
    browser.driver.sleep(100);
    browser.element(by.id('searchterm')).sendKeys('scar tissue');
    browser.element(by.id('searchbutton')).click();
    browser.driver.sleep(1000);
    expect(browser.element(by.id('tracks_dne')).isPresent()).toBe(false);
    expect(browser.element(by.cssContainingText('p', 'Scar Tissue')).isPresent()).toBe(true);

  });

  it('should open up spotify', function () {
    page.navigateTo('/login');
    browser.element(by.id('login_here')).click();
    browser.driver.sleep(2000);
    expect(page.getURL()).toBe('http://localhost:5000/home');
    browser.switchTo().frame(0);
    browser.driver.sleep(1000);
    browser.driver.findElement(by.id('play-button')).click();
    browser.switchTo().defaultContent();
    browser.waitForAngular();
    browser.driver.sleep(5000);
    expect(page.getURL()).toBe('http://localhost:5000/home');
  });
});
