import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { InteractionService } from './_services/interaction.service';
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController, AlertController, } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {

  offline: boolean;
  darkmode = false;
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private interact: InteractionService,
    private store: Storage,
    private location:Location,
    private router: Router,
    private oneSignal: OneSignal,
    private alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
  ) {
    this.initializeApp();
    window.addEventListener('offline', () => this.offline = true);
    window.addEventListener('online', () => this.offline = false);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.checkGPSPermission()
      if (this.platform.is('cordova')) {
        this.statusBar.styleDefault();
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#3F51B5');
        this.splashScreen.hide();
        
        this.setupPush();
      }
      
    });
    this.setUIMode();
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.location.isCurrentPathEqualTo('/home')) {
        navigator['app'].exitApp();
       
      } else {
        if (!localStorage.getItem("username")) {
          this.router.navigateByUrl("");
        }
          else{
            var ddd=this.router.url
            const myArr = ddd.split("/")
            if(myArr[1]=='bill'){
              this.router.navigateByUrl("/home");
            }
            else{
              this.location.back();
            }
            
        }
       

      }
    });

    if (!localStorage.getItem("username")) {
      this.router.navigateByUrl("");
    }
      else{
        this.router.navigateByUrl('/home');
    }
  }
  

  setUIMode() {
    this.interact.isDarkMode().subscribe((dark) => {
      this.darkmode = dark ? true : false;
    });
    this.store.get('darkmode')
      .then((mode) => this.darkmode = mode ? true : false);
  }
    //onesignal
    setupPush() {
      //alert('Statring')
      // I recommend to put these into your environment.ts
      this.oneSignal.startInit('5cfed0db-02a0-4a89-98e7-9e44ba91f99a', '659600086197');
      //alert('On the way')
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      //alert('Done')
      // Notifcation was received in general
      this.oneSignal.handleNotificationReceived().subscribe(data => {
        let msg = data.payload.body;
        let title = data.payload.title;
        let additionalData = data.payload.additionalData;
        this.showAlert(title, msg, additionalData.task);
      });
   
      // Notification was really clicked/opened
      this.oneSignal.handleNotificationOpened().subscribe(data => {
        // Just a note that the data is a different place here!
        let additionalData = data.notification.payload.additionalData;
   
        this.showAlert('Notification opened', 'You have a message', additionalData.task);
      });
   
      this.oneSignal.endInit();
    }
    async showAlert(title, msg, task) {
      const alert = await this.alertCtrl.create({
        header: title,
        subHeader: msg,
      })
      alert.present();
    }
    checkGPSPermission() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
            this.askToTurnOnGPS();
          } else {
            this.requestGPSPermission();
          }
        },
        err => {
        }
      );
    }
    requestGPSPermission() {
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
            .then(
              () => {
                this.askToTurnOnGPS();
              },
              error => {
                alert('Please Allow location permission to access all features');
                (navigator as any).app.exitApp();
              }
            );
        }
      });
    }
    checkGPSPermission1() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
  
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
  
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          //alert(err);
          alert('Please Allow location permission to access all features');
          (navigator as any).app.exitApp();
        }
      );
    }
    askToTurnOnGPS() {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getLocationCoordinates()
        },
        error => alert('Please Allow location permission to access all features')
      );
    }
    getLocationCoordinates() {
      this.geolocation.getCurrentPosition().then((resp) => {
  
      }).catch((error) => {
        alert('Please Allow location permission to access all features');
        (navigator as any).app.exitApp();
      });
    }
}
