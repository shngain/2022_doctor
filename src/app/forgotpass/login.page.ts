import { Component, OnInit } from '@angular/core';
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
  pwHidden1 = true;
  loginBtnText = 'Sign in';
  formSubmitted = false;
  otpmsg=false;
  otp:any
  passwordsection=false
  otpmsg0=true
  constructor(
    private title: Title,
    private route: ActivatedRoute,
    private toast: ToastController,
    private nav: NavController,
    private http: HttpClient,
    // private zone:NgZone,
  ) {
    this.loginForm = new FormGroup({
      userId: new FormControl('', [Validators.required,Validators.email]),
      pw:  new FormControl('', [
        Validators.required,
        Validators.pattern(/^0|[1-9]\d*$/),
        Validators.maxLength(10),
        Validators.minLength(5),
      ]),
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ionViewDidEnter() {
    this.title.setTitle('Reset');
  }

   myFunction() {
    let hideFooterTimeout = setTimeout( () => {
      this.presentToast("Please Re-send OTP Time is Up");
      this.otpmsg=false;
      this.otpmsg0=true;
      this.loginBtnText = 'Sign in';
      this.formSubmitted = false;
      this.otp=''
      }, 100000);
  }
  
  alertFunc() {
    alert("Hello!");
  }
  getErrorMessage() {
    return this.loginForm.controls['userId'].hasError('required')
      ? 'Field Cannot be Empty'
      : this.loginForm.controls['userId'].hasError('required')
      ? 'Email must be valid'
      : this.loginForm.controls['pw'].hasError('required')
      ? 'Enter a Valid Number'
      : '';
  }

  onSubmit() {
    let today = new Date().toLocaleDateString()

    this.loginBtnText = 'Please Wait...';
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
      formData.append('email', loginData.userId)
      formData.append('userid', loginData.pw)
      
      this.http.post("https://cureplus.online/APIs/reset_password.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
          var json=JSON.parse(JSON.stringify(res))
          console.log(json)
          if(json.success){
            localStorage.setItem('username0', loginData.pw)
            this.otpmsg=true;
            this.otpmsg0=false;
            this.loginBtnText = 'Sign in';
            this.formSubmitted = false;
            this.otp=Number(json.otp)
            this.myFunction()
                // console.log(json.username)
                // localStorage.setItem('username', loginData.userId)
                // localStorage.setItem('notidate', today)
                // localStorage.setItem('name', json.username)
                // this.nav.navigateForward('/home');
          }
          else{
            this.presentToast('Invalid Login Credentials.');
            this.loginBtnText = 'Sign in';
            this.formSubmitted = false;
          }

    
      })
      // if (loginData.userId === environment.credentials.login.userid 
      //   && loginData.pw === environment.credentials.login.password) {
      //   localStorage.setItem('username', loginData.userId)
      //   this.nav.navigateForward('/home');
      // } else {
      //   this.presentToast('Invalid Login Credentials.');
        this.loginBtnText = 'Sign in';
        this.formSubmitted = false;
      // }
    }, 3000);

  }
  otpvalid(){
    this.formSubmitted = true;
    var otpuser = ((document.getElementById("otp") as HTMLInputElement).value);
    if(this.otp==otpuser){
      this.presentToast('OTP Valid');
      this.passwordsection=true
      this.formSubmitted = false;
    }
    else{
      this.presentToast('OTP Invalid');
      this.loginBtnText = 'Sign in';
      this.formSubmitted = false;
    }
  }
  password(){
    this.formSubmitted = true;
    var pass = ((document.getElementById("pass") as HTMLInputElement).value);
    var cpass = ((document.getElementById("cpass") as HTMLInputElement).value);
    if(pass==cpass){
      setTimeout(() => {

        const formData = new FormData();
        formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
        formData.append('phone',  localStorage.getItem('username0'))
        formData.append('password', pass)
        
        this.http.post("https://cureplus.online/APIs/updatepassword.php", formData)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(res => {
            var json=JSON.parse(JSON.stringify(res))
            console.log(json)
            if(json.success){
              this.formSubmitted = false;
              this.presentToast('Password Change Successfully !! Please Login.');
              this.nav.navigateForward('/login');
              // this.otpmsg=true;
              // this.otpmsg0=false;
              // this.loginBtnText = 'Sign in';
              // this.formSubmitted = false;
              // this.otp=Number(json.otp)
                  // console.log(json.username)
                  // localStorage.setItem('username', loginData.userId)
                  // localStorage.setItem('notidate', today)
                  // localStorage.setItem('name', json.username)
                  // this.nav.navigateForward('/home');
            }
            else{
              this.presentToast('Something Went Wrong.');
              this.loginBtnText = 'Sign in';
              this.formSubmitted = false;
            }
  
      
        })
          this.loginBtnText = 'Sign in';
          this.formSubmitted = false;
        // }
      }, 3000);
    }
    else{
      this.presentToast("Password didn't match");
      this.loginBtnText = 'Sign in';
      this.formSubmitted = false;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
    });
    toast.present();
  }
}
