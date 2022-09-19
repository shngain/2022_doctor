import { Component, OnInit,NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController,AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SearchComponent } from '../_components/search/search.component';
import { InteractionService } from '../_services/interaction.service';
import { HomeDataService } from './home-data.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { Location } from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  
  type:any
  id:any
  amount:any
  darkMode: boolean;
  showPrivacyBanner = true;
  showReminder: boolean;
  bookingid:any
  name:any
  address:any
  paymentmethod:any
  transctionid:any
  datetime:any
  encodeData:any
  url:any;
  content: string;
  patient_name:any
  slotdate:any
  
  constructor(
    private title: Title,
    private interact: InteractionService,
    private modal: ModalController,
    private toast: ToastController,
    private store: Storage,
    private nav: NavController,
    private router: Router,
    private homeData: HomeDataService,
    private http: HttpClient,
    private zone:NgZone,
    private activeRoute: ActivatedRoute,
    public alertController: AlertController,
    private pdfGenerator: PDFGenerator,
    private location:Location
  ) { }

  ngOnInit() {
    // var ddd=this.router.url
    // const myArr = ddd.split("/")
    // console.log(myArr)
    console.log(this.location.isCurrentPathEqualTo('/bill/3'))
    this.id = this.activeRoute.snapshot.paramMap.get('userid')
    
  }
  downloadInvoice() {
    this.content = document.getElementById('PrintInvoice').innerHTML;
    let options = {
      documentSize: 'A4',
      type: 'share',
      // landscape: 'portrait',
      fileName: 'Order-Invoice.pdf'
    };
    this.pdfGenerator.fromData(this.content, options)
      .then((base64) => {
        console.log('OK', base64);
      }).catch((error) => {
        console.log('error', error);
      });

  }

  ionViewDidEnter() {
    this.id = this.activeRoute.snapshot.paramMap.get('userid')
    this.loadData(this.id);
  }

  loadData(id) {
      const formData = new FormData();
      formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
      formData.append('id', id)
      this.http.post("https://cureplus.online/APIs/bill.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        this.zone.run(() => {
          var json=JSON.parse(JSON.stringify(res))
          console.log(json)
          this.patient_name=json[0].patient_name
          this.name=json[0].booking_name
          this.slotdate=json[0].slot +','+ json[0].selecteddate
          this.address=json[0].booking_address
          this.paymentmethod=json[0].paymentmode
          this.transctionid=json[0].transaction_id
          this.bookingid='BKNG_2021_'+json[0].id
          this.datetime=json[0].bokkingdatetime
          this.url='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data='+json[0].id+''
        });
    
      })
  
  }


  async initSearch() {
    const modal = await this.modal.create({
      component: SearchComponent,
    });
    return await modal.present();
  }


  changeUIMode(e) {
    if (e.detail.checked) {
      this.store.set('DARK_UI', true)
        .then(_ => {
          this.interact.setDarkMode(true);
        });
    } else {
      this.store.set('DARK_UI', false)
        .then(_ => {
          this.interact.setDarkMode(false);
        });
    }
  }

  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
  goBack(){
    this.router.navigateByUrl('/home');
  }


 

}
