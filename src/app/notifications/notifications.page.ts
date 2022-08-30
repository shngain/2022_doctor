import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { SettingsComponent } from './settings/settings.component';
import Notifications from '../../assets/dummy/notifications.json';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  otherNotifications: any[] = [];

  deletedON: any[] = [];

  user: any;
  transId: number;
  issue: string;

  dataLoading: boolean;
  noNotif: boolean;
  today:any
  row_data=[]
  constructor(
    private title: Title,
    private modal: ModalController,
    private nav: NavController,
    private route: ActivatedRoute,
    private toast: ToastController,
    private http: HttpClient,
  ) {
    this.route.params.subscribe((params) => {
      this.transId = params.id || null;
      this.issue = params.issue || null;
    });
  }

  ngOnInit() {
    this.today=localStorage.getItem('notidate')
    this.title.setTitle('Notifications');
    this.getNotifications();
  }

  async getNotifications() {
    this.dataLoading = true;
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/allnotification.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.dataLoading = false;
      this.row_data=[]
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          console.log(json[0])
          this.row_data.push({
            id: json[i].id,
            type:json[i].type,
            title:json[i].title,
            description:json[i].desp,
            time:json[i].time
          })
        }
    });
    // setTimeout(() => {
    //   this.otherNotifications = Notifications;
    //   this.dataLoading = false;
    // }, 2000);

  }

  delete(index) {
    this.deletedON.push(index);
    this.otherNotifications = this.otherNotifications.filter(i => i.id !== index);
  }

  async openSettings() {
    const modal = await this.modal.create({
      component: SettingsComponent,
    });
    return await modal.present();
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
      mode: 'md',
    });
    toast.present();
  }

  goBack() {
    this.nav.back();
  }

}
