import {NavController, LoadingController, AlertController} from 'ionic-angular';
import {Component} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder, REACTIVE_FORM_DIRECTIVES} from '@angular/forms';
import {AuthData} from '../../providers/auth-data/auth-data';
import {TabsPage} from '../tabs/tabs';

@Component({
  templateUrl: 'build/pages/signup/signup.html',
  providers: [AuthData]
})
export class SignupPage {
  public signupForm: any;


  constructor(public nav: NavController, public authData: AuthData, public formBuilder: FormBuilder, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.nav = nav;
    this.authData = authData;

    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  signupUser(event){
    event.preventDefault();
    this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password).then((newUser) => {
      loading.dismiss();
      this.authData.fireAuth.signInWithEmailAndPassword(this.signupForm.value.email, this.signupForm.value.password).then((authenticatedUser) => {
        this.authData.userProfile.child(authenticatedUser.uid).set({
          email: this.signupForm.value.email
        }).then(() => {
          this.nav.setRoot(TabsPage);
        });

      })
    }, (error) => {
      loading.dismiss();
      var errorMessage: string = error.message;
        let prompt = this.alertCtrl.create({
          message: errorMessage,
          buttons: [{text: "Ok"}]
        });
        prompt.present();
    });
    let loading = this.loadingCtrl.create();
    loading.present();
  }

}
