/* eslint-disable object-shorthand */
import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import {HTTP} from '@ionic-native/http/ngx';
import {Injectable} from '@angular/core';

const WEB = 'WEB';
const UPI = 'UPI';

const appId = '2357206197e9e6c9b701f94618027532'; //Enter your appId here;
const appSecret = '5c37628572c5c39b56b36b5c09a557a58410e90a'; //Enter your appSecret here (not to be used in your production app. use this in your backend api instead).

const env = 'PROD'; //'TEST' or 'PROD'

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let PgCordovaWrapper: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements AfterViewInit {

  private http: HTTP;

  constructor() {
    this.http = new HTTP();
    this.http.setDataSerializer('json');
  }

  ngAfterViewInit(): void {
    this.getUPIApps();
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
        "orderAmount": "1",
        // eslint-disable-next-line
        "orderCurrency": "INR"
      };
      const headers = {
        'x-client-id': appId,
        'x-client-secret': appSecret,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      this.http.setDataSerializer('json');
      const response = await this.http.post(url, params, headers);

      map.set('token', JSON.parse(response.data).cftoken);
      console.log(JSON.stringify(JSON.parse(response.data))); // JSON data returned by server
      console.log(map.get('token'));
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
        orderAmount: '1',
        orderNote: 'Cashfree Test',
        customerName: 'Cashfree',
        customerPhone: '9089026095',
        customerEmail: 'arjun@cashfree.com',
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
      console.log(error.message);
    });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private onResult = (result: any) => {
    let output = '';
    const resultObject = JSON.parse(result);
    Object.keys(resultObject).forEach((key) => {
      if (key === 'signature') {
        const shortString = resultObject[key].substring(0, 5).concat('...');
        output = output.concat(`${key} : ${shortString} <br>`);
      } else {
        output = output.concat(`${key} : ${resultObject[key]} <br>`);
      }
    });
    document.getElementById('tv_response').innerHTML = output;
  };

  private onError = (error: any) => {
    console.log(error.message);
  };

  // eslint-disable-next-line @typescript-eslint/ban-types
  private onGetUPIAppsResponse = (result: any) => {
    console.log('result' + JSON.stringify(result));
    // @ts-ignore
    this.handleUPIApps(result);
  };

  private onUPIError = (error: any) => {
    console.log('UPI Error : ' + error.message);
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
