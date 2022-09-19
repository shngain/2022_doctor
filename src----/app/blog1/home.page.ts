import { Component, OnInit,NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Router, NavigationStart, Event,ActivatedRoute } from '@angular/router';
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
  id:any

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
    private activeRoute: ActivatedRoute,
    private socialSharing: SocialSharing,

  ) { }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.paramMap.get('id')
    this.getdata()
    //this.getofflinedata()
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


  getdata(){
    //alert('s')
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    formData.append('id', this.id)
    this.http.post("https://cureplus.online/APIs/blog.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      console.log(res)
      this.row_data=[]
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          this.row_data.push({
            date:json[i].date,
            author:json[i].author,
            content:json[i].content,
            source:json[i].source,
            id:json[i].id,
            title:json[i].title,
            image:"https://cureplus.online/APIs/upload/blogphoto/"+json[i].photo
          })
        }
      });
  
    });
  }

  // getofflinedata(){
  //   const formData = new FormData();
  //   formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
  //   this.http.post("https://cureplus.online/APIs/alldoctoroffline.php", formData)
  //   .pipe(
  //     finalize(() => {
  //     })
  //   )
  //   .subscribe(res => {
  //     this.offlinedata=[]
  //     this.zone.run(() => {
  //       var json=JSON.parse(JSON.stringify(res))
  //       for(var i=0; i<json.length;i++){
  //         //console.log(json[0])
  //         this.offlinedata.push({
  //           name: json[i].name,
  //           category:json[i].category,
  //           address:json[i].address,
  //           rating:json[i].rating,
  //           sex:json[i].sex,
  //           count:Number(json[i].maxlimit),
  //           status:json[i].status,
  //           id:json[i].id,
  //           image:"https://cureplus.online/APIs/upload/"+json[i].image
  //         })
  //       }
  //     });
  
  //   });
  // }

 

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
  view_full(id){
    this.router.navigateByUrl('/blogs/'+id);
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
