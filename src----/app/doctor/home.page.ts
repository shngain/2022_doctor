import { Component, OnInit,NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Router, NavigationStart, Event } from '@angular/router';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { InteractionService } from '../_services/interaction.service';
import { HomeDataService } from './home-data.service';
import { HttpClient } from '@angular/common/http';
import { Location } from "@angular/common";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

 
  darkMode: boolean;
  showPrivacyBanner = true;
  showReminder: boolean;
  datess=[]
  row_data = []
  offlinedata = []
  isOrange=false

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
    private zone:NgZone,
    private location:Location,
    private socialSharing: SocialSharing,
  ) { }

  ngOnInit() {
    var someDate = new Date();
    var dd = someDate.getDate();
    var mm = someDate.getMonth();
    var y = someDate.getFullYear();
    var someFormattedDate = dd + '-'+ mm + '-'+ y;
    this.datess.push(someFormattedDate)
    var dd1 = someDate.getDate()+1;
    var mm1 = someDate.getMonth();
    var y1 = someDate.getFullYear();
    var someFormattedDat1 = dd1 + '-'+ mm1 + '-'+ y1;
    this.datess.push(someFormattedDat1)
    var dd2 = someDate.getDate()+2;
    var mm2 = someDate.getMonth();
    var y2 = someDate.getFullYear();
    var someFormattedDate2 = dd2 + '-'+ mm2 + '-'+ y2;
    this.datess.push(someFormattedDate2)
    this.getdata()
    this.getofflinedata()
    this.title.setTitle('Doctor Dashboard');
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
       //this.hideModal();
      }
    })
  }

  ionViewDidEnter() {
    this.store.get('DARK_UI').then((mode) => this.darkMode = mode ? true : false);
    this.store.get('BANN_PRIVACY').then((show) => this.showPrivacyBanner = show !== 'N' ? true : false);
  }

  toggle(){
    if(this.isOrange) {
      this.presentToast('Sort by Name A to Z')
      this.getdata()
     
    }else {
      this.presentToast('Sort by Name Z to A')
       this.getdatadesc()
       
    }
    this.isOrange = !this.isOrange;
  }

  getdata(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/alldoctor.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.row_data=[]
      var l=0
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          console.log(json[0])
          this.row_data.push({
            dataid: 'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            sex:json[i].sex,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
      });
  
    });
  }
  getdatadesc(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/alldoctordsc.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.row_data=[]
      var l=0
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          console.log(json[0])
          this.row_data.push({
            dataid: 'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            sex:json[i].sex,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
      });
  
    });
  }

  getofflinedata(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/alldoctoroffline.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.offlinedata=[]
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          //console.log(json[0])
          this.offlinedata.push({
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            sex:json[i].sex,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
      });
  
    });
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


  doRefresh(e) {
  }

  goToProfile() {
    this.hideBanner();
    this.nav.navigateForward('/account/my-profile');
  }
  view_full(id,actualid){
    // var dates = ((document.getElementById(actualid) as HTMLInputElement).value);
   
    // if(dates){
       this.router.navigateByUrl('/doctorprofile/'+id+'/'+0);
    // }
    // else{
    //   this.presentToast('Please Select a Date for appointment')
    // }
  }

  // dismissReminder() {
  //   this.showReminder = false;
  // }
  goBack(){
    this.location.back();
  }
  share(){
    var imgurl= 'https://cureplus.online/app/images/home/1_banner.jpg'
    var strings='https://play.google.com/store/apps/details?id=cureplus.projectnothing.xyz'
    this.socialSharing.share('Medical consultation doctor and diagnostic appointment. Blogs, health tips from reliable sources. Please download the app from below link',null,imgurl,strings)
    .then(() => {},
      () => { 
        alert('SocialSharing failed');
      });
  }

}
