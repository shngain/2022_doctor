import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, ToastController } from '@ionic/angular';
import { Title } from '@angular/platform-browser';
import { TopicsComponent } from '../../_components/topics/topics.component';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  dataLoading = true;
  medSchoolCollapsed = true;
  fellowshipCollapsed = true;
  residencyCollapsed = true;

  allTopics: any[] = [];
  awards: string[] = [];
  missingFields: string[] = [];
  completionPercentage = 0;
  name:any
  phone:any
  email:any
  address:any

  constructor(
    private title: Title,
    private nav: NavController,
    private modal: ModalController,
    private toast: ToastController,
    private http: HttpClient,
  ) {
  }

  ngOnInit() {
    this.title.setTitle('My Profile');
    setTimeout(() => {
      this.dataLoading = false;
    }, 2000);
    this.loaddata()
  }

  async openTopics() {
    const modal = await this.modal.create({
      component: TopicsComponent
    });
    return await modal.present();
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }

  goToEditProfile() {
    return false;
  }

  goBack() {
    this.nav.back();
  }
  loaddata(){
    var phone=localStorage.getItem('username')
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    formData.append('id', phone)
    
    this.http.post("https://cureplus.online/APIs/profile.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
        var json=JSON.parse(JSON.stringify(res))
        console.log(json)
        this.name=json[0].name
        this.phone=json[0].phone
        this.email=json[0].email
        this.address=json[0].address

  
    })
  }
}
