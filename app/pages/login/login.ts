import {Component} from '@angular/core';
import {NavController, LoadingController, AlertController} from 'ionic-angular';
import {FormGroup, FormControl, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {AuthData} from '../../providers/auth-data/auth-data';
import {ProfileData} from '../../providers/profile-data/profile-data';
import {SignupPage} from '../signup/signup';
import {TabsPage} from '../tabs/tabs';
import {ResetPasswordPage} from '../reset-password/reset-password';

@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [AuthData, ProfileData],
  directives: [REACTIVE_FORM_DIRECTIVES],
})
export class LoginPage {
  public loginForm: FormGroup;
  public user: any;

  constructor(public nav: NavController, public authData: AuthData, public profileData: ProfileData, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
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

  loginUserSocial(event, provider) {
    event.preventDefault();
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authData.loginUserSocial(provider).then((authData) => {
      this.profileData.getUserProfileByLink(authData.user.uid).once('value').then((userData) => {
        loading.onDidDismiss(() => {
          this.user = userData.val();
          if(this.user) {
            this.authData.userProfile.child(authData.user.uid).update({
              email: authData.user.email
            });
          }else{
            this.authData.userProfile.child(authData.user.uid).set({
              email: authData.user.email,
              name: authData.user.displayName,
              photoUrl: authData.user.photoURL
            });
          }
        });
        loading.dismiss();
      });
      this.nav.popToRoot();
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
