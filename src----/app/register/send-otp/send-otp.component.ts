import { Component, OnInit,NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InteractionService } from './../../_services/interaction.service';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
// import dialCodesJson from '../../../assets/dummy/dialCodes.json';

@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.component.html',
  styleUrls: ['./send-otp.component.scss'],
})
export class SendOtpComponent implements OnInit {
  mobileNoForm: FormGroup;
  formSubmitted = false;

  isdCodes = [
    {
      name: 'India',
      dial_code: '+91',
      code: 'IN',
    },
  ];

  mobileErrMsg = '';
  mobileError = false;

  constructor(
    private title: Title,
    private interact: InteractionService,
    private nav: NavController,
    private http: HttpClient,
    private zone:NgZone,
    private toast: ToastController,
    ) {
    this.mobileNoForm = new FormGroup({
      isdCode: new FormControl('', Validators.required),
      mobileNo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^0|[1-9]\d*$/),
        Validators.maxLength(10),
        Validators.minLength(5),
      ]),
    });
  }

  ngOnInit() {
    const lowCodes = this.isdCodes.map(a => {
      a.code = a.code.toLowerCase();
      return a;
    });
    this.isdCodes = lowCodes.sort((a, b) => a.name.localeCompare(b.name));
  }

  ionViewDidEnter() {
    this.title.setTitle('Step 1 | Registration');
  }

  async checkMobile() {}
  
  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
  async onSubmit(e) {
    //console.log(e.value.mobileNo)
    this.formSubmitted = true;
    this.interact.changeAllowance(true);
    setTimeout(() => {
      const formData = new FormData();
      formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
      formData.append('id', e.value.mobileNo)
      this.http.post("https://cureplus.online/APIs/registration1.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        var json=JSON.parse(JSON.stringify(res))
        console.log(json)
        if(json[0].data >0){
          this.presentToast('Mobile Number Alredy register with us')
          //this.loginBtnText = 'Sign in';
          this.formSubmitted = false;
        }
        else{
          localStorage.setItem('mobilenumber', e.value.mobileNo)
          this.nav.navigateForward('/register/associate-email');
        }
    
      });
      
    }, 3000);
  }
}
