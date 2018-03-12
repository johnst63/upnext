import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(path) {
    return browser.get(path);
  }

  getParagraphText() {
    return element(by.css('h1')).getText();
  }
  clickHeaderByID(name) {
    let id = '#' + name;
    element(by.css(id)).click();
    return id;
  }
  getURL() {
    return browser.getCurrentUrl();
  }

}
