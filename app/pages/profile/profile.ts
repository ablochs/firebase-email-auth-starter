import { NavController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { ProfileData } from '../../providers/profile-data/profile-data';
import { AuthData } from '../../providers/auth-data/auth-data';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'build/pages/profile/profile.html',
  providers: [ProfileData, AuthData]
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;

  constructor(public nav: NavController, public profileData: ProfileData, public authData: AuthData, public alertCtrl: AlertController) {
    this.nav = nav;
    this.profileData = profileData;

    this.profileData.getUserProfile().on('value', (data) => {
      this.userProfile = data.val();
      this.birthDate = this.userProfile.birthDate;
    });

  }

  logOut(){
    this.authData.logoutUser().then(() => {
      this.nav.popToRoot();
    });
  }

  updateName(){
    let prompt = this.alertCtrl.create({
      message: "Your name",
      inputs: [
        {
          name: 'name',
          placeholder: 'Your name',
          value: this.userProfile.name
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updateName(data.name);
          }
        }
      ]
    });
    prompt.present();
  }

  updateDOB(birthDate){
    this.profileData.updateDOB(birthDate);
  }

  updateEmail(){
  let prompt = this.alertCtrl.create({
    inputs: [
      {
        name: 'newEmail',
        placeholder: 'Your new email',
      },
    ],
    buttons: [
      {
        text: 'Cancel',
      },
      {
        text: 'Save',
        handler: data => {
          this.profileData.updateEmail(data.newEmail);
        }
      }
    ]
  });
  prompt.present();
}

  updatePassword(){
    let prompt = this.alertCtrl.create({
      inputs: [
        {
          name: 'newPassword',
          placeholder: 'Your new password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: data => {
            this.profileData.updatePassword(data.newPassword);
          }
        }
      ]
    });
    prompt.present();
  }

}
