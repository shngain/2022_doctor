/* eslint-disable object-shorthand */
import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
//import { HTTP } from '@ionic-native/http/ngx';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { AlertController, NavController } from '@ionic/angular';

const WEB = 'WEB';
const UPI = 'UPI';

const appId = '2357206197e9e6c9b701f94618027532'; //Enter your appId here;
const appSecret = '5c37628572c5c39b56b36b5c09a557a58410e90a'; //Enter your appSecret here (not to be used in your production app. use this in your backend api instead).

const env = 'PROD'; //'TEST' or 'PROD'

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let PgCordovaWrapper: any;
@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
  encapsulation: ViewEncapsulation.None

})
export class WelcomePage implements AfterViewInit {
  //private http: HTTP;

  constructor(private actRoute: ActivatedRoute, public http: HttpClient, public router: Router, public alertController: AlertController, public nav: NavController) {
    //this.http = new HTTP();
    //this.http.setDataSerializer('json');
  }
  userid
  name
  phone
  address
  bloodgroup
  slot
  datee
  type
  bookingid
  amount
  offeramount
  totalamount
  booking_name
  booking_address
  bookingdate
  modes
  email
  loaddata() {
    var phone = localStorage.getItem('username')
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    formData.append('id', phone)

    this.http.post("https://cureplus.online/APIs/profile.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        var json = JSON.parse(JSON.stringify(res))
        console.log(json)
        this.email = json[0].email
        this.startPaymentWeb();
      })
  }

  ngAfterViewInit(): void {
    // this.getUPIApps();
    this.actRoute.queryParams.subscribe((data: any) => {
      this.userid = data.userid;
      this.name = data.name;
      this.phone = data.phone;
      this.address = data.address;
      this.bloodgroup = data.bloodgroup;
      this.slot = data.slot;
      this.datee = data.datee;
      this.type = data.type;
      this.bookingid = data.bookingid;
      this.amount = data.amount;
      this.offeramount = data.offeramount;
      this.totalamount = data.totalamount;
      this.booking_name = data.booking_name;
      this.booking_address = data.booking_address;
      this.bookingdate = data.bookingdate;
      this.modes = data.modes;
      this.loaddata();
    })
  }

  async getToken(): Promise<Map<string, string>> {

    const map = new Map<string, string>();

    try {
      const orderID = 'Order' + parseInt((100000000 * Math.random()).toString(), 10);
      map.set('orderId', orderID);
      // @ts-ignore
      const url = (env === 'PROD') ? 'https://api.cashfree.com/api/v2/cftoken/order' : 'https://test.cashfree.com/api/v2/cftoken/order';
      const params = {
        // eslint-disable-next-line
        "orderId": orderID,
        // eslint-disable-next-line
        // "orderAmount": '1',
        "orderAmount": this.totalamount,
        // eslint-disable-next-line
        "orderCurrency": "INR"
      };
      const headers = {
        'x-client-id': appId,
        'x-client-secret': appSecret,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      //this.http.setDataSerializer('json');
     // const response = await this.http.post(url, params, headers);

      //map.set('token', JSON.parse(response.data).cftoken);
     // console.log(JSON.stringify(JSON.parse(response.data))); // JSON data returned by server
      //.log(map.get('token'));
      return Promise.resolve(map);

    } catch (error) {
      console.log(JSON.stringify(error));
      return Promise.reject(error);
    }
  }

  async getParams(): Promise<any> {

    try {
      const tokenMap = await this.getToken();

      // const map = new Map<string, string>();

      const map = {
        appId: appId,
        orderId: tokenMap.get('orderId'),
        // orderAmount: '1',
        orderAmount: this.totalamount,
        orderNote: 'Book Appointment Cure Plus',
        customerName: this.name,
        customerPhone: this.phone,
        customerEmail: this.email,
        notifyUrl: 'https://www.yourendpoint.com/',
        orderCurrency: 'INR',
        stage: env,
        tokenData: tokenMap.get('token')
      };

      return Promise.resolve(map);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getUPIApps() {
    console.log('getUPIApps invoked1');
    PgCordovaWrapper.getUPIApps(this.onGetUPIAppsResponse, this.onUPIError);
  }

  public startPaymentWeb() {
    this.startPayment(WEB, null);
  }

  public startPaymentUPI(upiAppId: string) {
    this.startPayment(UPI, upiAppId);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private handleUPIApps(result: any) {
    // alert('upi'+JSON.stringify(result))
    const array = transFormUPIResponse(JSON.parse(result));
    const buttonArray = [];
    array.forEach((value => {
      const icon = `data:image/png;base64,${value.base64Icon}`;
      const button = this.getFormattedIcon(value.displayName, icon, value.id);
      buttonArray.push(button);
    }));
    if (array.length === 0) {
      buttonArray.push(`<div class="upi_app_not_found">No UPI Apps Found</div>`);
      this.changeUPIArray(buttonArray);
    }
    this.changeUPIArray(buttonArray);
  }

  private getFormattedIcon(displayName, icon: string, id) {
    return `<div id="${id}" class="round_icon_buttons">
        <img class="upi_image" src="${icon}" alt="Upi App"/>
        <ion-text class="upi_icons_text">${displayName}</ion-text>
      </div>`;
  }

  private startPayment(mode: string, upiAppId: string) {
    document.getElementById('tv_response').innerHTML = 'Response will Show Here';
    this.getParams().then((params) => {
      if (mode === WEB) {
        PgCordovaWrapper.startPaymentWEB(params, this.onResult, this.onError);
      } else {
        if (upiAppId !== null) {
          params.appName = upiAppId;
        }
        PgCordovaWrapper.startPaymentUPI(params, this.onResult, this.onError);
      }
    }).catch((error) => {
      alert('error'+JSON.stringify(error))

      console.log(error.message);
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private onResult = (result: any) => {
    let output = '';
    // let txMsg
    let signature
    let referenceId
    let orderId
    let res = JSON.parse(result);
    // let res = {}
    // alert(JSON.stringify(res))



    if (res.txStatus == 'SUCCESS') {
      referenceId = res.referenceId
      orderId = res.orderId
      const resultObject = { Response: 'Transaction Successfully' }
      Object.keys(resultObject).forEach((key) => {
        // alert(JSON.stringify(key))
        output = output.concat(`${key} : ${resultObject[key]} <br>`);
      });

      document.getElementById('tv_response').innerHTML = output;
      this.call(referenceId, orderId)

    } else {
      signature = undefined
      const resultObject = { Response: 'Transaction Failed', Status: res.txStatus }
      Object.keys(resultObject).forEach((key) => {
        // alert(JSON.stringify(key))
        output = output.concat(`${key} : ${resultObject[key]} <br>`);
      });

      document.getElementById('tv_response').innerHTML = output;
      
    }



    // const resultObject = {orderId:res.orderId,txMsg:txMsg,txStatus:res.txStatus}
    // const resultObject = {Response:txMsg,Status:res.txStatus,signature:signature}
    // const resultObject = JSON.parse(result);
    // alert(JSON.stringify(resultObject))
    // Object.keys(resultObject).forEach((key) => {
    // // alert(JSON.stringify(key))
    //   if (key === 'signature') {
    //     output = 'Transaction Success'
    //     this.call(resultObject[key].referenceId,resultObject[key].orderId)
    //     // const shortString = resultObject[key].substring(0, 5).concat('...');
    //     // output = output.concat(`${key} : ${shortString} <br>`);
    //   } else {
    //     output = 'Transaction Failed'
    //     // output = output.concat(`${key} : ${resultObject[key]} <br>`);
    //   }
    // });

    // document.getElementById('tv_response').innerHTML = output;

    // alert('result'+JSON.stringify(result))
    // alert('output'+JSON.stringify(output))

  };

  call(referenceId, orderId) {
    // alert(referenceId)
    // alert(orderId)
    var datee = new Date().toLocaleDateString();
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    formData.append('userid', this.userid)
    formData.append('patientname', this.name)
    formData.append('patientphone', this.phone)
    formData.append('patientaddress', this.address)
    formData.append('bloodgroup', this.bloodgroup)
    formData.append('slot', this.slot)
    formData.append('date', datee)
    formData.append('bookingtype', this.type)
    formData.append('bookingid', orderId)
    formData.append('payemnetmode', 'online')
    formData.append('transsactionid', referenceId)
    formData.append('totalamout', this.amount)
    formData.append('offeramount', String(this.offeramount))
    formData.append('payableamount', this.totalamount)
    formData.append('booking_name', this.booking_name)
    formData.append('booking_address', this.booking_address)

    formData.append('selecteddate', this.bookingdate)
    formData.append('modeofbooking', this.modes)


    this.http.post("https://cureplus.online/APIs/booking.php", formData)
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(res => {
        console.log(res)
        if (res) {
          console.log('hi')
          this.router.navigateByUrl('/bill/' + res);
          //this.popup("Your booking Succesfull")
        }
        else {
          this.popup("something went Wrong")
        }

      })
  }
  goBack() {
    this.nav.back();
  }
  async popup(messgae) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert',
      // subHeader: Coupon+' Coupon Applied',
      message: messgae,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private onError = (error: any) => {

    console.log(error.message);
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  private onGetUPIAppsResponse = (result: any) => {
    // alert('result1'+JSON.stringify(result))
    console.log('result' + JSON.stringify(result));
    // @ts-ignore
    this.handleUPIApps(result);
  };

  private onUPIError = (error: any) => {
    console.log('UPI Error : ' + error.message);
    alert(JSON.stringify(error))
  };

  private changeUPIArray(array: string[]) {
    document.getElementById('upi_icon_containers').innerHTML =
      array.reduce((prevValue, currentValue, index, arrays) => prevValue.concat(currentValue));
    const elements = document.getElementsByClassName('round_icon_buttons');
    for (let i = 0; i < elements.length; i++) {
      const element = elements.item(i);
      element.addEventListener('click', () => {
        this.startPaymentUPI(element.id);
      });
    }
  }
}

function transFormUPIResponse(result) {
  const array = [];
  result.forEach((item) => {
    array.push(new UPIApp(item.id, item.displayName, item.icon));
  }, this);
  return array;
}

class UPIApp {
  private displayName: string;
  private id: string;
  private base64Icon: string;

  constructor(id, displayName, base64Icon) {
    this.id = id;
    this.displayName = displayName;
    this.base64Icon = base64Icon;
  }


}
