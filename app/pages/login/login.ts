import {Component} from '@angular/core';
import {NavController, LoadingController, AlertController} from 'ionic-angular';
import {FormGroup, FormControl, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {AuthData} from '../../providers/auth-data/auth-data';
import {SignupPage} from '../signup/signup';
import {TabsPage} from '../tabs/tabs';
import {ResetPasswordPage} from '../reset-password/reset-password';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthData],
  directives: [REACTIVE_FORM_DIRECTIVES],
})
export class LoginPage {
  public loginForm: FormGroup;


  constructor(public nav: NavController, public authData: AuthData, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.nav = nav;
    this.authData = authData;

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  loginUser(event){
    event.preventDefault();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then((authData) => {
      loading.onDidDismiss(() => {
        this.nav.popToRoot();
      });
      loading.dismiss();
    }, (error) => {
      loading.onDidDismiss(() => {
        let prompt = this.alertCtrl.create({
          message: error.message,
          buttons: [{text: "Ok"}]
        });
        prompt.present();
      });
      loading.dismiss();
    });
  }

  goToSignup(){
    this.nav.push(SignupPage);
  }

  goToResetPassword(){
    this.nav.push(ResetPasswordPage);
  }

}
