import { Component, OnInit,NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController,AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InteractionService } from './../../_services/interaction.service';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss'],
})
export class SignupFormComponent implements OnInit {
  showHint = false;
  latitude: number;
  longitude: number;

  btnText = 'Submit';
  signupForm: FormGroup;
  formSubmitted = false;

  constructor(
    private title: Title,
    private alert: AlertController,
    private nav: NavController,
    private interact: InteractionService,
    private zone:NgZone,
    private http: HttpClient,
    private toast: ToastController,
  ) {
    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      email:new FormControl('', [Validators.required,Validators.email ]),
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.title.setTitle('Step 3 | Doctor Registration');
  }

  // canDeactivate(): boolean | Promise<boolean> {
  //   return this.confirmCancel();
  // }

  // async confirmCancel() {
  //   const alert = await this.alert.create({
  //     header: 'Hang on!',
  //     message: `If you leave this page, changes made by you will be lost.
  //      Are you sure that you want to leave this page?`,
  //     buttons: [
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //       },
  //       {
  //         text: 'Yes',
  //         role: 'proceed',
  //       },
  //     ],
  //   });
  //   await alert.present();
  //   return await alert.onDidDismiss().then(res => res.role === 'proceed');
  // }
  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
  async onSubmit(e) {
    //console.log(e.value)
    var mobilenumber= localStorage.getItem('mobilenumber')
    var password= localStorage.getItem('password')
    this.formSubmitted = true;
    this.interact.changeAllowance(true);
    setTimeout(() => {
      const formData = new FormData();
      formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
      formData.append('phone', mobilenumber)
      formData.append('name', e.value.name)
      formData.append('email', e.value.email)
      formData.append('password', password)
      formData.append('address', e.value.address)
      formData.append('age', e.value.age)
      this.http.post("https://cureplus.online/APIs/registration2.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        if(res){
          fetch('https://neat.freebeesms.com/api/send_http.php?authkey=2c7928d23a77e0287e3c9c333a856ee6&mobiles='+mobilenumber+'&message=Welcome+to+Cure+Plus.+We+are+focused+on+Medical+Consultation+and+Diagnostic+appointment+service.+Encash+your+benefit+share.+Book+now!SJNEAT&sender=SJNEAT&route=4&Template_ID=1507163497989196487').then(res => res.json())
              .then(json => {  
                console.log(json)  
          });
          localStorage.setItem('mobilenumber', '')
          localStorage.setItem('password', '')
          localStorage.setItem('username', mobilenumber)
          localStorage.setItem('name', e.value.name)
          this.nav.navigateForward('/home');
        }
        else{
          this.presentToast('Mobile Number Alredy register with us')
          this.formSubmitted = false;
         
        }
    
      });
      
    }, 3000);


    // this.formSubmitted = true;
    // this.interact.changeAllowance(false);
    // if (!this.signupForm.get('bname').value) {
    //   this.signupForm.get('bname').setValue(this.signupForm.get('name').value);
    // }
    // setTimeout(() => {
    //  // this.nav.navigateForward('/home');
    // }, 2500);
  }
}
