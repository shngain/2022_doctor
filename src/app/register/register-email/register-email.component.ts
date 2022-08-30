import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { InteractionService } from './../../_services/interaction.service';

@Component({
  selector: 'app-register-email',
  templateUrl: './register-email.component.html',
  styleUrls: ['./register-email.component.scss'],
})
export class RegisterEmailComponent implements OnInit {
  pwHidden = true;
  loginCredentialForm: FormGroup;
  emailErrMsg = '';
  formSubmitted = false;
  mobilenumber:any
  constructor(
    private title: Title,
    private interact: InteractionService,
    private nav: NavController,
  ) {
    this.loginCredentialForm = new FormGroup({
      // userId: new FormControl(''),
      pw: new FormControl('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        ),
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit() {
    this.interact.changeAllowance(false);
    this.mobilenumber= localStorage.getItem('mobilenumber')
  }

  ionViewDidEnter() {
    this.title.setTitle('Step 2 | Doctor Registration');
  }

  async onSubmit(e) {
    //console.log(e.value.pw)
    this.formSubmitted = true;
    this.interact.changeAllowance(true);
    setTimeout(() => {
      localStorage.setItem('password', e.value.pw)
      this.nav.navigateForward('/register/create-profile');
    },         1500);
  }
}
