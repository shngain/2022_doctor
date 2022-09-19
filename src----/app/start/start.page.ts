import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage  {

  constructor(private title: Title) { 

  }
  ionViewDidEnter() {
    // alert('1')
    this.title.setTitle('Doctors App');
  }
  

}
