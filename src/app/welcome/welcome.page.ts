import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
})
export class WelcomePage {

  slideOpts = {};

  constructor(private title: Title) { }

  ionViewDidEnter() {
    // alert('1')
    this.title.setTitle('Doctors App');
  }

}
