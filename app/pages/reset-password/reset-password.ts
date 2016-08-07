import {NavController, LoadingController, AlertController} from 'ionic-angular';
import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {AuthData} from '../../providers/auth-data/auth-data';
import {LoginPage} from '../login/login';
import {TabsPage} from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/reset-password/reset-password.html',
  providers: [AuthData],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class ResetPasswordPage {
  public resetPasswordForm: FormGroup;

  constructor(public authData: AuthData, public formBuilder: FormBuilder, public nav: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.authData = authData;

    this.resetPasswordForm = this.formBuilder.group({
      email: ['', Validators.required],
    })
  }

  resetPassword(event){
    event.preventDefault();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authData.resetPassword(this.resetPasswordForm.value.email).then((user) => {
      loading.onDidDismiss(() => {
        let prompt = this.alertCtrl.create({
          message: "We just sent you a reset link to your email",
          buttons: [{
            text: "Ok",
            handler: () => {
              this.nav.pop();
            }
          }]
        });
        prompt.present();
      });
      loading.dismiss();
    }, (error) => {
      loading.onDidDismiss(() => {
        var errorMessage: string;
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "You'll need to write a valid email address";
            break;
          case "auth/user-not-found":
            errorMessage = "That user does not exist";
            break;
          default:
            errorMessage = error.message;
        }
        let prompt = this.alertCtrl.create({
          message: errorMessage,
          buttons: [{text: "Ok"}]
        });
        prompt.present();
      });
      loading.dismiss();
    });
  }
}
