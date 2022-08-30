import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Router, NavigationStart, Event } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
// import { InfoModalComponent } from '../_components/info-modal/info-modal.component';
import { SearchComponent } from '../_components/search/search.component';
import { TopicsComponent } from '../_components/topics/topics.component';
import { VideoDetailsComponent } from '../videos/video-details/video-details.component';

import { InteractionService } from '../_services/interaction.service';
import { HomeDataService } from './home-data.service';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {



  darkMode: boolean;
  showPrivacyBanner = true;
  showReminder: boolean;

 

  constructor(
    private title: Title,
    private interact: InteractionService,
    private modal: ModalController,
    private toast: ToastController,
    private store: Storage,
    private nav: NavController,
    private router: Router,
    private homeData: HomeDataService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.title.setTitle('Doctor Dashboard');
  }

  ionViewDidEnter() {
    this.store.get('DARK_UI').then((mode) => this.darkMode = mode ? true : false);
    this.store.get('BANN_PRIVACY').then((show) => this.showPrivacyBanner = show !== 'N' ? true : false);
    // this.refreshNeeded.next();
    //this.loadData();
  }

  loadData() {
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    var name = ((document.getElementById("name") as HTMLInputElement).value);
    var phone = ((document.getElementById("phone") as HTMLInputElement).value);
    var email = ((document.getElementById("email") as HTMLInputElement).value);
    var remark = ((document.getElementById("remark") as HTMLInputElement).value);
    var userid=localStorage.getItem('username')
    var callback = ((document.getElementById("callback") as HTMLInputElement).value);
    console.log(phone.length)
    console.log(this.validatephone(phone))
    if(!name || !phone || !email || !remark || !callback){
      this.presentToast('Some Field are missing')
    }    
    else if(!this.validatephone(phone)) 
    {  
      this.presentToast('Invalid Phone Number')  
    }
    else if(!this.validateEmail(email)){
      this.presentToast('Invalid Email')  
    }
    else if(callback=='yes' && !phone){
      this.presentToast('Phone Number cannot be empty')  
    }
    else{
    formData.append('name', name)
    formData.append('phone', phone)
    formData.append('email', email)
    formData.append('remark', remark)
    formData.append('userid',userid)
    formData.append('callback',callback)

    this.http.post("https://cureplus.online/APIs/feedback.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      if(res=='yes'){
          this.presentToast('Feedback submitted We will get back to you soon')
     
      }
      else{
        this.presentToast('Something went wrong')
      }
    });
    }
    
  }

  

  changeUIMode(e) {
    if (e.detail.checked) {
      this.store.set('DARK_UI', true)
        .then(_ => {
          this.interact.setDarkMode(true);
        });
    } else {
      this.store.set('DARK_UI', false)
        .then(_ => {
          this.interact.setDarkMode(false);
        });
    }
  }

  hideBanner() {
    this.showPrivacyBanner = false;
    this.store.set('BANN_PRIVACY', 'N');
  }
  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
  

  goToProfile() {
    this.hideBanner();
    this.nav.navigateForward('/account/my-profile');
  }

  dismissReminder() {
    this.showReminder = false;
  }
  validateEmail(email) 
  {
      var re = /\S+@\S+\.\S+/;
      return re.test(email);
  }
  validatephone(phone){
    if(phone.length==10){
      return true
    }
    else{
      return false
    }
  }

}
