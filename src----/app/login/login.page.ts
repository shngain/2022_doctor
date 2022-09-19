import { Component, OnInit,NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
// import { checkNoChangesView } from '@angular/core/src/view/view';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  returnUrl: string;
  loginForm: FormGroup;
  pwHidden = true;
  loginBtnText = 'Sign in';
  formSubmitted = false;

  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private toast: ToastController,
    private nav: NavController,
    private http: HttpClient,
    private zone:NgZone,
  ) {
    this.loginForm = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      pw: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.loginBtnText = 'Sign in';
    this.formSubmitted = false;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ionViewDidEnter() {
    this.loginBtnText = 'Sign in';
    this.formSubmitted = false;
    this.title.setTitle('Sign in');
  }

  getErrorMessage() {
    return this.loginForm.controls['userId'].hasError('required')
      ? 'Please enter UserId'
      : this.loginForm.controls['userId'].hasError('required')
      ? 'UserId must be a valid number'
      : this.loginForm.controls['pw'].hasError('required')
      ? 'Enter Password'
      : '';
  }

  onSubmit() {
    let today = new Date().toLocaleDateString()

    this.loginBtnText = 'Signing in...';
    this.formSubmitted = true;

    const loginData = {
      userId: this.loginForm.value.userId,
      pw: this.loginForm.value.pw,
    };
    //console.log(loginData)

    // Demo Login
    setTimeout(() => {

      const formData = new FormData();
      formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
      formData.append('username', loginData.userId)
      formData.append('password', loginData.pw)
      
      this.http.post("https://cureplus.online/APIs/login.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        this.zone.run(() => {
          var json=JSON.parse(JSON.stringify(res))
          console.log(json.message)
          if(json.message=='success'){
                console.log(json.username)
                localStorage.setItem('username', loginData.userId)
                localStorage.setItem('notidate', today)
                localStorage.setItem('name', json.username)
                this.nav.navigateForward('/home');
          }
          else{
            this.presentToast('Invalid Login Credentials.');
            this.loginBtnText = 'Sign in';
            this.formSubmitted = false;
          }

        });
    
      })
      // if (loginData.userId === environment.credentials.login.userid 
      //   && loginData.pw === environment.credentials.login.password) {
      //   localStorage.setItem('username', loginData.userId)
      //   this.nav.navigateForward('/home');
      // } else {
      //   this.presentToast('Invalid Login Credentials.');
      //   this.loginBtnText = 'Sign in';
      //   this.formSubmitted = false;
      // }
    }, 3000);

  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
    });
    toast.present();
  }
  forgot(){
    this.nav.navigateForward('/forgotpass');
  }
}
