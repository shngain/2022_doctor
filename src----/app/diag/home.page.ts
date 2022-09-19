import { Component, OnInit,NgZone } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalController, NavController, ToastController,AlertController } from '@ionic/angular';
import { Router, NavigationStart, Event } from '@angular/router';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs/operators';
import { InteractionService } from '../_services/interaction.service';
import { HomeDataService } from './home-data.service';
import { HttpClient } from '@angular/common/http';
import { Location } from "@angular/common";
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  datess=[]
  darkMode: boolean;
  showPrivacyBanner = true;
  showReminder: boolean;

  row_data = []
  offlinedata=[]
  alert:any
  isOrange=false
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
    private location:Location,
    private alertController:AlertController
  ) { }

  ngOnInit() {
    var someDate = new Date();
    var dd = someDate.getDate();
    var mm = someDate.getMonth();
    var y = someDate.getFullYear();
    var someFormattedDate = dd + '-'+ mm + '-'+ y;
    this.datess.push(someFormattedDate)
    var dd1 = someDate.getDate()+1;
    var mm1 = someDate.getMonth();
    var y1 = someDate.getFullYear();
    var someFormattedDat1 = dd1 + '-'+ mm1 + '-'+ y1;
    this.datess.push(someFormattedDat1)
    var dd2 = someDate.getDate()+2;
    var mm2 = someDate.getMonth();
    var y2 = someDate.getFullYear();
    var someFormattedDate2 = dd2 + '-'+ mm2 + '-'+ y2;
    this.datess.push(someFormattedDate2)
    this.getdata()
    this.getofflinedata()
    this.title.setTitle('Doctor Dashboard');
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
       //this.hideModal();
      }
    })
  }

  ionViewDidEnter() {
    this.store.get('DARK_UI').then((mode) => this.darkMode = mode ? true : false);
    this.store.get('BANN_PRIVACY').then((show) => this.showPrivacyBanner = show !== 'N' ? true : false);
  }

  toggle(){
    if(this.isOrange) {
      this.presentToast('Sort by Name A to Z')
      this.getdata()
     
    }else {
      this.presentToast('Sort by Name Z to A')
       this.getdatadesc()
       
    }
    this.isOrange = !this.isOrange;
  }

  getdata(){
    this.getofflinedata()
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/alldiag.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      var l=0
      this.row_data=[]
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          //console.log(json[0])
          this.row_data.push({
            dataid: 'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
      });
  
    });
  }
  getdatadesc(){
    this.getofflinedata()
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/alldiagdsc.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      var l=0
      this.row_data=[]
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          //console.log(json[0])
          this.row_data.push({
            dataid: 'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
      });
  
    });
  }

  getofflinedata(){
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    this.http.post("https://cureplus.online/APIs/alldiagoffline.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      this.offlinedata=[]
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          console.log(json[0])
          this.offlinedata.push({
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id,
            image:"https://cureplus.online/APIs/upload/"+json[i].image
          })
        }
      });
  
    });
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

  hideBanner() {
    this.showPrivacyBanner = false;
    this.store.set('BANN_PRIVACY', 'N');
  }

  

  
  async presentToast(msg) {
    const toast = await this.toast.create({
      message: msg,
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }


  doRefresh(e) {
  }

  goToProfile() {
    this.hideBanner();
    this.nav.navigateForward('/account/my-profile');
  }
  view_full(id,actualid){
    // var dates = ((document.getElementById(actualid) as HTMLInputElement).value);
   
    // if(dates){
      this.router.navigateByUrl('/allprofiles/'+id+'/diag/'+0);
    // }
    // else{
    //   this.presentToast('Please Select a Date for appointment')
    // }
  }
  goBack(){
    this.location.back();
  }
  async filter() {
    var tttt
    fetch('https://cureplus.online/APIs/filter.php').then(res => res.json())
    .then(async json => {
      //console.log(json)
      this.alert = await this.alertController.create({
        cssClass: 'radio-alert',
        header: 'Select Filter',
        // inputs: [
        //   {"name":"( PAPP-A ) PREGNANCY ASSOCIATED PLASMA PROTEIN-A","type":"radio","label":"( PAPP-A ) PREGNANCY ASSOCIATED PLASMA PROTEIN-A","value":"( PAPP-A ) PREGNANCY ASSOCIATED PLASMA PROTEIN-A"},
        //   {"name":"17-ALPHA-HYDROXYPROGESTERONE","type":"radio","label":"17-ALPHA-HYDROXYPROGESTERONE","value":"17-ALPHA-HYDROXYPROGESTERONE"},
        //   {"name":"24 HOUR URINE CHLORIDE","type":"radio","label":"24 HOUR URINE CHLORIDE","value":"24 HOUR URINE CHLORIDE"},
        //   {"name":"24 HOUR URINE CITRATE","type":"radio","label":"24 HOUR URINE CITRATE","value":"24 HOUR URINE CITRATE"},
        //   {"name":"24 HOUR URINE CREATININE","type":"radio","label":"24 HOUR URINE CREATININE","value":"24 HOUR URINE CREATININE"},
        //   {"name":"24 HOUR URINE HVA","type":"radio","label":"24 HOUR URINE HVA","value":"24 HOUR URINE HVA"},
        //   {"name":"24 HOUR URINE OXALATE","type":"radio","label":"24 HOUR URINE OXALATE","value":"24 HOUR URINE OXALATE"},
        //   {"name":"24 HOUR URINE POTASSIUM","type":"radio","label":"24 HOUR URINE POTASSIUM","value":"24 HOUR URINE POTASSIUM"},
        //   {"name":"24 HOUR URINE PROTEIN CREATININE RATIO","type":"radio","label":"24 HOUR URINE PROTEIN CREATININE RATIO","value":"24 HOUR URINE PROTEIN CREATININE RATIO"},
        //   {"name":"24 HOUR URINE URIC ACID","type":"radio","label":"24 HOUR URINE URIC ACID","value":"24 HOUR URINE URIC ACID"},
        //   {"name":"24 HOURS URINE ALBUMIN ESTIMATION","type":"radio","label":"24 HOURS URINE ALBUMIN ESTIMATION","value":"24 HOURS URINE ALBUMIN ESTIMATION"},
        //   {"name":"24 HOURS URINE CALCIUM","type":"radio","label":"24 HOURS URINE CALCIUM","value":"24 HOURS URINE CALCIUM"},
        //   {"name":"24 HOURS URINE MAGNESIUM","type":"radio","label":"24 HOURS URINE MAGNESIUM","value":"24 HOURS URINE MAGNESIUM"},
        //   {"name":"24 HOURS URINE PROTEIN","type":"radio","label":"24 HOURS URINE PROTEIN","value":"24 HOURS URINE PROTEIN"},
        //   {"name":"24 HOURS URINE SODIUM","type":"radio","label":"24 HOURS URINE SODIUM","value":"24 HOURS URINE SODIUM"},
        //   {"name":"24 HR URINE CATECHOLAMINES","type":"radio","label":"24 HR URINE CATECHOLAMINES","value":"24 HR URINE CATECHOLAMINES"},
        //   {"name":"24 HRS URINE COPPER ESTIMATION","type":"radio","label":"24 HRS URINE COPPER ESTIMATION","value":"24 HRS URINE COPPER ESTIMATION"},
        //   {"name":"24 HRS URINE METANEPHRINS","type":"radio","label":"24 HRS URINE METANEPHRINS","value":"24 HRS URINE METANEPHRINS"},
        //   {"name":"24Hour URINE CREATININE","type":"radio","label":"24Hour URINE CREATININE","value":"24Hour URINE CREATININE"},
        //   {"name":"24HOURS URINE PHOSPHATE","type":"radio","label":"24HOURS URINE PHOSPHATE","value":"24HOURS URINE PHOSPHATE"},
        //   {"name":"24HR URINE FOR ARSENIC","type":"radio","label":"24HR URINE FOR ARSENIC","value":"24HR URINE FOR ARSENIC"},
        //   {"name":"5 HRS GTT","type":"radio","label":"5 HRS GTT","value":"5 HRS GTT"},
        //   {"name":"5 HYDROXY INDOLE ACETIC ACID","type":"radio","label":"5 HYDROXY INDOLE ACETIC ACID","value":"5 HYDROXY INDOLE ACETIC ACID"},
        //   {"name":"ABDOMINAL FLUID FOR AMYLASE","type":"radio","label":"ABDOMINAL FLUID FOR AMYLASE","value":"ABDOMINAL FLUID FOR AMYLASE"},
        //   {"name":"ABG","type":"radio","label":"ABG","value":"ABG"},
        //   {"name":"ACE ( ANGIOTENSIN CONVERTING ENZYME )","type":"radio","label":"ACE ( ANGIOTENSIN CONVERTING ENZYME )","value":"ACE ( ANGIOTENSIN CONVERTING ENZYME )"},
        //   {"name":"ACETYLCHOLINE RECEPTOR AUTO ANTIBODIES","type":"radio","label":"ACETYLCHOLINE RECEPTOR AUTO ANTIBODIES","value":"ACETYLCHOLINE RECEPTOR AUTO ANTIBODIES"},
        //   {"name":"ACHR-ACETYL CHOLINE RECEPTOR ANTIBODIES (SERUM EIA)","type":"radio","label":"ACHR-ACETYL CHOLINE RECEPTOR ANTIBODIES (SERUM EIA)","value":"ACHR-ACETYL CHOLINE RECEPTOR ANTIBODIES (SERUM EIA)"},
        //   {"name":"ACTH STIMULATION TEST","type":"radio","label":"ACTH STIMULATION TEST","value":"ACTH STIMULATION TEST"},
        //   {"name":"ADRENO CORTICOTROPIC HORMONE(ACTH), PLASMA*","type":"radio","label":"ADRENO CORTICOTROPIC HORMONE(ACTH), PLASMA*","value":"ADRENO CORTICOTROPIC HORMONE(ACTH), PLASMA*"},
        //   {"name":"ALBUMIN","type":"radio","label":"ALBUMIN","value":"ALBUMIN"},
        //   {"name":"ALDOLASE","type":"radio","label":"ALDOLASE","value":"ALDOLASE"},
        //   {"name":"ALDOSTERONE","type":"radio","label":"ALDOSTERONE","value":"ALDOSTERONE"},
        //   {"name":"ALKALINE PHOSPHATASE","type":"radio","label":"ALKALINE PHOSPHATASE","value":"ALKALINE PHOSPHATASE"},
        //   {"name":"ALLARGEN PHADIATOP ADULT (ABOVE 5YEARS)","type":"radio","label":"ALLARGEN PHADIATOP ADULT (ABOVE 5YEARS)","value":"ALLARGEN PHADIATOP ADULT (ABOVE 5YEARS)"},
        //   {"name":"ALLARGEN PHADIATOP IN FANT (BELLOW 5YEARS)","type":"radio","label":"ALLARGEN PHADIATOP IN FANT (BELLOW 5YEARS)","value":"ALLARGEN PHADIATOP IN FANT (BELLOW 5YEARS)"},
        //   {"name":"ALLERGEN - COMPREHENSIVE ALLERGY PANEL - INFANCY","type":"radio","label":"ALLERGEN - COMPREHENSIVE ALLERGY PANEL - INFANCY","value":"ALLERGEN - COMPREHENSIVE ALLERGY PANEL - INFANCY"},
        //   {"name":"ALLERGEN-COMPREHENSIVE ALLERGY PANEL (Adult)","type":"radio","label":"ALLERGEN-COMPREHENSIVE ALLERGY PANEL (Adult)","value":"ALLERGEN-COMPREHENSIVE ALLERGY PANEL (Adult)"},
        //   {"name":"ALPHA-FETOPROTEIN","type":"radio","label":"ALPHA-FETOPROTEIN","value":"ALPHA-FETOPROTEIN"},
        //   {"name":"AMA(ANTI MITOCHONDRIAL ANTIBODIES)","type":"radio","label":"AMA(ANTI MITOCHONDRIAL ANTIBODIES)","value":"AMA(ANTI MITOCHONDRIAL ANTIBODIES)"},
        //   {"name":"AMH(Anti-Mullerian Hormone)","type":"radio","label":"AMH(Anti-Mullerian Hormone)","value":"AMH(Anti-Mullerian Hormone)"},
        //   {"name":"ANA (REFLEX TESTING)","type":"radio","label":"ANA (REFLEX TESTING)","value":"ANA (REFLEX TESTING)"},
        //   {"name":"ANA BY IFA , SERUM *","type":"radio","label":"ANA BY IFA , SERUM *","value":"ANA BY IFA , SERUM *"},
        //   {"name":"ANA REFLEX","type":"radio","label":"ANA REFLEX","value":"ANA REFLEX"},
        //   {"name":"ANCA BY IFA REFLEX MPO / PR3*","type":"radio","label":"ANCA BY IFA REFLEX MPO / PR3*","value":"ANCA BY IFA REFLEX MPO / PR3*"},
        //   {"name":"ANCA TITRE BY ELISA","type":"radio","label":"ANCA TITRE BY ELISA","value":"ANCA TITRE BY ELISA"},
        //   {"name":"ANCA(P-ANCA+C-ANCA) WITH TITRE","type":"radio","label":"ANCA(P-ANCA+C-ANCA) WITH TITRE","value":"ANCA(P-ANCA+C-ANCA) WITH TITRE"},
        //   {"name":"ANDROSTENEDIONE","type":"radio","label":"ANDROSTENEDIONE","value":"ANDROSTENEDIONE"},
        //   {"name":"ANTI - PR3 ANTIBODIES","type":"radio","label":"ANTI - PR3 ANTIBODIES","value":"ANTI - PR3 ANTIBODIES"},
        //   {"name":"ANTI ACHR ANTIBODY","type":"radio","label":"ANTI ACHR ANTIBODY","value":"ANTI ACHR ANTIBODY"},
        //   {"name":"ANTI AQUAPORIN-4 / NMO ANTIBODIES (ANTI NEUROMYELITIS OPTICA)","type":"radio","label":"ANTI AQUAPORIN-4 / NMO ANTIBODIES (ANTI NEUROMYELITIS OPTICA)","value":"ANTI AQUAPORIN-4 / NMO ANTIBODIES (ANTI NEUROMYELITIS OPTICA)"},
        //   {"name":"ANTI CYCLIC CITRULLINATED PEPTIDE;ANTI CCP","type":"radio","label":"ANTI CYCLIC CITRULLINATED PEPTIDE;ANTI CCP","value":"ANTI CYCLIC CITRULLINATED PEPTIDE;ANTI CCP"},
        //   {"name":"ANTI DIURETIC HOROMONE (VASOPRESSIN)","type":"radio","label":"ANTI DIURETIC HOROMONE (VASOPRESSIN)","value":"ANTI DIURETIC HOROMONE (VASOPRESSIN)"},
        //   {"name":"ANTI GBM ANTIBODY","type":"radio","label":"ANTI GBM ANTIBODY","value":"ANTI GBM ANTIBODY"},
        //   {"name":"ANTI HCV(ECI)","type":"radio","label":"ANTI HCV(ECI)","value":"ANTI HCV(ECI)"},
        //   {"name":"ANTI ISLET CELL ANTIBODY","type":"radio","label":"ANTI ISLET CELL ANTIBODY","value":"ANTI ISLET CELL ANTIBODY"},
        //   {"name":"ANTI MEASLES IgG & IgM ANTIBODIES","type":"radio","label":"ANTI MEASLES IgG & IgM ANTIBODIES","value":"ANTI MEASLES IgG & IgM ANTIBODIES"},
        //   {"name":"ANTI MEASLES IgG ANTIBODIES","type":"radio","label":"ANTI MEASLES IgG ANTIBODIES","value":"ANTI MEASLES IgG ANTIBODIES"},
        //   {"name":"ANTI MEASLES IgM ANTIBODIES","type":"radio","label":"ANTI MEASLES IgM ANTIBODIES","value":"ANTI MEASLES IgM ANTIBODIES"},
        //   {"name":"ANTI PARIETAL CELL ANTIBODIES (APCA)","type":"radio","label":"ANTI PARIETAL CELL ANTIBODIES (APCA)","value":"ANTI PARIETAL CELL ANTIBODIES (APCA)"},
        //   {"name":"ANTI PHOSPHOLIPASE A2 RECEPTOR (PLA2R) IGG","type":"radio","label":"ANTI PHOSPHOLIPASE A2 RECEPTOR (PLA2R) IGG","value":"ANTI PHOSPHOLIPASE A2 RECEPTOR (PLA2R) IGG"},
        //   {"name":"ANTI PHOSPHOLIPID IgG","type":"radio","label":"ANTI PHOSPHOLIPID IgG","value":"ANTI PHOSPHOLIPID IgG"},
        //   {"name":"ANTI PHOSPHOLIPID IgM","type":"radio","label":"ANTI PHOSPHOLIPID IgM","value":"ANTI PHOSPHOLIPID IgM"},
        //   {"name":"ANTI SARS- COV-2 TOTAL ANTIBODY(QUANTITATIVE)","type":"radio","label":"ANTI SARS- COV-2 TOTAL ANTIBODY(QUANTITATIVE)","value":"ANTI SARS- COV-2 TOTAL ANTIBODY(QUANTITATIVE)"},
        //   {"name":"ANTI THROMBIN III ACTIVITY","type":"radio","label":"ANTI THROMBIN III ACTIVITY","value":"ANTI THROMBIN III ACTIVITY"},
        //   {"name":"ANTI THYROGLOBULIN ANTIBODIES(aTG)","type":"radio","label":"ANTI THYROGLOBULIN ANTIBODIES(aTG)","value":"ANTI THYROGLOBULIN ANTIBODIES(aTG)"},
        //   {"name":"ANTI TPO","type":"radio","label":"ANTI TPO","value":"ANTI TPO"},
        //   {"name":"ANTI TTG","type":"radio","label":"ANTI TTG","value":"ANTI TTG"},
        //   {"name":"ANTI-MPO ANTIBODIES","type":"radio","label":"ANTI-MPO ANTIBODIES","value":"ANTI-MPO ANTIBODIES"},
        //   {"name":"APLA TOTAL","type":"radio","label":"APLA TOTAL","value":"APLA TOTAL"},
        //   {"name":"ARSENIC BLOOD","type":"radio","label":"ARSENIC BLOOD","value":"ARSENIC BLOOD"},
        //   {"name":"ARSENIC URINE SPOT","type":"radio","label":"ARSENIC URINE SPOT","value":"ARSENIC URINE SPOT"},
        //   {"name":"ASCITIC FLUID FOR ADA","type":"radio","label":"ASCITIC FLUID FOR ADA","value":"ASCITIC FLUID FOR ADA"},
        //   {"name":"ASCITIC FLUID FOR ALBUMIN","type":"radio","label":"ASCITIC FLUID FOR ALBUMIN","value":"ASCITIC FLUID FOR ALBUMIN"},
        //   {"name":"ASCITIC FLUID FOR AMYLASE","type":"radio","label":"ASCITIC FLUID FOR AMYLASE","value":"ASCITIC FLUID FOR AMYLASE"},
        //   {"name":"ASCITIC FLUID FOR BILIRUBIN","type":"radio","label":"ASCITIC FLUID FOR BILIRUBIN","value":"ASCITIC FLUID FOR BILIRUBIN"},
        //   {"name":"ASCITIC FLUID FOR CREATININE","type":"radio","label":"ASCITIC FLUID FOR CREATININE","value":"ASCITIC FLUID FOR CREATININE"},
        //   {"name":"ASCITIC FLUID FOR LDH","type":"radio","label":"ASCITIC FLUID FOR LDH","value":"ASCITIC FLUID FOR LDH"},
        //   {"name":"ASCITIC FLUID FOR LIPASE","type":"radio","label":"ASCITIC FLUID FOR LIPASE","value":"ASCITIC FLUID FOR LIPASE"},
        //   {"name":"ASCITIC FLUID FOR PHYSICAL & CHEMICAL EXAMINATION","type":"radio","label":"ASCITIC FLUID FOR PHYSICAL & CHEMICAL EXAMINATION","value":"ASCITIC FLUID FOR PHYSICAL & CHEMICAL EXAMINATION"},
        //   {"name":"ASCITIC FLUID FOR PROTEIN","type":"radio","label":"ASCITIC FLUID FOR PROTEIN","value":"ASCITIC FLUID FOR PROTEIN"},
        //   {"name":"ASCITIC FLUID FOR SUGAR","type":"radio","label":"ASCITIC FLUID FOR SUGAR","value":"ASCITIC FLUID FOR SUGAR"},
        //   {"name":"ASCITIC FLUID FOR TRIGLYCERIDES","type":"radio","label":"ASCITIC FLUID FOR TRIGLYCERIDES","value":"ASCITIC FLUID FOR TRIGLYCERIDES"},
        //   {"name":"ASMA(ANTI SMOOTH MUSCLE ANTIBODIES)","type":"radio","label":"ASMA(ANTI SMOOTH MUSCLE ANTIBODIES)","value":"ASMA(ANTI SMOOTH MUSCLE ANTIBODIES)"},
        //   {"name":"ASOTITRE","type":"radio","label":"ASOTITRE","value":"ASOTITRE"},
        //   {"name":"ASPIRATED FLUID FOR ADA","type":"radio","label":"ASPIRATED FLUID FOR ADA","value":"ASPIRATED FLUID FOR ADA"},
        //   {"name":"ASPIRATED FLUID FOR LDH","type":"radio","label":"ASPIRATED FLUID FOR LDH","value":"ASPIRATED FLUID FOR LDH"},
        //   {"name":"ASPIRATED FLUID FOR PROTEIN","type":"radio","label":"ASPIRATED FLUID FOR PROTEIN","value":"ASPIRATED FLUID FOR PROTEIN"},
        //   {"name":"ASPIRATED FLUID FOR SUGAR","type":"radio","label":"ASPIRATED FLUID FOR SUGAR","value":"ASPIRATED FLUID FOR SUGAR"},
        //   {"name":"AUTOIMMUNE ENCEPHALITIS PANEL","type":"radio","label":"AUTOIMMUNE ENCEPHALITIS PANEL","value":"AUTOIMMUNE ENCEPHALITIS PANEL"},
        //   {"name":"BETA 2 GLYCOPROTEIN IGG","type":"radio","label":"BETA 2 GLYCOPROTEIN IGG","value":"BETA 2 GLYCOPROTEIN IGG"},
        //   {"name":"BETA 2 GLYCOPROTEIN IGM","type":"radio","label":"BETA 2 GLYCOPROTEIN IGM","value":"BETA 2 GLYCOPROTEIN IGM"},
        //   {"name":"BETA 2 MICROGLOBULIN","type":"radio","label":"BETA 2 MICROGLOBULIN","value":"BETA 2 MICROGLOBULIN"},
        //   {"name":"BILIRUBIN FRACTION","type":"radio","label":"BILIRUBIN FRACTION","value":"BILIRUBIN FRACTION"},
        //   {"name":"BILIRUBIN TOTAL","type":"radio","label":"BILIRUBIN TOTAL","value":"BILIRUBIN TOTAL"},
        //   {"name":"BLOOD BANK IQC PROFILE","type":"radio","label":"BLOOD BANK IQC PROFILE","value":"BLOOD BANK IQC PROFILE"},
        //   {"name":"BLOOD GLUCOSE (BY GLUCOMETER - OPD)","type":"radio","label":"BLOOD GLUCOSE (BY GLUCOMETER - OPD)","value":"BLOOD GLUCOSE (BY GLUCOMETER - OPD)"},
        //   {"name":"BLOOD LYMPHO CULTURE","type":"radio","label":"BLOOD LYMPHO CULTURE","value":"BLOOD LYMPHO CULTURE"},
        //   {"name":"BLOOD UREA","type":"radio","label":"BLOOD UREA","value":"BLOOD UREA"},
        //   {"name":"BODY FLUID FOR CPK","type":"radio","label":"BODY FLUID FOR CPK","value":"BODY FLUID FOR CPK"},
        //   {"name":"BODY FLUID FOR CREATININE","type":"radio","label":"BODY FLUID FOR CREATININE","value":"BODY FLUID FOR CREATININE"},
        //   {"name":"BODY FLUID FOR SODIUM & POTASSIUM","type":"radio","label":"BODY FLUID FOR SODIUM & POTASSIUM","value":"BODY FLUID FOR SODIUM & POTASSIUM"},
        //   {"name":"BODY FLUID FOR TC & DLC","type":"radio","label":"BODY FLUID FOR TC & DLC","value":"BODY FLUID FOR TC & DLC"},
        //   {"name":"BODY FLUID FOR TOTAL PROTEIN","type":"radio","label":"BODY FLUID FOR TOTAL PROTEIN","value":"BODY FLUID FOR TOTAL PROTEIN"},
        //   {"name":"BORDETELLA PERTUSSIS IGG ( EIA )","type":"radio","label":"BORDETELLA PERTUSSIS IGG ( EIA )","value":"BORDETELLA PERTUSSIS IGG ( EIA )"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FOR GENEXPERT","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FOR GENEXPERT","value":"BRONCHO ALVEOLAR LAVAGE FOR GENEXPERT"},
        //   {"name":"BRUCELLA IgM & IgG ANTIBODIES","type":"radio","label":"BRUCELLA IgM & IgG ANTIBODIES","value":"BRUCELLA IgM & IgG ANTIBODIES"},
        //   {"name":"BUN (BLOOD UREA NITROGEN)","type":"radio","label":"BUN (BLOOD UREA NITROGEN)","value":"BUN (BLOOD UREA NITROGEN)"},
        //   {"name":"C1 Esterrase Functional","type":"radio","label":"C1 Esterrase Functional","value":"C1 Esterrase Functional"},
        //   {"name":"C3(COMPLEMENT PROTEIN CONCENTRATION)","type":"radio","label":"C3(COMPLEMENT PROTEIN CONCENTRATION)","value":"C3(COMPLEMENT PROTEIN CONCENTRATION)"},
        //   {"name":"C4(COMPLEMENT PROTEIN CONCENTRATION)","type":"radio","label":"C4(COMPLEMENT PROTEIN CONCENTRATION)","value":"C4(COMPLEMENT PROTEIN CONCENTRATION)"},
        //   {"name":"CA125","type":"radio","label":"CA125","value":"CA125"},
        //   {"name":"CA19.9","type":"radio","label":"CA19.9","value":"CA19.9"},
        //   {"name":"CA72.4","type":"radio","label":"CA72.4","value":"CA72.4"},
        //   {"name":"CALCITONIN","type":"radio","label":"CALCITONIN","value":"CALCITONIN"},
        //   {"name":"CALCIUM (SERUM)","type":"radio","label":"CALCIUM (SERUM)","value":"CALCIUM (SERUM)"},
        //   {"name":"CALCIUM,IONIZED,SERUM","type":"radio","label":"CALCIUM,IONIZED,SERUM","value":"CALCIUM,IONIZED,SERUM"},
        //   {"name":"CALPROTECTIN ( STOOL)","type":"radio","label":"CALPROTECTIN ( STOOL)","value":"CALPROTECTIN ( STOOL)"},
        //   {"name":"CARBAMAZEPINE TOTAL","type":"radio","label":"CARBAMAZEPINE TOTAL","value":"CARBAMAZEPINE TOTAL"},
        //   {"name":"CARDIOLIPIN IgG & IgM ANTIBODIES","type":"radio","label":"CARDIOLIPIN IgG & IgM ANTIBODIES","value":"CARDIOLIPIN IgG & IgM ANTIBODIES"},
        //   {"name":"CATECHOLAMINES, PLASMA","type":"radio","label":"CATECHOLAMINES, PLASMA","value":"CATECHOLAMINES, PLASMA"},
        //   {"name":"CEA(CARCINOEMBRYONIC ANTIGEN)","type":"radio","label":"CEA(CARCINOEMBRYONIC ANTIGEN)","value":"CEA(CARCINOEMBRYONIC ANTIGEN)"},
        //   {"name":"CHLAMYDIA TRACHOMATIS IGg ANTIBODIES","type":"radio","label":"CHLAMYDIA TRACHOMATIS IGg ANTIBODIES","value":"CHLAMYDIA TRACHOMATIS IGg ANTIBODIES"},
        //   {"name":"CHLAMYDIA TRACHOMATIS IgM ANTIBODIES","type":"radio","label":"CHLAMYDIA TRACHOMATIS IgM ANTIBODIES","value":"CHLAMYDIA TRACHOMATIS IgM ANTIBODIES"},
        //   {"name":"CHLORIDE","type":"radio","label":"CHLORIDE","value":"CHLORIDE"},
        //   {"name":"CHROMOGRANIN A","type":"radio","label":"CHROMOGRANIN A","value":"CHROMOGRANIN A"},
        //   {"name":"CKMB","type":"radio","label":"CKMB","value":"CKMB"},
        //   {"name":"COMPEHENSIVE MYELOMA PROTEIN PANEL","type":"radio","label":"COMPEHENSIVE MYELOMA PROTEIN PANEL","value":"COMPEHENSIVE MYELOMA PROTEIN PANEL"},
        //   {"name":"COPPER(SERUM)","type":"radio","label":"COPPER(SERUM)","value":"COPPER(SERUM)"},
        //   {"name":"CORTISOL (RANDOM)","type":"radio","label":"CORTISOL (RANDOM)","value":"CORTISOL (RANDOM)"},
        //   {"name":"CORTISOL HDDST","type":"radio","label":"CORTISOL HDDST","value":"CORTISOL HDDST"},
        //   {"name":"CORTISOL LDDST","type":"radio","label":"CORTISOL LDDST","value":"CORTISOL LDDST"},
        //   {"name":"CORTISOL MIDNIGHT","type":"radio","label":"CORTISOL MIDNIGHT","value":"CORTISOL MIDNIGHT"},
        //   {"name":"CORTISOL ONDST","type":"radio","label":"CORTISOL ONDST","value":"CORTISOL ONDST"},
        //   {"name":"CORTISOL PM","type":"radio","label":"CORTISOL PM","value":"CORTISOL PM"},
        //   {"name":"CORTISOL-AM","type":"radio","label":"CORTISOL-AM","value":"CORTISOL-AM"},
        //   {"name":"C-PEPTIDE, SERUM","type":"radio","label":"C-PEPTIDE, SERUM","value":"C-PEPTIDE, SERUM"},
        //   {"name":"C-PEPTIDE, SERUM (AFTER 120 MIN MEAL)","type":"radio","label":"C-PEPTIDE, SERUM (AFTER 120 MIN MEAL)","value":"C-PEPTIDE, SERUM (AFTER 120 MIN MEAL)"},
        //   {"name":"C-PEPTIDE, SERUM (AFTER 60 MIN MEAL)","type":"radio","label":"C-PEPTIDE, SERUM (AFTER 60 MIN MEAL)","value":"C-PEPTIDE, SERUM (AFTER 60 MIN MEAL)"},
        //   {"name":"CPK - CREATINE PHOSPHOKINASE","type":"radio","label":"CPK - CREATINE PHOSPHOKINASE","value":"CPK - CREATINE PHOSPHOKINASE"},
        //   {"name":"C-REACTIVE PROTEIN(CRP)","type":"radio","label":"C-REACTIVE PROTEIN(CRP)","value":"C-REACTIVE PROTEIN(CRP)"},
        //   {"name":"CRYOGLOBULIN QUANTATIVE","type":"radio","label":"CRYOGLOBULIN QUANTATIVE","value":"CRYOGLOBULIN QUANTATIVE"},
        //   {"name":"CSF FLUID FOR PHYSICAL & CHEMICAL EXAMINATION","type":"radio","label":"CSF FLUID FOR PHYSICAL & CHEMICAL EXAMINATION","value":"CSF FLUID FOR PHYSICAL & CHEMICAL EXAMINATION"},
        //   {"name":"CSF FOR ADA","type":"radio","label":"CSF FOR ADA","value":"CSF FOR ADA"},
        //   {"name":"CSF FOR LACTATE","type":"radio","label":"CSF FOR LACTATE","value":"CSF FOR LACTATE"},
        //   {"name":"CSF FOR LDH","type":"radio","label":"CSF FOR LDH","value":"CSF FOR LDH"},
        //   {"name":"CSF FOR PROTEIN","type":"radio","label":"CSF FOR PROTEIN","value":"CSF FOR PROTEIN"},
        //   {"name":"CSF FOR SUGAR","type":"radio","label":"CSF FOR SUGAR","value":"CSF FOR SUGAR"},
        //   {"name":"CSF LACTATE","type":"radio","label":"CSF LACTATE","value":"CSF LACTATE"},
        //   {"name":"CYCLOSPORINE(EDTA/HEPARIN WHOLE BLOOD)","type":"radio","label":"CYCLOSPORINE(EDTA/HEPARIN WHOLE BLOOD)","value":"CYCLOSPORINE(EDTA/HEPARIN WHOLE BLOOD)"},
        //   {"name":"CYSTIC FLUID FOR AMYLASE","type":"radio","label":"CYSTIC FLUID FOR AMYLASE","value":"CYSTIC FLUID FOR AMYLASE"},
        //   {"name":"CYSTIC FLUID FOR CULTURE AND SENSITIVITY (AUTOMATED)","type":"radio","label":"CYSTIC FLUID FOR CULTURE AND SENSITIVITY (AUTOMATED)","value":"CYSTIC FLUID FOR CULTURE AND SENSITIVITY (AUTOMATED)"},
        //   {"name":"CYSTIC FLUID FOR CULTURE AND SENSITIVITY (MANUAL)","type":"radio","label":"CYSTIC FLUID FOR CULTURE AND SENSITIVITY (MANUAL)","value":"CYSTIC FLUID FOR CULTURE AND SENSITIVITY (MANUAL)"},
        //   {"name":"CYSTIC FLUID FOR CYTOLOGICAL EXAMINATION","type":"radio","label":"CYSTIC FLUID FOR CYTOLOGICAL EXAMINATION","value":"CYSTIC FLUID FOR CYTOLOGICAL EXAMINATION"},
        //   {"name":"CYSTIC FLUID FOR LIPASE","type":"radio","label":"CYSTIC FLUID FOR LIPASE","value":"CYSTIC FLUID FOR LIPASE"},
        //   {"name":"CYSTIC FLUID FOR MALIGNANT CELL","type":"radio","label":"CYSTIC FLUID FOR MALIGNANT CELL","value":"CYSTIC FLUID FOR MALIGNANT CELL"},
        //   {"name":"CYSTIC FLUID FOR PHYSICAL & CHEMICAL EXAMINATION","type":"radio","label":"CYSTIC FLUID FOR PHYSICAL & CHEMICAL EXAMINATION","value":"CYSTIC FLUID FOR PHYSICAL & CHEMICAL EXAMINATION"},
        //   {"name":"CYTOGENETICS","type":"radio","label":"CYTOGENETICS","value":"CYTOGENETICS"},
        //   {"name":"D-DIMER","type":"radio","label":"D-DIMER","value":"D-DIMER"},
        //   {"name":"DHEA SULPHATE","type":"radio","label":"DHEA SULPHATE","value":"DHEA SULPHATE"},
        //   {"name":"DI HYDRO TESTOSTERONE","type":"radio","label":"DI HYDRO TESTOSTERONE","value":"DI HYDRO TESTOSTERONE"},
        //   {"name":"DOUBLE MARKER","type":"radio","label":"DOUBLE MARKER","value":"DOUBLE MARKER"},
        //   {"name":"DRAIN SITE DICHARGE FOR CREATININE","type":"radio","label":"DRAIN SITE DICHARGE FOR CREATININE","value":"DRAIN SITE DICHARGE FOR CREATININE"},
        //   {"name":"DsDNA","type":"radio","label":"DsDNA","value":"DsDNA"},
        //   {"name":"EMA","type":"radio","label":"EMA","value":"EMA"},
        //   {"name":"EMA (IGA)","type":"radio","label":"EMA (IGA)","value":"EMA (IGA)"},
        //   {"name":"ENA ( EXTRACTABLE NUCLEAR ANTIGEN )","type":"radio","label":"ENA ( EXTRACTABLE NUCLEAR ANTIGEN )","value":"ENA ( EXTRACTABLE NUCLEAR ANTIGEN )"},
        //   {"name":"ENDOMYSIAL ANTIBODY IgA, SERUM WITH TITRE","type":"radio","label":"ENDOMYSIAL ANTIBODY IgA, SERUM WITH TITRE","value":"ENDOMYSIAL ANTIBODY IgA, SERUM WITH TITRE"},
        //   {"name":"ENDOMYSIAL ANTIBODY IGA, SERUM*","type":"radio","label":"ENDOMYSIAL ANTIBODY IGA, SERUM*","value":"ENDOMYSIAL ANTIBODY IGA, SERUM*"},
        //   {"name":"EPO ASSAY (ERYTHROPOIETIN)","type":"radio","label":"EPO ASSAY (ERYTHROPOIETIN)","value":"EPO ASSAY (ERYTHROPOIETIN)"},
        //   {"name":"EPSTEIN BARR VIRUS (IgG)","type":"radio","label":"EPSTEIN BARR VIRUS (IgG)","value":"EPSTEIN BARR VIRUS (IgG)"},
        //   {"name":"EPSTEIN BARR VIRUS (IgM)","type":"radio","label":"EPSTEIN BARR VIRUS (IgM)","value":"EPSTEIN BARR VIRUS (IgM)"},
        //   {"name":"EPSTEIN BARR VIRUS ANTIBODIES TETRA PANEL (EBV (VCA) IgG, EBV (VCA) IgM)","type":"radio","label":"EPSTEIN BARR VIRUS ANTIBODIES TETRA PANEL (EBV (VCA) IgG, EBV (VCA) IgM)","value":"EPSTEIN BARR VIRUS ANTIBODIES TETRA PANEL (EBV (VCA) IgG, EBV (VCA) IgM)"},
        //   {"name":"ESTRADIOL","type":"radio","label":"ESTRADIOL","value":"ESTRADIOL"},
        //   {"name":"EXTENDED KFT/RFT","type":"radio","label":"EXTENDED KFT/RFT","value":"EXTENDED KFT/RFT"},
        //   {"name":"FACTOR IX ACTIVITY","type":"radio","label":"FACTOR IX ACTIVITY","value":"FACTOR IX ACTIVITY"},
        //   {"name":"FACTOR V MUTATION DETECTION","type":"radio","label":"FACTOR V MUTATION DETECTION","value":"FACTOR V MUTATION DETECTION"},
        //   {"name":"FACTOR VIII ACTIVITY","type":"radio","label":"FACTOR VIII ACTIVITY","value":"FACTOR VIII ACTIVITY"},
        //   {"name":"FACTOR XIII ACTIVITY","type":"radio","label":"FACTOR XIII ACTIVITY","value":"FACTOR XIII ACTIVITY"},
        //   {"name":"FERRITIN","type":"radio","label":"FERRITIN","value":"FERRITIN"},
        //   {"name":"FIBROSIS-4 SCORE","type":"radio","label":"FIBROSIS-4 SCORE","value":"FIBROSIS-4 SCORE"},
        //   {"name":"FLUID BETA-2 TRANSFERRIN","type":"radio","label":"FLUID BETA-2 TRANSFERRIN","value":"FLUID BETA-2 TRANSFERRIN"},
        //   {"name":"FOLIC ACID","type":"radio","label":"FOLIC ACID","value":"FOLIC ACID"},
        //   {"name":"FREE BETA HCG ( FBHCG )","type":"radio","label":"FREE BETA HCG ( FBHCG )","value":"FREE BETA HCG ( FBHCG )"},
        //   {"name":"FREE LIGHT CHAIN RATIO","type":"radio","label":"FREE LIGHT CHAIN RATIO","value":"FREE LIGHT CHAIN RATIO"},
        //   {"name":"FREE T3","type":"radio","label":"FREE T3","value":"FREE T3"},
        //   {"name":"FREE T4","type":"radio","label":"FREE T4","value":"FREE T4"},
        //   {"name":"FSH","type":"radio","label":"FSH","value":"FSH"},
        //   {"name":"G6PD QUALITATIVE(SCREENING)","type":"radio","label":"G6PD QUALITATIVE(SCREENING)","value":"G6PD QUALITATIVE(SCREENING)"},
        //   {"name":"G6PD QUANTITATIVE","type":"radio","label":"G6PD QUANTITATIVE","value":"G6PD QUANTITATIVE"},
        //   {"name":"GAD ANTIBODY","type":"radio","label":"GAD ANTIBODY","value":"GAD ANTIBODY"},
        //   {"name":"GALACTOMANNAN","type":"radio","label":"GALACTOMANNAN","value":"GALACTOMANNAN"},
        //   {"name":"GCT ( 1 SAMPLE AT 60 MINS AFTER 50 GMS OF GLUCOSE)-WHO METHOD IN PREGNANCY","type":"radio","label":"GCT ( 1 SAMPLE AT 60 MINS AFTER 50 GMS OF GLUCOSE)-WHO METHOD IN PREGNANCY","value":"GCT ( 1 SAMPLE AT 60 MINS AFTER 50 GMS OF GLUCOSE)-WHO METHOD IN PREGNANCY"},
        //   {"name":"GCT( 1 SAMPLE AT 120 MINS AFTER 75 GMS OF GLUCOSE)-DIPSI METHOD IN PREGNANCY","type":"radio","label":"GCT( 1 SAMPLE AT 120 MINS AFTER 75 GMS OF GLUCOSE)-DIPSI METHOD IN PREGNANCY","value":"GCT( 1 SAMPLE AT 120 MINS AFTER 75 GMS OF GLUCOSE)-DIPSI METHOD IN PREGNANCY"},
        //   {"name":"GGTP","type":"radio","label":"GGTP","value":"GGTP"},
        //   {"name":"GLOBULIN","type":"radio","label":"GLOBULIN","value":"GLOBULIN"},
        //   {"name":"GLUCOSE ( RANDOM )","type":"radio","label":"GLUCOSE ( RANDOM )","value":"GLUCOSE ( RANDOM )"},
        //   {"name":"GLUCOSE (FASTING )","type":"radio","label":"GLUCOSE (FASTING )","value":"GLUCOSE (FASTING )"},
        //   {"name":"GLUCOSE (P.P. )","type":"radio","label":"GLUCOSE (P.P. )","value":"GLUCOSE (P.P. )"},
        //   {"name":"GROWTH HORMONE (GH)","type":"radio","label":"GROWTH HORMONE (GH)","value":"GROWTH HORMONE (GH)"},
        //   {"name":"GROWTH HORMONE 45 minit & 90 mint","type":"radio","label":"GROWTH HORMONE 45 minit & 90 mint","value":"GROWTH HORMONE 45 minit & 90 mint"},
        //   {"name":"GROWTH HORMONE FASTING","type":"radio","label":"GROWTH HORMONE FASTING","value":"GROWTH HORMONE FASTING"},
        //   {"name":"GROWTH HORMONE FASTING 45 MINS AND 90 MINS","type":"radio","label":"GROWTH HORMONE FASTING 45 MINS AND 90 MINS","value":"GROWTH HORMONE FASTING 45 MINS AND 90 MINS"},
        //   {"name":"GROWTH HORMONE SUPRESSION TEST","type":"radio","label":"GROWTH HORMONE SUPRESSION TEST","value":"GROWTH HORMONE SUPRESSION TEST"},
        //   {"name":"GTT (GLUCOSE TOLERANCE TEST - FASTING & PP)","type":"radio","label":"GTT (GLUCOSE TOLERANCE TEST - FASTING & PP)","value":"GTT (GLUCOSE TOLERANCE TEST - FASTING & PP)"},
        //   {"name":"GTT (GLUCOSE TOLERANCE TEST - FASTING, 30 MIN, 60 MIN, 90 MIN & 120 MIN)","type":"radio","label":"GTT (GLUCOSE TOLERANCE TEST - FASTING, 30 MIN, 60 MIN, 90 MIN & 120 MIN)","value":"GTT (GLUCOSE TOLERANCE TEST - FASTING, 30 MIN, 60 MIN, 90 MIN & 120 MIN)"},
        //   {"name":"HB TYPING (HPLC) / ELECTROPHORESIS","type":"radio","label":"HB TYPING (HPLC) / ELECTROPHORESIS","value":"HB TYPING (HPLC) / ELECTROPHORESIS"},
        //   {"name":"HBA1C","type":"radio","label":"HBA1C","value":"HBA1C"},
        //   {"name":"HBeAG REFLEX","type":"radio","label":"HBeAG REFLEX","value":"HBeAG REFLEX"},
        //   {"name":"HBSAG SCREENING (ECI)","type":"radio","label":"HBSAG SCREENING (ECI)","value":"HBSAG SCREENING (ECI)"},
        //   {"name":"HBV DNA BY PCR","type":"radio","label":"HBV DNA BY PCR","value":"HBV DNA BY PCR"},
        //   {"name":"HDL DIRECT","type":"radio","label":"HDL DIRECT","value":"HDL DIRECT"},
        //   {"name":"HEPATITIS B SURFACE ANTIBODY(HBsAB),TOTAL WITH TITER","type":"radio","label":"HEPATITIS B SURFACE ANTIBODY(HBsAB),TOTAL WITH TITER","value":"HEPATITIS B SURFACE ANTIBODY(HBsAB),TOTAL WITH TITER"},
        //   {"name":"HISTOPTH REFLEX TO CUSTOM IHC PANEL OTHER","type":"radio","label":"HISTOPTH REFLEX TO CUSTOM IHC PANEL OTHER","value":"HISTOPTH REFLEX TO CUSTOM IHC PANEL OTHER"},
        //   {"name":"HLAB27","type":"radio","label":"HLAB27","value":"HLAB27"},
        //   {"name":"HLAB27 (PCR)","type":"radio","label":"HLAB27 (PCR)","value":"HLAB27 (PCR)"},
        //   {"name":"HOMOCYSTEINE","type":"radio","label":"HOMOCYSTEINE","value":"HOMOCYSTEINE"},
        //   {"name":"I STAT PT/INR CARTRIAGE","type":"radio","label":"I STAT PT/INR CARTRIAGE","value":"I STAT PT/INR CARTRIAGE"},
        //   {"name":"IgA","type":"radio","label":"IgA","value":"IgA"},
        //   {"name":"IgD HEAVY CHAIN (SURFACE)","type":"radio","label":"IgD HEAVY CHAIN (SURFACE)","value":"IgD HEAVY CHAIN (SURFACE)"},
        //   {"name":"IGF BINDING PROTEIN 3 (IGF BP3)","type":"radio","label":"IGF BINDING PROTEIN 3 (IGF BP3)","value":"IGF BINDING PROTEIN 3 (IGF BP3)"},
        //   {"name":"IgG","type":"radio","label":"IgG","value":"IgG"},
        //   {"name":"IgG(TOTAL)","type":"radio","label":"IgG(TOTAL)","value":"IgG(TOTAL)"},
        //   {"name":"IGG4","type":"radio","label":"IGG4","value":"IGG4"},
        //   {"name":"IgM","type":"radio","label":"IgM","value":"IgM"},
        //   {"name":"IL-6 (INTERLEUKIN-6)","type":"radio","label":"IL-6 (INTERLEUKIN-6)","value":"IL-6 (INTERLEUKIN-6)"},
        //   {"name":"ILD TOTAL","type":"radio","label":"ILD TOTAL","value":"ILD TOTAL"},
        //   {"name":"IN. PHOSPHORUS","type":"radio","label":"IN. PHOSPHORUS","value":"IN. PHOSPHORUS"},
        //   {"name":"INFLUENZA VIRUS B IGG","type":"radio","label":"INFLUENZA VIRUS B IGG","value":"INFLUENZA VIRUS B IGG"},
        //   {"name":"INFLUENZA VIRUS B IGM","type":"radio","label":"INFLUENZA VIRUS B IGM","value":"INFLUENZA VIRUS B IGM"},
        //   {"name":"INHIBIN B","type":"radio","label":"INHIBIN B","value":"INHIBIN B"},
        //   {"name":"INSULIN (FASTING)","type":"radio","label":"INSULIN (FASTING)","value":"INSULIN (FASTING)"},
        //   {"name":"INSULIN LIKE GROWTH FACTOR-1(IGF-1)","type":"radio","label":"INSULIN LIKE GROWTH FACTOR-1(IGF-1)","value":"INSULIN LIKE GROWTH FACTOR-1(IGF-1)"},
        //   {"name":"INTRINSIC FACTOR IGG SERUM","type":"radio","label":"INTRINSIC FACTOR IGG SERUM","value":"INTRINSIC FACTOR IGG SERUM"},
        //   {"name":"IPTH","type":"radio","label":"IPTH","value":"IPTH"},
        //   {"name":"IRON PROFILE","type":"radio","label":"IRON PROFILE","value":"IRON PROFILE"},
        //   {"name":"IRON, SERUM (FE)","type":"radio","label":"IRON, SERUM (FE)","value":"IRON, SERUM (FE)"},
        //   {"name":"JAK REFLEX (PV JAK 2 REFLEX PANEL)","type":"radio","label":"JAK REFLEX (PV JAK 2 REFLEX PANEL)","value":"JAK REFLEX (PV JAK 2 REFLEX PANEL)"},
        //   {"name":"KARYO TYPING : BLOOD LYMPHO CULTURE","type":"radio","label":"KARYO TYPING : BLOOD LYMPHO CULTURE","value":"KARYO TYPING : BLOOD LYMPHO CULTURE"},
        //   {"name":"KFT/RFT","type":"radio","label":"KFT/RFT","value":"KFT/RFT"},
        //   {"name":"KIDNEY STONE ANALYSIS","type":"radio","label":"KIDNEY STONE ANALYSIS","value":"KIDNEY STONE ANALYSIS"},
        //   {"name":"LDL - CHOLESTEROL","type":"radio","label":"LDL - CHOLESTEROL","value":"LDL - CHOLESTEROL"},
        //   {"name":"LDL DIRECT","type":"radio","label":"LDL DIRECT","value":"LDL DIRECT"},
        //   {"name":"LEAD BLOOD","type":"radio","label":"LEAD BLOOD","value":"LEAD BLOOD"},
        //   {"name":"LEAD(BLOOD)","type":"radio","label":"LEAD(BLOOD)","value":"LEAD(BLOOD)"},
        //   {"name":"LH","type":"radio","label":"LH","value":"LH"},
        //   {"name":"LIPASE","type":"radio","label":"LIPASE","value":"LIPASE"},
        //   {"name":"LIPID PROFILE","type":"radio","label":"LIPID PROFILE","value":"LIPID PROFILE"},
        //   {"name":"LIPID PROFILE (NON FASTING)","type":"radio","label":"LIPID PROFILE (NON FASTING)","value":"LIPID PROFILE (NON FASTING)"},
        //   {"name":"LITHIUM","type":"radio","label":"LITHIUM","value":"LITHIUM"},
        //   {"name":"LIVER FUNCTION TEST","type":"radio","label":"LIVER FUNCTION TEST","value":"LIVER FUNCTION TEST"},
        //   {"name":"LKM1 (LIVER KIDNEY MICROSOME 1)","type":"radio","label":"LKM1 (LIVER KIDNEY MICROSOME 1)","value":"LKM1 (LIVER KIDNEY MICROSOME 1)"},
        //   {"name":"LUPUS ANTICOAGULANT","type":"radio","label":"LUPUS ANTICOAGULANT","value":"LUPUS ANTICOAGULANT"},
        //   {"name":"LYME DISEASE(BORRELLA BURGDORFERI IGG)","type":"radio","label":"LYME DISEASE(BORRELLA BURGDORFERI IGG)","value":"LYME DISEASE(BORRELLA BURGDORFERI IGG)"},
        //   {"name":"LYME DISEASE(BORRELLA BURGDORFERI IGM)","type":"radio","label":"LYME DISEASE(BORRELLA BURGDORFERI IGM)","value":"LYME DISEASE(BORRELLA BURGDORFERI IGM)"},
        //   {"name":"MAGNESIUM (SERUM)","type":"radio","label":"MAGNESIUM (SERUM)","value":"MAGNESIUM (SERUM)"},
        //   {"name":"MERCURY,24 HRS URINE","type":"radio","label":"MERCURY,24 HRS URINE","value":"MERCURY,24 HRS URINE"},
        //   {"name":"MERCURY,SERUM","type":"radio","label":"MERCURY,SERUM","value":"MERCURY,SERUM"},
        //   {"name":"MERCURY,URINE SPOT","type":"radio","label":"MERCURY,URINE SPOT","value":"MERCURY,URINE SPOT"},
        //   {"name":"METANEPHRINE FREE PLASMA","type":"radio","label":"METANEPHRINE FREE PLASMA","value":"METANEPHRINE FREE PLASMA"},
        //   {"name":"MICRAL TEST","type":"radio","label":"MICRAL TEST","value":"MICRAL TEST"},
        //   {"name":"MPN REDLEX PANEL","type":"radio","label":"MPN REDLEX PANEL","value":"MPN REDLEX PANEL"},
        //   {"name":"MPN REFLEX PANEL","type":"radio","label":"MPN REFLEX PANEL","value":"MPN REFLEX PANEL"},
        //   {"name":"MUSK ANTIBODY (SERUM) RIA","type":"radio","label":"MUSK ANTIBODY (SERUM) RIA","value":"MUSK ANTIBODY (SERUM) RIA"},
        //   {"name":"MYOGLOBIN","type":"radio","label":"MYOGLOBIN","value":"MYOGLOBIN"},
        //   {"name":"MYOGLOBIN URINE","type":"radio","label":"MYOGLOBIN URINE","value":"MYOGLOBIN URINE"},
        //   {"name":"NMO-MOG ANTIBODIES","type":"radio","label":"NMO-MOG ANTIBODIES","value":"NMO-MOG ANTIBODIES"},
        //   {"name":"NON HDL CHOLESTROL","type":"radio","label":"NON HDL CHOLESTROL","value":"NON HDL CHOLESTROL"},
        //   {"name":"NT PRO-BNP","type":"radio","label":"NT PRO-BNP","value":"NT PRO-BNP"},
        //   {"name":"NT PRO-BNP (POC)","type":"radio","label":"NT PRO-BNP (POC)","value":"NT PRO-BNP (POC)"},
        //   {"name":"OGTT (0 - 2Hr, 75gm)","type":"radio","label":"OGTT (0 - 2Hr, 75gm)","value":"OGTT (0 - 2Hr, 75gm)"},
        //   {"name":"OGTT (0-1-2-3 Hr. 100 gm)","type":"radio","label":"OGTT (0-1-2-3 Hr. 100 gm)","value":"OGTT (0-1-2-3 Hr. 100 gm)"},
        //   {"name":"OGTT(0-1-2Hr.75 gm)","type":"radio","label":"OGTT(0-1-2Hr.75 gm)","value":"OGTT(0-1-2Hr.75 gm)"},
        //   {"name":"OGTT-DIPSI (Hexokinase)","type":"radio","label":"OGTT-DIPSI (Hexokinase)","value":"OGTT-DIPSI (Hexokinase)"},
        //   {"name":"OSTEOCALCIN (N MID)","type":"radio","label":"OSTEOCALCIN (N MID)","value":"OSTEOCALCIN (N MID)"},
        //   {"name":"P1NP BETA SROSSLAPS & TOTAL (OSTEOPOROSIS MONITORING)","type":"radio","label":"P1NP BETA SROSSLAPS & TOTAL (OSTEOPOROSIS MONITORING)","value":"P1NP BETA SROSSLAPS & TOTAL (OSTEOPOROSIS MONITORING)"},
        //   {"name":"P1NP TOTAL (OSTEOPOROSIS MONITORING)","type":"radio","label":"P1NP TOTAL (OSTEOPOROSIS MONITORING)","value":"P1NP TOTAL (OSTEOPOROSIS MONITORING)"},
        //   {"name":"PANCREATIC FLUID LDH","type":"radio","label":"PANCREATIC FLUID LDH","value":"PANCREATIC FLUID LDH"},
        //   {"name":"PANCREATIC FLUID AMYLASE","type":"radio","label":"PANCREATIC FLUID AMYLASE","value":"PANCREATIC FLUID AMYLASE"},
        //   {"name":"PANCREATIC FLUID FOR ADA","type":"radio","label":"PANCREATIC FLUID FOR ADA","value":"PANCREATIC FLUID FOR ADA"},
        //   {"name":"PANCREATIC FLUID FOR LDH","type":"radio","label":"PANCREATIC FLUID FOR LDH","value":"PANCREATIC FLUID FOR LDH"},
        //   {"name":"PANCREATIC FLUID FOR PROTEIN","type":"radio","label":"PANCREATIC FLUID FOR PROTEIN","value":"PANCREATIC FLUID FOR PROTEIN"},
        //   {"name":"PANCREATIC FLUID FOR SUGAR","type":"radio","label":"PANCREATIC FLUID FOR SUGAR","value":"PANCREATIC FLUID FOR SUGAR"},
        //   {"name":"PARITONEAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION","type":"radio","label":"PARITONEAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION","value":"PARITONEAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION"},
        //   {"name":"PARVOVIRUS B19 IgG","type":"radio","label":"PARVOVIRUS B19 IgG","value":"PARVOVIRUS B19 IgG"},
        //   {"name":"PARVOVIRUS B19 IgM","type":"radio","label":"PARVOVIRUS B19 IgM","value":"PARVOVIRUS B19 IgM"},
        //   {"name":"PAS STAINING","type":"radio","label":"PAS STAINING","value":"PAS STAINING"},
        //   {"name":"PCOD PANEL","type":"radio","label":"PCOD PANEL","value":"PCOD PANEL"},
        //   {"name":"PERICARDIAL FLUID FOR ADA","type":"radio","label":"PERICARDIAL FLUID FOR ADA","value":"PERICARDIAL FLUID FOR ADA"},
        //   {"name":"PERICARDIAL FLUID FOR DLC","type":"radio","label":"PERICARDIAL FLUID FOR DLC","value":"PERICARDIAL FLUID FOR DLC"},
        //   {"name":"PERICARDIAL FLUID FOR LDH","type":"radio","label":"PERICARDIAL FLUID FOR LDH","value":"PERICARDIAL FLUID FOR LDH"},
        //   {"name":"PERICARDIAL FLUID FOR PROTEIN","type":"radio","label":"PERICARDIAL FLUID FOR PROTEIN","value":"PERICARDIAL FLUID FOR PROTEIN"},
        //   {"name":"PERICARDIAL FLUID FOR SUGAR","type":"radio","label":"PERICARDIAL FLUID FOR SUGAR","value":"PERICARDIAL FLUID FOR SUGAR"},
        //   {"name":"PERICARDIAL FLUID FOR TC","type":"radio","label":"PERICARDIAL FLUID FOR TC","value":"PERICARDIAL FLUID FOR TC"},
        //   {"name":"PERITONEAL DIALYSIS FLUID FOR SUGAR","type":"radio","label":"PERITONEAL DIALYSIS FLUID FOR SUGAR","value":"PERITONEAL DIALYSIS FLUID FOR SUGAR"},
        //   {"name":"PERITONEAL FLUID FOR UREA ESTIMATION","type":"radio","label":"PERITONEAL FLUID FOR UREA ESTIMATION","value":"PERITONEAL FLUID FOR UREA ESTIMATION"},
        //   {"name":"PET TEST (DIALYSATE FLUID ESTIMATION)","type":"radio","label":"PET TEST (DIALYSATE FLUID ESTIMATION)","value":"PET TEST (DIALYSATE FLUID ESTIMATION)"},
        //   {"name":"PET TEST-4 (DIALYSATE FLUID ESTIMATION)","type":"radio","label":"PET TEST-4 (DIALYSATE FLUID ESTIMATION)","value":"PET TEST-4 (DIALYSATE FLUID ESTIMATION)"},
        //   {"name":"PGLPG (INTAKE OF GLUCOSE 75 MG, AFTER 2 HOURS SAM","type":"radio","label":"PGLPG (INTAKE OF GLUCOSE 75 MG, AFTER 2 HOURS SAM","value":"PGLPG (INTAKE OF GLUCOSE 75 MG, AFTER 2 HOURS SAM"},
        //   {"name":"PHENYTOIN","type":"radio","label":"PHENYTOIN","value":"PHENYTOIN"},
        //   {"name":"PLASMA AMMONIA","type":"radio","label":"PLASMA AMMONIA","value":"PLASMA AMMONIA"},
        //   {"name":"PLASMA LACTATE","type":"radio","label":"PLASMA LACTATE","value":"PLASMA LACTATE"},
        //   {"name":"PLASMA RENIN","type":"radio","label":"PLASMA RENIN","value":"PLASMA RENIN"},
        //   {"name":"PLEURAL FLUID FOR PROTEIN","type":"radio","label":"PLEURAL FLUID FOR PROTEIN","value":"PLEURAL FLUID FOR PROTEIN"},
        //   {"name":"PLEURAL FLUID FOR ADA","type":"radio","label":"PLEURAL FLUID FOR ADA","value":"PLEURAL FLUID FOR ADA"},
        //   {"name":"PLEURAL FLUID FOR ALBUMIN","type":"radio","label":"PLEURAL FLUID FOR ALBUMIN","value":"PLEURAL FLUID FOR ALBUMIN"},
        //   {"name":"PLEURAL FLUID FOR CHLORIDE","type":"radio","label":"PLEURAL FLUID FOR CHLORIDE","value":"PLEURAL FLUID FOR CHLORIDE"},
        //   {"name":"PLEURAL FLUID FOR LDH","type":"radio","label":"PLEURAL FLUID FOR LDH","value":"PLEURAL FLUID FOR LDH"},
        //   {"name":"PLEURAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION","type":"radio","label":"PLEURAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION","value":"PLEURAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION"},
        //   {"name":"PLEURAL FLUID FOR SUGAR","type":"radio","label":"PLEURAL FLUID FOR SUGAR","value":"PLEURAL FLUID FOR SUGAR"},
        //   {"name":"PLEURIAL FLUID FOR CHOLESTEROL","type":"radio","label":"PLEURIAL FLUID FOR CHOLESTEROL","value":"PLEURIAL FLUID FOR CHOLESTEROL"},
        //   {"name":"PLEURIAL FLUID FOR TRIGLYCERIDES","type":"radio","label":"PLEURIAL FLUID FOR TRIGLYCERIDES","value":"PLEURIAL FLUID FOR TRIGLYCERIDES"},
        //   {"name":"PLURAL FLUID FOR AMYLASE","type":"radio","label":"PLURAL FLUID FOR AMYLASE","value":"PLURAL FLUID FOR AMYLASE"},
        //   {"name":"PLURAL FLUID FOR CHOLESTROL","type":"radio","label":"PLURAL FLUID FOR CHOLESTROL","value":"PLURAL FLUID FOR CHOLESTROL"},
        //   {"name":"PLURAL FLUID FOR LIPASE","type":"radio","label":"PLURAL FLUID FOR LIPASE","value":"PLURAL FLUID FOR LIPASE"},
        //   {"name":"POTASSIUM (SERUM)","type":"radio","label":"POTASSIUM (SERUM)","value":"POTASSIUM (SERUM)"},
        //   {"name":"PROCALCITONIN","type":"radio","label":"PROCALCITONIN","value":"PROCALCITONIN"},
        //   {"name":"PROGESTERONE","type":"radio","label":"PROGESTERONE","value":"PROGESTERONE"},
        //   {"name":"PROLACTIN","type":"radio","label":"PROLACTIN","value":"PROLACTIN"},
        //   {"name":"PROTEIN C ACTIVITY","type":"radio","label":"PROTEIN C ACTIVITY","value":"PROTEIN C ACTIVITY"},
        //   {"name":"PROTEIN ELCTROPHORESIS REFLEX For M Band","type":"radio","label":"PROTEIN ELCTROPHORESIS REFLEX For M Band","value":"PROTEIN ELCTROPHORESIS REFLEX For M Band"},
        //   {"name":"PROTEIN ELECTROPHORESIS For M Band","type":"radio","label":"PROTEIN ELECTROPHORESIS For M Band","value":"PROTEIN ELECTROPHORESIS For M Band"},
        //   {"name":"PROTEIN S ACTIVITY","type":"radio","label":"PROTEIN S ACTIVITY","value":"PROTEIN S ACTIVITY"},
        //   {"name":"PROTHROMBIN TIME (INSTANT)","type":"radio","label":"PROTHROMBIN TIME (INSTANT)","value":"PROTHROMBIN TIME (INSTANT)"},
        //   {"name":"PSA FREE","type":"radio","label":"PSA FREE","value":"PSA FREE"},
        //   {"name":"PTH (PARATHYROID HORMONE), INTACT","type":"radio","label":"PTH (PARATHYROID HORMONE), INTACT","value":"PTH (PARATHYROID HORMONE), INTACT"},
        //   {"name":"QUADRUPLE MARKER TEST","type":"radio","label":"QUADRUPLE MARKER TEST","value":"QUADRUPLE MARKER TEST"},
        //   {"name":"RA FACTOR (PLEURAL FLUID)","type":"radio","label":"RA FACTOR (PLEURAL FLUID)","value":"RA FACTOR (PLEURAL FLUID)"},
        //   {"name":"RAAS SCREENING PANEL (RENIN & ALDOSTERONE)","type":"radio","label":"RAAS SCREENING PANEL (RENIN & ALDOSTERONE)","value":"RAAS SCREENING PANEL (RENIN & ALDOSTERONE)"},
        //   {"name":"RANDOM URINE ALBUMIN (Quantitative)","type":"radio","label":"RANDOM URINE ALBUMIN (Quantitative)","value":"RANDOM URINE ALBUMIN (Quantitative)"},
        //   {"name":"RANDOM URINE CALCIUM (Quantitative)","type":"radio","label":"RANDOM URINE CALCIUM (Quantitative)","value":"RANDOM URINE CALCIUM (Quantitative)"},
        //   {"name":"RANDOM URINE CREATININE (Quantitative)","type":"radio","label":"RANDOM URINE CREATININE (Quantitative)","value":"RANDOM URINE CREATININE (Quantitative)"},
        //   {"name":"RANDOM URINE POTASSIUM (Quantitative)","type":"radio","label":"RANDOM URINE POTASSIUM (Quantitative)","value":"RANDOM URINE POTASSIUM (Quantitative)"},
        //   {"name":"RANDOM URINE PROTEIN (QUALITATIVE)","type":"radio","label":"RANDOM URINE PROTEIN (QUALITATIVE)","value":"RANDOM URINE PROTEIN (QUALITATIVE)"},
        //   {"name":"RANDOM URINE PROTEIN (Quantitative)","type":"radio","label":"RANDOM URINE PROTEIN (Quantitative)","value":"RANDOM URINE PROTEIN (Quantitative)"},
        //   {"name":"RANDOM URINE SODIUM (Quantitative)","type":"radio","label":"RANDOM URINE SODIUM (Quantitative)","value":"RANDOM URINE SODIUM (Quantitative)"},
        //   {"name":"RETROVIRUS SCREENING TEST","type":"radio","label":"RETROVIRUS SCREENING TEST","value":"RETROVIRUS SCREENING TEST"},
        //   {"name":"RHEUMATOID FACTOR","type":"radio","label":"RHEUMATOID FACTOR","value":"RHEUMATOID FACTOR"},
        //   {"name":"ROUTINE COUNT CSF","type":"radio","label":"ROUTINE COUNT CSF","value":"ROUTINE COUNT CSF"},
        //   {"name":"S.CERULOPLASMIN","type":"radio","label":"S.CERULOPLASMIN","value":"S.CERULOPLASMIN"},
        //   {"name":"S.PROTEIN & FRACTION","type":"radio","label":"S.PROTEIN & FRACTION","value":"S.PROTEIN & FRACTION"},
        //   {"name":"S.PSA","type":"radio","label":"S.PSA","value":"S.PSA"},
        //   {"name":"SALMONELLA TYPHI ANTIGEN (RAPID TEST)","type":"radio","label":"SALMONELLA TYPHI ANTIGEN (RAPID TEST)","value":"SALMONELLA TYPHI ANTIGEN (RAPID TEST)"},
        //   {"name":"SEMEN FRUCTOSE,QUANTITATIVE","type":"radio","label":"SEMEN FRUCTOSE,QUANTITATIVE","value":"SEMEN FRUCTOSE,QUANTITATIVE"},
        //   {"name":"SEROTONIN (SERUM)","type":"radio","label":"SEROTONIN (SERUM)","value":"SEROTONIN (SERUM)"},
        //   {"name":"SERUM AMYLASE","type":"radio","label":"SERUM AMYLASE","value":"SERUM AMYLASE"},
        //   {"name":"SERUM BETA HCG","type":"radio","label":"SERUM BETA HCG","value":"SERUM BETA HCG"},
        //   {"name":"SERUM BICARBONATE","type":"radio","label":"SERUM BICARBONATE","value":"SERUM BICARBONATE"},
        //   {"name":"SERUM CHOLINESTERASE LEVEL","type":"radio","label":"SERUM CHOLINESTERASE LEVEL","value":"SERUM CHOLINESTERASE LEVEL"},
        //   {"name":"SERUM CORTISOL EVENING","type":"radio","label":"SERUM CORTISOL EVENING","value":"SERUM CORTISOL EVENING"},
        //   {"name":"SERUM CREATININE","type":"radio","label":"SERUM CREATININE","value":"SERUM CREATININE"},
        //   {"name":"SERUM DIGOXIN LEVEL","type":"radio","label":"SERUM DIGOXIN LEVEL","value":"SERUM DIGOXIN LEVEL"},
        //   {"name":"SERUM ELECTROLYTES","type":"radio","label":"SERUM ELECTROLYTES","value":"SERUM ELECTROLYTES"},
        //   {"name":"SERUM FOR ADA","type":"radio","label":"SERUM FOR ADA","value":"SERUM FOR ADA"},
        //   {"name":"SERUM GASTRIN (FASTING)","type":"radio","label":"SERUM GASTRIN (FASTING)","value":"SERUM GASTRIN (FASTING)"},
        //   {"name":"SERUM HDL","type":"radio","label":"SERUM HDL","value":"SERUM HDL"},
        //   {"name":"SERUM IGE (ELECTROCHEMILUMINISCENCE)","type":"radio","label":"SERUM IGE (ELECTROCHEMILUMINISCENCE)","value":"SERUM IGE (ELECTROCHEMILUMINISCENCE)"},
        //   {"name":"SERUM IMMUNOFIXATION ELECTROPHORESIS","type":"radio","label":"SERUM IMMUNOFIXATION ELECTROPHORESIS","value":"SERUM IMMUNOFIXATION ELECTROPHORESIS"},
        //   {"name":"SERUM LACTATE","type":"radio","label":"SERUM LACTATE","value":"SERUM LACTATE"},
        //   {"name":"SERUM LDH","type":"radio","label":"SERUM LDH","value":"SERUM LDH"},
        //   {"name":"SERUM OSMOLALITY","type":"radio","label":"SERUM OSMOLALITY","value":"SERUM OSMOLALITY"},
        //   {"name":"SERUM PHENOBARBITONE LEVEL","type":"radio","label":"SERUM PHENOBARBITONE LEVEL","value":"SERUM PHENOBARBITONE LEVEL"},
        //   {"name":"SERUM TOTAL BILE ACIDS","type":"radio","label":"SERUM TOTAL BILE ACIDS","value":"SERUM TOTAL BILE ACIDS"},
        //   {"name":"SERUM VAPROATE LEVEL VALPROIC ACID LEVEL","type":"radio","label":"SERUM VAPROATE LEVEL VALPROIC ACID LEVEL","value":"SERUM VAPROATE LEVEL VALPROIC ACID LEVEL"},
        //   {"name":"SERUM ZINC","type":"radio","label":"SERUM ZINC","value":"SERUM ZINC"},
        //   {"name":"SEX HORMONE BINDING GLOBULIN(SHBG)","type":"radio","label":"SEX HORMONE BINDING GLOBULIN(SHBG)","value":"SEX HORMONE BINDING GLOBULIN(SHBG)"},
        //   {"name":"SGOT (AST)","type":"radio","label":"SGOT (AST)","value":"SGOT (AST)"},
        //   {"name":"SGPT (ALT)","type":"radio","label":"SGPT (ALT)","value":"SGPT (ALT)"},
        //   {"name":"SMITH (SM) IgG ANTIBODIES","type":"radio","label":"SMITH (SM) IgG ANTIBODIES","value":"SMITH (SM) IgG ANTIBODIES"},
        //   {"name":"SODIUM (SERUM)","type":"radio","label":"SODIUM (SERUM)","value":"SODIUM (SERUM)"},
        //   {"name":"SPOT URINE CALCIUM CREATININE RATIO","type":"radio","label":"SPOT URINE CALCIUM CREATININE RATIO","value":"SPOT URINE CALCIUM CREATININE RATIO"},
        //   {"name":"SPOT URINE PHOSPHATE","type":"radio","label":"SPOT URINE PHOSPHATE","value":"SPOT URINE PHOSPHATE"},
        //   {"name":"SPOT/RANDOM URINE CHLORIDE","type":"radio","label":"SPOT/RANDOM URINE CHLORIDE","value":"SPOT/RANDOM URINE CHLORIDE"},
        //   {"name":"STOOL FOR PANCREATIC ELASTASE TEST","type":"radio","label":"STOOL FOR PANCREATIC ELASTASE TEST","value":"STOOL FOR PANCREATIC ELASTASE TEST"},
        //   {"name":"SYNOVIAL FLUID FOR ADA","type":"radio","label":"SYNOVIAL FLUID FOR ADA","value":"SYNOVIAL FLUID FOR ADA"},
        //   {"name":"SYNOVIAL FLUID FOR LDH","type":"radio","label":"SYNOVIAL FLUID FOR LDH","value":"SYNOVIAL FLUID FOR LDH"},
        //   {"name":"SYNOVIAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION","type":"radio","label":"SYNOVIAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION","value":"SYNOVIAL FLUID FOR PHYSICAL EXAMINATION AND CHEMICAL EXAMINATION"},
        //   {"name":"SYNOVIAL FLUID FOR PROTEIN","type":"radio","label":"SYNOVIAL FLUID FOR PROTEIN","value":"SYNOVIAL FLUID FOR PROTEIN"},
        //   {"name":"SYNOVIAL FLUID FOR SUGAR","type":"radio","label":"SYNOVIAL FLUID FOR SUGAR","value":"SYNOVIAL FLUID FOR SUGAR"},
        //   {"name":"T3 ( ELECTROCHEMILUMINISCENCE).","type":"radio","label":"T3 ( ELECTROCHEMILUMINISCENCE).","value":"T3 ( ELECTROCHEMILUMINISCENCE)."},
        //   {"name":"T3,T4,TSH","type":"radio","label":"T3,T4,TSH","value":"T3,T4,TSH"},
        //   {"name":"T4","type":"radio","label":"T4","value":"T4"},
        //   {"name":"TESTOSTERONE FREE*","type":"radio","label":"TESTOSTERONE FREE*","value":"TESTOSTERONE FREE*"},
        //   {"name":"TESTOSTERONE TOTAL","type":"radio","label":"TESTOSTERONE TOTAL","value":"TESTOSTERONE TOTAL"},
        //   {"name":"THROMBOCHECK MINI","type":"radio","label":"THROMBOCHECK MINI","value":"THROMBOCHECK MINI"},
        //   {"name":"THROMBOCHECK PANEL","type":"radio","label":"THROMBOCHECK PANEL","value":"THROMBOCHECK PANEL"},
        //   {"name":"THROMBOCHECK TOTAL","type":"radio","label":"THROMBOCHECK TOTAL","value":"THROMBOCHECK TOTAL"},
        //   {"name":"THYROGLOBULIN","type":"radio","label":"THYROGLOBULIN","value":"THYROGLOBULIN"},
        //   {"name":"THYROID ANTIBODIES SERUM","type":"radio","label":"THYROID ANTIBODIES SERUM","value":"THYROID ANTIBODIES SERUM"},
        //   {"name":"TISSUE TRANSGLUTAMINASE ANTIBODY,IGA TTG ANTIBODY","type":"radio","label":"TISSUE TRANSGLUTAMINASE ANTIBODY,IGA TTG ANTIBODY","value":"TISSUE TRANSGLUTAMINASE ANTIBODY,IGA TTG ANTIBODY"},
        //   {"name":"TMS 47","type":"radio","label":"TMS 47","value":"TMS 47"},
        //   {"name":"TMS 62 IEM PANEL","type":"radio","label":"TMS 62 IEM PANEL","value":"TMS 62 IEM PANEL"},
        //   {"name":"TMS 62 IEM PANEL(FULL PANEL) NEOGEN","type":"radio","label":"TMS 62 IEM PANEL(FULL PANEL) NEOGEN","value":"TMS 62 IEM PANEL(FULL PANEL) NEOGEN"},
        //   {"name":"TORCH IGG and IGM ANTIBODIES EVALUATION ( 10 Parameters)","type":"radio","label":"TORCH IGG and IGM ANTIBODIES EVALUATION ( 10 Parameters)","value":"TORCH IGG and IGM ANTIBODIES EVALUATION ( 10 Parameters)"},
        //   {"name":"TOTAL CHOLESTEROL","type":"radio","label":"TOTAL CHOLESTEROL","value":"TOTAL CHOLESTEROL"},
        //   {"name":"TOTAL IRON BINDING CAPACITY","type":"radio","label":"TOTAL IRON BINDING CAPACITY","value":"TOTAL IRON BINDING CAPACITY"},
        //   {"name":"TOTAL SERUM PROTEIN","type":"radio","label":"TOTAL SERUM PROTEIN","value":"TOTAL SERUM PROTEIN"},
        //   {"name":"TPMT GENOTYPING","type":"radio","label":"TPMT GENOTYPING","value":"TPMT GENOTYPING"},
        //   {"name":"TRANSFERRIN SATURATION","type":"radio","label":"TRANSFERRIN SATURATION","value":"TRANSFERRIN SATURATION"},
        //   {"name":"TRIGLYCERIDES","type":"radio","label":"TRIGLYCERIDES","value":"TRIGLYCERIDES"},
        //   {"name":"TRIPLE MARKER TEST(MATERNAL SCREEN)","type":"radio","label":"TRIPLE MARKER TEST(MATERNAL SCREEN)","value":"TRIPLE MARKER TEST(MATERNAL SCREEN)"},
        //   {"name":"TROPONIN-I","type":"radio","label":"TROPONIN-I","value":"TROPONIN-I"},
        //   {"name":"TROPONIN-I (POC)","type":"radio","label":"TROPONIN-I (POC)","value":"TROPONIN-I (POC)"},
        //   {"name":"TROPONIN-I HS","type":"radio","label":"TROPONIN-I HS","value":"TROPONIN-I HS"},
        //   {"name":"TROPONIN-T","type":"radio","label":"TROPONIN-T","value":"TROPONIN-T"},
        //   {"name":"TSH ( ELECTROCHEMILUMINISCENCE)","type":"radio","label":"TSH ( ELECTROCHEMILUMINISCENCE)","value":"TSH ( ELECTROCHEMILUMINISCENCE)"},
        //   {"name":"TSH RECEPTOR ANTIBODIES","type":"radio","label":"TSH RECEPTOR ANTIBODIES","value":"TSH RECEPTOR ANTIBODIES"},
        //   {"name":"UGTA1 GENE MUTATION","type":"radio","label":"UGTA1 GENE MUTATION","value":"UGTA1 GENE MUTATION"},
        //   {"name":"URIC ACID (SERUM)","type":"radio","label":"URIC ACID (SERUM)","value":"URIC ACID (SERUM)"},
        //   {"name":"URINE - GCMS (TEST CODE - E4631U)","type":"radio","label":"URINE - GCMS (TEST CODE - E4631U)","value":"URINE - GCMS (TEST CODE - E4631U)"},
        //   {"name":"URINE ALBUMIN QUANTITATIV","type":"radio","label":"URINE ALBUMIN QUANTITATIV","value":"URINE ALBUMIN QUANTITATIV"},
        //   {"name":"URINE CREATININE","type":"radio","label":"URINE CREATININE","value":"URINE CREATININE"},
        //   {"name":"URINE FOR ALBUMIN CREATININE RATIO (UACR)","type":"radio","label":"URINE FOR ALBUMIN CREATININE RATIO (UACR)","value":"URINE FOR ALBUMIN CREATININE RATIO (UACR)"},
        //   {"name":"URINE FOR GCMS","type":"radio","label":"URINE FOR GCMS","value":"URINE FOR GCMS"},
        //   {"name":"URINE FOR MICRO ALBUMIN","type":"radio","label":"URINE FOR MICRO ALBUMIN","value":"URINE FOR MICRO ALBUMIN"},
        //   {"name":"URINE FOR PORPHOBILINOGEN","type":"radio","label":"URINE FOR PORPHOBILINOGEN","value":"URINE FOR PORPHOBILINOGEN"},
        //   {"name":"URINE FOR PROTEIN CREATININE RATIO","type":"radio","label":"URINE FOR PROTEIN CREATININE RATIO","value":"URINE FOR PROTEIN CREATININE RATIO"},
        //   {"name":"URINE FOR URIC ACID","type":"radio","label":"URINE FOR URIC ACID","value":"URINE FOR URIC ACID"},
        //   {"name":"URINE OSMOLALITY","type":"radio","label":"URINE OSMOLALITY","value":"URINE OSMOLALITY"},
        //   {"name":"URINE SUGAR FASTING","type":"radio","label":"URINE SUGAR FASTING","value":"URINE SUGAR FASTING"},
        //   {"name":"VASCULAR ENDOTHELIAL GROWTH FACTOR (VEGF)","type":"radio","label":"VASCULAR ENDOTHELIAL GROWTH FACTOR (VEGF)","value":"VASCULAR ENDOTHELIAL GROWTH FACTOR (VEGF)"},
        //   {"name":"VBG","type":"radio","label":"VBG","value":"VBG"},
        //   {"name":"VITAMIN B1","type":"radio","label":"VITAMIN B1","value":"VITAMIN B1"},
        //   {"name":"VITAMIN B12","type":"radio","label":"VITAMIN B12","value":"VITAMIN B12"},
        //   {"name":"VITAMIN B2","type":"radio","label":"VITAMIN B2","value":"VITAMIN B2"},
        //   {"name":"VITAMIN B6 LEVEL","type":"radio","label":"VITAMIN B6 LEVEL","value":"VITAMIN B6 LEVEL"},
        //   {"name":"VITAMIN D (1,25 DIHYDROXY)","type":"radio","label":"VITAMIN D (1,25 DIHYDROXY)","value":"VITAMIN D (1,25 DIHYDROXY)"},
        //   {"name":"VITAMIN D,25(OH)","type":"radio","label":"VITAMIN D,25(OH)","value":"VITAMIN D,25(OH)"},
        //   {"name":"VLDL - CHOLESTEROL","type":"radio","label":"VLDL - CHOLESTEROL","value":"VLDL - CHOLESTEROL"},
        //   {"name":"VMA URINE 24 HOUR","type":"radio","label":"VMA URINE 24 HOUR","value":"VMA URINE 24 HOUR"},
        //   {"name":"WESTERN BLOT-HIV-I ANTIBODIES","type":"radio","label":"WESTERN BLOT-HIV-I ANTIBODIES","value":"WESTERN BLOT-HIV-I ANTIBODIES"},
        //   {"name":"ASCITIC FLUID FOR CYTOLOGY","type":"radio","label":"ASCITIC FLUID FOR CYTOLOGY","value":"ASCITIC FLUID FOR CYTOLOGY"},
        //   {"name":"ASCITIC FLUID FOR DLC","type":"radio","label":"ASCITIC FLUID FOR DLC","value":"ASCITIC FLUID FOR DLC"},
        //   {"name":"ASCITIC FLUID FOR MALIGNANT CELL","type":"radio","label":"ASCITIC FLUID FOR MALIGNANT CELL","value":"ASCITIC FLUID FOR MALIGNANT CELL"},
        //   {"name":"ASCITIC FLUID FOR TC","type":"radio","label":"ASCITIC FLUID FOR TC","value":"ASCITIC FLUID FOR TC"},
        //   {"name":"ASCITIC FOR CYTOLOGICAL EXAMINATION","type":"radio","label":"ASCITIC FOR CYTOLOGICAL EXAMINATION","value":"ASCITIC FOR CYTOLOGICAL EXAMINATION"},
        //   {"name":"ASPIRATED FLUID FOR CYTOLOGY","type":"radio","label":"ASPIRATED FLUID FOR CYTOLOGY","value":"ASPIRATED FLUID FOR CYTOLOGY"},
        //   {"name":"ASPIRATED FLUID FOR MALIGNANT CELL","type":"radio","label":"ASPIRATED FLUID FOR MALIGNANT CELL","value":"ASPIRATED FLUID FOR MALIGNANT CELL"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FOR CYTOLOGY","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FOR CYTOLOGY","value":"BRONCHO ALVEOLAR LAVAGE FOR CYTOLOGY"},
        //   {"name":"C.T./ B.T.","type":"radio","label":"C.T./ B.T.","value":"C.T./ B.T."},
        //   {"name":"CD 19 PERCENT","type":"radio","label":"CD 19 PERCENT","value":"CD 19 PERCENT"},
        //   {"name":"CD 20 PERCENT","type":"radio","label":"CD 20 PERCENT","value":"CD 20 PERCENT"},
        //   {"name":"CD4 COUNT","type":"radio","label":"CD4 COUNT","value":"CD4 COUNT"},
        //   {"name":"CHRONIC LYMPHOPROLIFERATIVE DISORDER PANEL","type":"radio","label":"CHRONIC LYMPHOPROLIFERATIVE DISORDER PANEL","value":"CHRONIC LYMPHOPROLIFERATIVE DISORDER PANEL"},
        //   {"name":"CSF FOR CYTOLOGICAL EXAMINATION","type":"radio","label":"CSF FOR CYTOLOGICAL EXAMINATION","value":"CSF FOR CYTOLOGICAL EXAMINATION"},
        //   {"name":"CSF FOR CYTOLOGY","type":"radio","label":"CSF FOR CYTOLOGY","value":"CSF FOR CYTOLOGY"},
        //   {"name":"CSF FOR DLC","type":"radio","label":"CSF FOR DLC","value":"CSF FOR DLC"},
        //   {"name":"CSF FOR MALIGNANT CELL","type":"radio","label":"CSF FOR MALIGNANT CELL","value":"CSF FOR MALIGNANT CELL"},
        //   {"name":"CSF FOR TC","type":"radio","label":"CSF FOR TC","value":"CSF FOR TC"},
        //   {"name":"CYSTIC FLUID FOR CYTOLOGY","type":"radio","label":"CYSTIC FLUID FOR CYTOLOGY","value":"CYSTIC FLUID FOR CYTOLOGY"},
        //   {"name":"CYSTIC FLUID FOR DLC","type":"radio","label":"CYSTIC FLUID FOR DLC","value":"CYSTIC FLUID FOR DLC"},
        //   {"name":"CYSTIC FLUID FOR TC","type":"radio","label":"CYSTIC FLUID FOR TC","value":"CYSTIC FLUID FOR TC"},
        //   {"name":"CYTOGENETICS : PML Ra Ra t (15:17)","type":"radio","label":"CYTOGENETICS : PML Ra Ra t (15:17)","value":"CYTOGENETICS : PML Ra Ra t (15:17)"},
        //   {"name":"CYTOLOGY CSF","type":"radio","label":"CYTOLOGY CSF","value":"CYTOLOGY CSF"},
        //   {"name":"DIALYSATE FLUID FOR TC & DLC","type":"radio","label":"DIALYSATE FLUID FOR TC & DLC","value":"DIALYSATE FLUID FOR TC & DLC"},
        //   {"name":"DIALYSIS FLUID FOR DLC","type":"radio","label":"DIALYSIS FLUID FOR DLC","value":"DIALYSIS FLUID FOR DLC"},
        //   {"name":"DIALYSIS FLUID FOR TLC","type":"radio","label":"DIALYSIS FLUID FOR TLC","value":"DIALYSIS FLUID FOR TLC"},
        //   {"name":"EXON 12 MUTATION STUDY","type":"radio","label":"EXON 12 MUTATION STUDY","value":"EXON 12 MUTATION STUDY"},
        //   {"name":"FIBRIMOGEN DEGRADATION PRODUCTS (FDP) (SEMI QUANTITATIVE)","type":"radio","label":"FIBRIMOGEN DEGRADATION PRODUCTS (FDP) (SEMI QUANTITATIVE)","value":"FIBRIMOGEN DEGRADATION PRODUCTS (FDP) (SEMI QUANTITATIVE)"},
        //   {"name":"FIBRINOGEN DEGRADATION PRODUCTS ( FDP) ( SEMI QUANTITATIVE )","type":"radio","label":"FIBRINOGEN DEGRADATION PRODUCTS ( FDP) ( SEMI QUANTITATIVE )","value":"FIBRINOGEN DEGRADATION PRODUCTS ( FDP) ( SEMI QUANTITATIVE )"},
        //   {"name":"FIBRINOGEN QUANTITATIVE","type":"radio","label":"FIBRINOGEN QUANTITATIVE","value":"FIBRINOGEN QUANTITATIVE"},
        //   {"name":"FISH FOR 17p (TP53) abnormalities","type":"radio","label":"FISH FOR 17p (TP53) abnormalities","value":"FISH FOR 17p (TP53) abnormalities"},
        //   {"name":"FNAC PROCEDURE CHARGE","type":"radio","label":"FNAC PROCEDURE CHARGE","value":"FNAC PROCEDURE CHARGE"},
        //   {"name":"PANCREATIC FLUID FOR CYTOLOGY","type":"radio","label":"PANCREATIC FLUID FOR CYTOLOGY","value":"PANCREATIC FLUID FOR CYTOLOGY"},
        //   {"name":"PANCREATIC FLUID FOR DLC","type":"radio","label":"PANCREATIC FLUID FOR DLC","value":"PANCREATIC FLUID FOR DLC"},
        //   {"name":"PANCREATIC FLUID FOR MALIGNANT CELL","type":"radio","label":"PANCREATIC FLUID FOR MALIGNANT CELL","value":"PANCREATIC FLUID FOR MALIGNANT CELL"},
        //   {"name":"PANCREATIC FLUID FOR TC","type":"radio","label":"PANCREATIC FLUID FOR TC","value":"PANCREATIC FLUID FOR TC"},
        //   {"name":"PARASITIC LOAD(MALARIAL PARASITE)","type":"radio","label":"PARASITIC LOAD(MALARIAL PARASITE)","value":"PARASITIC LOAD(MALARIAL PARASITE)"},
        //   {"name":"PARITONEAL FLUID FOR CYTOLOGICAL EXAMINATION","type":"radio","label":"PARITONEAL FLUID FOR CYTOLOGICAL EXAMINATION","value":"PARITONEAL FLUID FOR CYTOLOGICAL EXAMINATION"},
        //   {"name":"PERICARDIAL FLUID FOR CYTOLOGY","type":"radio","label":"PERICARDIAL FLUID FOR CYTOLOGY","value":"PERICARDIAL FLUID FOR CYTOLOGY"},
        //   {"name":"PERICARDIAL FLUID FOR MALIGNANT CELL","type":"radio","label":"PERICARDIAL FLUID FOR MALIGNANT CELL","value":"PERICARDIAL FLUID FOR MALIGNANT CELL"},
        //   {"name":"PLEURAL FLUID FOR CYTOLOGY","type":"radio","label":"PLEURAL FLUID FOR CYTOLOGY","value":"PLEURAL FLUID FOR CYTOLOGY"},
        //   {"name":"PLEURAL FLUID FOR CYTOLOGICAL EXAMINATION","type":"radio","label":"PLEURAL FLUID FOR CYTOLOGICAL EXAMINATION","value":"PLEURAL FLUID FOR CYTOLOGICAL EXAMINATION"},
        //   {"name":"PLEURAL FLUID FOR DLC","type":"radio","label":"PLEURAL FLUID FOR DLC","value":"PLEURAL FLUID FOR DLC"},
        //   {"name":"PLEURAL FLUID FOR MALIGNANT CELL","type":"radio","label":"PLEURAL FLUID FOR MALIGNANT CELL","value":"PLEURAL FLUID FOR MALIGNANT CELL"},
        //   {"name":"PLEURAL FLUID FOR PHYSICAL/CHEMICAL ADA CYTOLOGICAL MALIGNANT CELL","type":"radio","label":"PLEURAL FLUID FOR PHYSICAL/CHEMICAL ADA CYTOLOGICAL MALIGNANT CELL","value":"PLEURAL FLUID FOR PHYSICAL/CHEMICAL ADA CYTOLOGICAL MALIGNANT CELL"},
        //   {"name":"PLEURAL FLUID FOR TC","type":"radio","label":"PLEURAL FLUID FOR TC","value":"PLEURAL FLUID FOR TC"},
        //   {"name":"RBC FOLATE","type":"radio","label":"RBC FOLATE","value":"RBC FOLATE"},
        //   {"name":"REDUCING SUBSTANCES IN STOOL","type":"radio","label":"REDUCING SUBSTANCES IN STOOL","value":"REDUCING SUBSTANCES IN STOOL"},
        //   {"name":"SEMEN ANALYSIS.","type":"radio","label":"SEMEN ANALYSIS.","value":"SEMEN ANALYSIS."},
        //   {"name":"SEPSIS SCREEN","type":"radio","label":"SEPSIS SCREEN","value":"SEPSIS SCREEN"},
        //   {"name":"SERUM FREE LIGHT CHAIN","type":"radio","label":"SERUM FREE LIGHT CHAIN","value":"SERUM FREE LIGHT CHAIN"},
        //   {"name":"SPUTUM FOR ASBESTOS BODIES (AB)","type":"radio","label":"SPUTUM FOR ASBESTOS BODIES (AB)","value":"SPUTUM FOR ASBESTOS BODIES (AB)"},
        //   {"name":"STOOL EXAMINATION, OCCULT BLOOD","type":"radio","label":"STOOL EXAMINATION, OCCULT BLOOD","value":"STOOL EXAMINATION, OCCULT BLOOD"},
        //   {"name":"STOOL FOR SCHISTOSOMIASIS","type":"radio","label":"STOOL FOR SCHISTOSOMIASIS","value":"STOOL FOR SCHISTOSOMIASIS"},
        //   {"name":"SYNOVIAL FLUID FOR CYTOLOGICAL EXAMINATION","type":"radio","label":"SYNOVIAL FLUID FOR CYTOLOGICAL EXAMINATION","value":"SYNOVIAL FLUID FOR CYTOLOGICAL EXAMINATION"},
        //   {"name":"SYNOVIAL FLUID FOR CYTOLOGY","type":"radio","label":"SYNOVIAL FLUID FOR CYTOLOGY","value":"SYNOVIAL FLUID FOR CYTOLOGY"},
        //   {"name":"SYNOVIAL FLUID FOR DLC","type":"radio","label":"SYNOVIAL FLUID FOR DLC","value":"SYNOVIAL FLUID FOR DLC"},
        //   {"name":"SYNOVIAL FLUID FOR MALIGNANT CELL","type":"radio","label":"SYNOVIAL FLUID FOR MALIGNANT CELL","value":"SYNOVIAL FLUID FOR MALIGNANT CELL"},
        //   {"name":"SYNOVIAL FLUID FOR TLC","type":"radio","label":"SYNOVIAL FLUID FOR TLC","value":"SYNOVIAL FLUID FOR TLC"},
        //   {"name":"TRACHEAL ASPIRATION FOR MALIGNANT CELL","type":"radio","label":"TRACHEAL ASPIRATION FOR MALIGNANT CELL","value":"TRACHEAL ASPIRATION FOR MALIGNANT CELL"},
        //   {"name":"URINE ALBUMIN QUALITATIVE","type":"radio","label":"URINE ALBUMIN QUALITATIVE","value":"URINE ALBUMIN QUALITATIVE"},
        //   {"name":"URINE BS/BP (BILE SALT / BILE PIGMENT)","type":"radio","label":"URINE BS/BP (BILE SALT / BILE PIGMENT)","value":"URINE BS/BP (BILE SALT / BILE PIGMENT)"},
        //   {"name":"URINE FOR BENCE JONES PROTEIN","type":"radio","label":"URINE FOR BENCE JONES PROTEIN","value":"URINE FOR BENCE JONES PROTEIN"},
        //   {"name":"URINE FOR DYSMORPHIC RBCS","type":"radio","label":"URINE FOR DYSMORPHIC RBCS","value":"URINE FOR DYSMORPHIC RBCS"},
        //   {"name":"URINE FOR EOSINOPHIL","type":"radio","label":"URINE FOR EOSINOPHIL","value":"URINE FOR EOSINOPHIL"},
        //   {"name":"URINE FOR HCG TEST","type":"radio","label":"URINE FOR HCG TEST","value":"URINE FOR HCG TEST"},
        //   {"name":"URINE FOR HEMOSIDERIN","type":"radio","label":"URINE FOR HEMOSIDERIN","value":"URINE FOR HEMOSIDERIN"},
        //   {"name":"URINE FOR KETONE BODIES","type":"radio","label":"URINE FOR KETONE BODIES","value":"URINE FOR KETONE BODIES"},
        //   {"name":"URINE FOR PUS CELLS","type":"radio","label":"URINE FOR PUS CELLS","value":"URINE FOR PUS CELLS"},
        //   {"name":"URINE FOR REDUCING SUBSTANCE","type":"radio","label":"URINE FOR REDUCING SUBSTANCE","value":"URINE FOR REDUCING SUBSTANCE"},
        //   {"name":"URINE FOR SCHISTOSOMIASIS","type":"radio","label":"URINE FOR SCHISTOSOMIASIS","value":"URINE FOR SCHISTOSOMIASIS"},
        //   {"name":"URINE FOR SPECIFIC GRAVITY","type":"radio","label":"URINE FOR SPECIFIC GRAVITY","value":"URINE FOR SPECIFIC GRAVITY"},
        //   {"name":"URINE PH","type":"radio","label":"URINE PH","value":"URINE PH"},
        //   {"name":"URINE R/E","type":"radio","label":"URINE R/E","value":"URINE R/E"},
        //   {"name":"URINE SUGAR (FASTING, PP- 1, 2 & 3 HOUR)","type":"radio","label":"URINE SUGAR (FASTING, PP- 1, 2 & 3 HOUR)","value":"URINE SUGAR (FASTING, PP- 1, 2 & 3 HOUR)"},
        //   {"name":"URINE SUGAR (RANDOM)","type":"radio","label":"URINE SUGAR (RANDOM)","value":"URINE SUGAR (RANDOM)"},
        //   {"name":"URINE SUGAR(PP)","type":"radio","label":"URINE SUGAR(PP)","value":"URINE SUGAR(PP)"},
        //   {"name":"VON WILLEBRAND FACTOR,PLASMA","type":"radio","label":"VON WILLEBRAND FACTOR,PLASMA","value":"VON WILLEBRAND FACTOR,PLASMA"},
        //   {"name":"ASCITIC FLUID FOR CELL COUNT","type":"radio","label":"ASCITIC FLUID FOR CELL COUNT","value":"ASCITIC FLUID FOR CELL COUNT"},
        //   {"name":"BAL FOR MALIGNANT CELL","type":"radio","label":"BAL FOR MALIGNANT CELL","value":"BAL FOR MALIGNANT CELL"},
        //   {"name":"BONE MARROW STUDY (MATRIX)","type":"radio","label":"BONE MARROW STUDY (MATRIX)","value":"BONE MARROW STUDY (MATRIX)"},
        //   {"name":"CYSTIC FLUID FOR PHYSICAL,CHEMICAL AND CYTOLOGICAL EXAMINATION","type":"radio","label":"CYSTIC FLUID FOR PHYSICAL,CHEMICAL AND CYTOLOGICAL EXAMINATION","value":"CYSTIC FLUID FOR PHYSICAL,CHEMICAL AND CYTOLOGICAL EXAMINATION"},
        //   {"name":"IMPRINT CYTOLOGY","type":"radio","label":"IMPRINT CYTOLOGY","value":"IMPRINT CYTOLOGY"},
        //   {"name":"NASAL SMEAR FOR CYTOLOGY","type":"radio","label":"NASAL SMEAR FOR CYTOLOGY","value":"NASAL SMEAR FOR CYTOLOGY"},
        //   {"name":"PERITONEAL DIALYSIS FLUID FOR CELL COUNT","type":"radio","label":"PERITONEAL DIALYSIS FLUID FOR CELL COUNT","value":"PERITONEAL DIALYSIS FLUID FOR CELL COUNT"},
        //   {"name":"PERITONEAL FLUID FOR ADA","type":"radio","label":"PERITONEAL FLUID FOR ADA","value":"PERITONEAL FLUID FOR ADA"},
        //   {"name":"PERITONEAL FLUID FOR PROTEIN","type":"radio","label":"PERITONEAL FLUID FOR PROTEIN","value":"PERITONEAL FLUID FOR PROTEIN"},
        //   {"name":"PERITONEAL FLUID FOR SUGAR","type":"radio","label":"PERITONEAL FLUID FOR SUGAR","value":"PERITONEAL FLUID FOR SUGAR"},
        //   {"name":"PERITONEAL FLUID FOR-DLC","type":"radio","label":"PERITONEAL FLUID FOR-DLC","value":"PERITONEAL FLUID FOR-DLC"},
        //   {"name":"PERITONEAL FLUID FOR-TLC","type":"radio","label":"PERITONEAL FLUID FOR-TLC","value":"PERITONEAL FLUID FOR-TLC"},
        //   {"name":"URINE FOR CYTOLOGY","type":"radio","label":"URINE FOR CYTOLOGY","value":"URINE FOR CYTOLOGY"},
        //   {"name":"URINE FOR MALIGNENT CELL","type":"radio","label":"URINE FOR MALIGNENT CELL","value":"URINE FOR MALIGNENT CELL"},
        //   {"name":"VULVAL SMEAR","type":"radio","label":"VULVAL SMEAR","value":"VULVAL SMEAR"},
        //   {"name":"ACUTE LEUKEMIA PANEL","type":"radio","label":"ACUTE LEUKEMIA PANEL","value":"ACUTE LEUKEMIA PANEL"},
        //   {"name":"CD 4","type":"radio","label":"CD 4","value":"CD 4"},
        //   {"name":"HLA B5 ( 51/52)","type":"radio","label":"HLA B5 ( 51/52)","value":"HLA B5 ( 51/52)"},
        //   {"name":"NON-INVASIVE PRENATAL TESTING (NIPT)","type":"radio","label":"NON-INVASIVE PRENATAL TESTING (NIPT)","value":"NON-INVASIVE PRENATAL TESTING (NIPT)"},
        //   {"name":"ABSOLUTE EOSINOPHIL COUNT (AEC)","type":"radio","label":"ABSOLUTE EOSINOPHIL COUNT (AEC)","value":"ABSOLUTE EOSINOPHIL COUNT (AEC)"},
        //   {"name":"ABSOLUTE LYMPHOCYTE","type":"radio","label":"ABSOLUTE LYMPHOCYTE","value":"ABSOLUTE LYMPHOCYTE"},
        //   {"name":"ABSOLUTE NEUTROPHIL COUNT (ANC)","type":"radio","label":"ABSOLUTE NEUTROPHIL COUNT (ANC)","value":"ABSOLUTE NEUTROPHIL COUNT (ANC)"},
        //   {"name":"ACTIVATED PARTIAL THROMBOPLASTIN TIME(APTT)","type":"radio","label":"ACTIVATED PARTIAL THROMBOPLASTIN TIME(APTT)","value":"ACTIVATED PARTIAL THROMBOPLASTIN TIME(APTT)"},
        //   {"name":"ACUTE LEUKEMIA DIAGNOSTIC & PROGNOSTIC PANEL (ALDP PANEL)","type":"radio","label":"ACUTE LEUKEMIA DIAGNOSTIC & PROGNOSTIC PANEL (ALDP PANEL)","value":"ACUTE LEUKEMIA DIAGNOSTIC & PROGNOSTIC PANEL (ALDP PANEL)"},
        //   {"name":"ACUTE LEUKEMIA MRD PANEL","type":"radio","label":"ACUTE LEUKEMIA MRD PANEL","value":"ACUTE LEUKEMIA MRD PANEL"},
        //   {"name":"ALL FISH PANEL BCR/ABL + (9:22) + TEL/AML + (12:21) + MLL 11q REARRENGEMENT","type":"radio","label":"ALL FISH PANEL BCR/ABL + (9:22) + TEL/AML + (12:21) + MLL 11q REARRENGEMENT","value":"ALL FISH PANEL BCR/ABL + (9:22) + TEL/AML + (12:21) + MLL 11q REARRENGEMENT"},
        //   {"name":"ALPHA THALASSEMIA","type":"radio","label":"ALPHA THALASSEMIA","value":"ALPHA THALASSEMIA"},
        //   {"name":"AML COMPREHENSIVE PANEL","type":"radio","label":"AML COMPREHENSIVE PANEL","value":"AML COMPREHENSIVE PANEL"},
        //   {"name":"AML MOLECULAR PANEL(FLT3+NPM1+CKIT+LTP2)","type":"radio","label":"AML MOLECULAR PANEL(FLT3+NPM1+CKIT+LTP2)","value":"AML MOLECULAR PANEL(FLT3+NPM1+CKIT+LTP2)"},
        //   {"name":"AML WITH NORMAL CYTOGENETICS( FLT3+NPM1+CEBPA)","type":"radio","label":"AML WITH NORMAL CYTOGENETICS( FLT3+NPM1+CEBPA)","value":"AML WITH NORMAL CYTOGENETICS( FLT3+NPM1+CEBPA)"},
        //   {"name":"ASPIRATED FLUID FOR DLC","type":"radio","label":"ASPIRATED FLUID FOR DLC","value":"ASPIRATED FLUID FOR DLC"},
        //   {"name":"ASPIRATED FLUID FOR TC","type":"radio","label":"ASPIRATED FLUID FOR TC","value":"ASPIRATED FLUID FOR TC"},
        //   {"name":"BAND CELL POLY RATIO","type":"radio","label":"BAND CELL POLY RATIO","value":"BAND CELL POLY RATIO"},
        //   {"name":"BLEEDING TIME","type":"radio","label":"BLEEDING TIME","value":"BLEEDING TIME"},
        //   {"name":"BLOOD R/E (COUNT BY AUTOMATIC CELL COUNTER)","type":"radio","label":"BLOOD R/E (COUNT BY AUTOMATIC CELL COUNTER)","value":"BLOOD R/E (COUNT BY AUTOMATIC CELL COUNTER)"},
        //   {"name":"BLOOD RE2 (WITH ESR 2ND HOUR)","type":"radio","label":"BLOOD RE2 (WITH ESR 2ND HOUR)","value":"BLOOD RE2 (WITH ESR 2ND HOUR)"},
        //   {"name":"BONE MARROW FAILURE SYNDROME GENE PANEL","type":"radio","label":"BONE MARROW FAILURE SYNDROME GENE PANEL","value":"BONE MARROW FAILURE SYNDROME GENE PANEL"},
        //   {"name":"CBC","type":"radio","label":"CBC","value":"CBC"},
        //   {"name":"CLOTTING TIME","type":"radio","label":"CLOTTING TIME","value":"CLOTTING TIME"},
        //   {"name":"CYTOGENETICS:MDS PANEL","type":"radio","label":"CYTOGENETICS:MDS PANEL","value":"CYTOGENETICS:MDS PANEL"},
        //   {"name":"DLC","type":"radio","label":"DLC","value":"DLC"},
        //   {"name":"ESR","type":"radio","label":"ESR","value":"ESR"},
        //   {"name":"HAEMOGLOBIN","type":"radio","label":"HAEMOGLOBIN","value":"HAEMOGLOBIN"},
        //   {"name":"MCH","type":"radio","label":"MCH","value":"MCH"},
        //   {"name":"MCH ( AUTOMATIC CELL COUNTER)","type":"radio","label":"MCH ( AUTOMATIC CELL COUNTER)","value":"MCH ( AUTOMATIC CELL COUNTER)"},
        //   {"name":"MCHC","type":"radio","label":"MCHC","value":"MCHC"},
        //   {"name":"MCHC ( AUTOMATIC CELL COUNTER)","type":"radio","label":"MCHC ( AUTOMATIC CELL COUNTER)","value":"MCHC ( AUTOMATIC CELL COUNTER)"},
        //   {"name":"MCV","type":"radio","label":"MCV","value":"MCV"},
        //   {"name":"MCV ( AUTOMATIC CELL COUNTER)","type":"radio","label":"MCV ( AUTOMATIC CELL COUNTER)","value":"MCV ( AUTOMATIC CELL COUNTER)"},
        //   {"name":"MEAN PLATELATES VOLUME","type":"radio","label":"MEAN PLATELATES VOLUME","value":"MEAN PLATELATES VOLUME"},
        //   {"name":"MIXING STUDY","type":"radio","label":"MIXING STUDY","value":"MIXING STUDY"},
        //   {"name":"MULTIPLE MYELOMA PANEL(FISH)","type":"radio","label":"MULTIPLE MYELOMA PANEL(FISH)","value":"MULTIPLE MYELOMA PANEL(FISH)"},
        //   {"name":"NEUTROPHIL LYMPHOCYTE RATIO","type":"radio","label":"NEUTROPHIL LYMPHOCYTE RATIO","value":"NEUTROPHIL LYMPHOCYTE RATIO"},
        //   {"name":"PBS FOR ABNORMAL CELLS","type":"radio","label":"PBS FOR ABNORMAL CELLS","value":"PBS FOR ABNORMAL CELLS"},
        //   {"name":"PBS FOR ACANTHOCYTES (SALINE DILUTION TECHNIQUE)","type":"radio","label":"PBS FOR ACANTHOCYTES (SALINE DILUTION TECHNIQUE)","value":"PBS FOR ACANTHOCYTES (SALINE DILUTION TECHNIQUE)"},
        //   {"name":"PBS FOR CELL MORPHOLOGY","type":"radio","label":"PBS FOR CELL MORPHOLOGY","value":"PBS FOR CELL MORPHOLOGY"},
        //   {"name":"PBS FOR MICROFILARIA","type":"radio","label":"PBS FOR MICROFILARIA","value":"PBS FOR MICROFILARIA"},
        //   {"name":"PBS FOR MP","type":"radio","label":"PBS FOR MP","value":"PBS FOR MP"},
        //   {"name":"PBS FOR RBC MORPHOLOGY","type":"radio","label":"PBS FOR RBC MORPHOLOGY","value":"PBS FOR RBC MORPHOLOGY"},
        //   {"name":"PBS FOR SCHISTOCYTES","type":"radio","label":"PBS FOR SCHISTOCYTES","value":"PBS FOR SCHISTOCYTES"},
        //   {"name":"PBS STUDY","type":"radio","label":"PBS STUDY","value":"PBS STUDY"},
        //   {"name":"PBS STUDY FOR L.D BODY","type":"radio","label":"PBS STUDY FOR L.D BODY","value":"PBS STUDY FOR L.D BODY"},
        //   {"name":"PCV","type":"radio","label":"PCV","value":"PCV"},
        //   {"name":"PH","type":"radio","label":"PH","value":"PH"},
        //   {"name":"PHILADELPHIA CHROMOSOME (BCR/abl-quantitative)","type":"radio","label":"PHILADELPHIA CHROMOSOME (BCR/abl-quantitative)","value":"PHILADELPHIA CHROMOSOME (BCR/abl-quantitative)"},
        //   {"name":"PHILADELPHIA CHROMOSONE (BCR/ABL QUALITATIVE)","type":"radio","label":"PHILADELPHIA CHROMOSONE (BCR/ABL QUALITATIVE)","value":"PHILADELPHIA CHROMOSONE (BCR/ABL QUALITATIVE)"},
        //   {"name":"PLATELET COUNT","type":"radio","label":"PLATELET COUNT","value":"PLATELET COUNT"},
        //   {"name":"PML RARA Tt (15:17) QUANTITATIVE","type":"radio","label":"PML RARA Tt (15:17) QUANTITATIVE","value":"PML RARA Tt (15:17) QUANTITATIVE"},
        //   {"name":"PML-RA RA T 15:17 QUALITATIVE","type":"radio","label":"PML-RA RA T 15:17 QUALITATIVE","value":"PML-RA RA T 15:17 QUALITATIVE"},
        //   {"name":"PML-RARA t (15:17)","type":"radio","label":"PML-RARA t (15:17)","value":"PML-RARA t (15:17)"},
        //   {"name":"PNH BY FLAER","type":"radio","label":"PNH BY FLAER","value":"PNH BY FLAER"},
        //   {"name":"PROTHROMBIN TIME & INR","type":"radio","label":"PROTHROMBIN TIME & INR","value":"PROTHROMBIN TIME & INR"},
        //   {"name":"PUS FOR CYTOLOGY","type":"radio","label":"PUS FOR CYTOLOGY","value":"PUS FOR CYTOLOGY"},
        //   {"name":"RBC COUNT","type":"radio","label":"RBC COUNT","value":"RBC COUNT"},
        //   {"name":"RETICULOCYTE COUNT","type":"radio","label":"RETICULOCYTE COUNT","value":"RETICULOCYTE COUNT"},
        //   {"name":"T.C. (COUNT BY AUTOMATIC CELLCOUNTER)","type":"radio","label":"T.C. (COUNT BY AUTOMATIC CELLCOUNTER)","value":"T.C. (COUNT BY AUTOMATIC CELLCOUNTER)"},
        //   {"name":"THALASEMIA , BETA THALASSEMIA MUTATION DETECTION","type":"radio","label":"THALASEMIA , BETA THALASSEMIA MUTATION DETECTION","value":"THALASEMIA , BETA THALASSEMIA MUTATION DETECTION"},
        //   {"name":"TLC","type":"radio","label":"TLC","value":"TLC"},
        //   {"name":"B-ACUTE LYMPHOBLASTIC LEUKEMIA MRD","type":"radio","label":"B-ACUTE LYMPHOBLASTIC LEUKEMIA MRD","value":"B-ACUTE LYMPHOBLASTIC LEUKEMIA MRD"},
        //   {"name":"BIOPSY (BONE HISTOPATHOLOGY)","type":"radio","label":"BIOPSY (BONE HISTOPATHOLOGY)","value":"BIOPSY (BONE HISTOPATHOLOGY)"},
        //   {"name":"BIOPSY BRAIN BIOPSY WITH SPECIAL STAINS (PATH & RETICULIN)","type":"radio","label":"BIOPSY BRAIN BIOPSY WITH SPECIAL STAINS (PATH & RETICULIN)","value":"BIOPSY BRAIN BIOPSY WITH SPECIAL STAINS (PATH & RETICULIN)"},
        //   {"name":"BIOPSY NERVE BIOPSY WITH SPECIAL STAINS","type":"radio","label":"BIOPSY NERVE BIOPSY WITH SPECIAL STAINS","value":"BIOPSY NERVE BIOPSY WITH SPECIAL STAINS"},
        //   {"name":"BODY FLUID FOR CBC","type":"radio","label":"BODY FLUID FOR CBC","value":"BODY FLUID FOR CBC"},
        //   {"name":"BONE MARROW ASPIRATION CYTOLOGY","type":"radio","label":"BONE MARROW ASPIRATION CYTOLOGY","value":"BONE MARROW ASPIRATION CYTOLOGY"},
        //   {"name":"BONE MARROW BIOPSY","type":"radio","label":"BONE MARROW BIOPSY","value":"BONE MARROW BIOPSY"},
        //   {"name":"BONE MARROW BIOPSY (MATRIX)","type":"radio","label":"BONE MARROW BIOPSY (MATRIX)","value":"BONE MARROW BIOPSY (MATRIX)"},
        //   {"name":"BONE MARROW BIOPSY (SRL)","type":"radio","label":"BONE MARROW BIOPSY (SRL)","value":"BONE MARROW BIOPSY (SRL)"},
        //   {"name":"BONE MARROW FOR MRD","type":"radio","label":"BONE MARROW FOR MRD","value":"BONE MARROW FOR MRD"},
        //   {"name":"BONE MARROW IMMUNOHISTOCYTOCHEMISTRY","type":"radio","label":"BONE MARROW IMMUNOHISTOCYTOCHEMISTRY","value":"BONE MARROW IMMUNOHISTOCYTOCHEMISTRY"},
        //   {"name":"BONE MARROW STUDY (SRL)","type":"radio","label":"BONE MARROW STUDY (SRL)","value":"BONE MARROW STUDY (SRL)"},
        //   {"name":"BREAST EVALUATION PANEL(ER,PGR,HER2/NEU)","type":"radio","label":"BREAST EVALUATION PANEL(ER,PGR,HER2/NEU)","value":"BREAST EVALUATION PANEL(ER,PGR,HER2/NEU)"},
        //   {"name":"COMPLETE DIAGNOSIS WITH SPECIAL STAINS & IHC","type":"radio","label":"COMPLETE DIAGNOSIS WITH SPECIAL STAINS & IHC","value":"COMPLETE DIAGNOSIS WITH SPECIAL STAINS & IHC"},
        //   {"name":"ECHINOCOCCUS DETECTION (MICROSCOPIC DETECTION)","type":"radio","label":"ECHINOCOCCUS DETECTION (MICROSCOPIC DETECTION)","value":"ECHINOCOCCUS DETECTION (MICROSCOPIC DETECTION)"},
        //   {"name":"ELECTRON MICROSCOPY","type":"radio","label":"ELECTRON MICROSCOPY","value":"ELECTRON MICROSCOPY"},
        //   {"name":"ER/PR/HER2 NEW STATUS","type":"radio","label":"ER/PR/HER2 NEW STATUS","value":"ER/PR/HER2 NEW STATUS"},
        //   {"name":"FANCONI ANEMIA","type":"radio","label":"FANCONI ANEMIA","value":"FANCONI ANEMIA"},
        //   {"name":"FISH FOR MLL/11Q","type":"radio","label":"FISH FOR MLL/11Q","value":"FISH FOR MLL/11Q"},
        //   {"name":"FLOWCYTOMETRY PANEL","type":"radio","label":"FLOWCYTOMETRY PANEL","value":"FLOWCYTOMETRY PANEL"},
        //   {"name":"FNAC FOR REPORTING (WITHOUT USG)","type":"radio","label":"FNAC FOR REPORTING (WITHOUT USG)","value":"FNAC FOR REPORTING (WITHOUT USG)"},
        //   {"name":"FNAC OF CERVICAL GLAND","type":"radio","label":"FNAC OF CERVICAL GLAND","value":"FNAC OF CERVICAL GLAND"},
        //   {"name":"H.P.E BIOPSY (LARGE)","type":"radio","label":"H.P.E BIOPSY (LARGE)","value":"H.P.E BIOPSY (LARGE)"},
        //   {"name":"H.P.E BIOPSY (MEDIUM)","type":"radio","label":"H.P.E BIOPSY (MEDIUM)","value":"H.P.E BIOPSY (MEDIUM)"},
        //   {"name":"H.P.E BIOPSY (SMALL)","type":"radio","label":"H.P.E BIOPSY (SMALL)","value":"H.P.E BIOPSY (SMALL)"},
        //   {"name":"H.P.E( PARAFFIN BLOCK/SLIDE)","type":"radio","label":"H.P.E( PARAFFIN BLOCK/SLIDE)","value":"H.P.E( PARAFFIN BLOCK/SLIDE)"},
        //   {"name":"H.P.E(BIOPSY)","type":"radio","label":"H.P.E(BIOPSY)","value":"H.P.E(BIOPSY)"},
        //   {"name":"HISTOPATH REFLEX TO CUSTOM IHC PANEL- OTHERS","type":"radio","label":"HISTOPATH REFLEX TO CUSTOM IHC PANEL- OTHERS","value":"HISTOPATH REFLEX TO CUSTOM IHC PANEL- OTHERS"},
        //   {"name":"HISTOPATHOLOGY REVIEW COE HISTOPATHOLOGY","type":"radio","label":"HISTOPATHOLOGY REVIEW COE HISTOPATHOLOGY","value":"HISTOPATHOLOGY REVIEW COE HISTOPATHOLOGY"},
        //   {"name":"IHC FOR CD34","type":"radio","label":"IHC FOR CD34","value":"IHC FOR CD34"},
        //   {"name":"KIDNEY BIOPSY - EM (ELECTRON MICROSCOPY)","type":"radio","label":"KIDNEY BIOPSY - EM (ELECTRON MICROSCOPY)","value":"KIDNEY BIOPSY - EM (ELECTRON MICROSCOPY)"},
        //   {"name":"KIDNEY BIOPSY - IHC - AMYLOID AA","type":"radio","label":"KIDNEY BIOPSY - IHC - AMYLOID AA","value":"KIDNEY BIOPSY - IHC - AMYLOID AA"},
        //   {"name":"KIDNEY BIOPSY - IHC u2013 C4d","type":"radio","label":"KIDNEY BIOPSY - IHC u2013 C4d","value":"KIDNEY BIOPSY - IHC u2013 C4d"},
        //   {"name":"KIDNEY BIOPSY - IHC - CMV","type":"radio","label":"KIDNEY BIOPSY - IHC - CMV","value":"KIDNEY BIOPSY - IHC - CMV"},
        //   {"name":"KIDNEY BIOPSY - IHC - SV40 Tag","type":"radio","label":"KIDNEY BIOPSY - IHC - SV40 Tag","value":"KIDNEY BIOPSY - IHC - SV40 Tag"},
        //   {"name":"KIDNEY BIOPSY - IHC-IgG4","type":"radio","label":"KIDNEY BIOPSY - IHC-IgG4","value":"KIDNEY BIOPSY - IHC-IgG4"},
        //   {"name":"KIDNEY BIOPSY - IHC-PLA2R","type":"radio","label":"KIDNEY BIOPSY - IHC-PLA2R","value":"KIDNEY BIOPSY - IHC-PLA2R"},
        //   {"name":"KIDNEY BIOPSY ( TRANSPLANT) - LM + C4d","type":"radio","label":"KIDNEY BIOPSY ( TRANSPLANT) - LM + C4d","value":"KIDNEY BIOPSY ( TRANSPLANT) - LM + C4d"},
        //   {"name":"KIDNEY BIOPSY (LM+IF)","type":"radio","label":"KIDNEY BIOPSY (LM+IF)","value":"KIDNEY BIOPSY (LM+IF)"},
        //   {"name":"KIDNEY BIOPSY (TRANSPLANT) - LM+IF+C4D","type":"radio","label":"KIDNEY BIOPSY (TRANSPLANT) - LM+IF+C4D","value":"KIDNEY BIOPSY (TRANSPLANT) - LM+IF+C4D"},
        //   {"name":"KIDNEY BIOPSY -LM","type":"radio","label":"KIDNEY BIOPSY -LM","value":"KIDNEY BIOPSY -LM"},
        //   {"name":"KIDNEY BIOPSY NATIVE","type":"radio","label":"KIDNEY BIOPSY NATIVE","value":"KIDNEY BIOPSY NATIVE"},
        //   {"name":"LIVER BIOPSY WITH SPECIAL STAIN AND REFLEX IHC","type":"radio","label":"LIVER BIOPSY WITH SPECIAL STAIN AND REFLEX IHC","value":"LIVER BIOPSY WITH SPECIAL STAIN AND REFLEX IHC"},
        //   {"name":"LIVER(BIOPSY)","type":"radio","label":"LIVER(BIOPSY)","value":"LIVER(BIOPSY)"},
        //   {"name":"LYMPHOMA:DIFFERENTIAL DIAGNOSIS BY IMMUNOHISTOCHEMISTRY ON TISSUE BLOCK","type":"radio","label":"LYMPHOMA:DIFFERENTIAL DIAGNOSIS BY IMMUNOHISTOCHEMISTRY ON TISSUE BLOCK","value":"LYMPHOMA:DIFFERENTIAL DIAGNOSIS BY IMMUNOHISTOCHEMISTRY ON TISSUE BLOCK"},
        //   {"name":"MUSCLE BIOPSY WITH SPECIAL STAINS","type":"radio","label":"MUSCLE BIOPSY WITH SPECIAL STAINS","value":"MUSCLE BIOPSY WITH SPECIAL STAINS"},
        //   {"name":"ONCOTYPE DX*","type":"radio","label":"ONCOTYPE DX*","value":"ONCOTYPE DX*"},
        //   {"name":"PAP SMEAR","type":"radio","label":"PAP SMEAR","value":"PAP SMEAR"},
        //   {"name":"PLEURAL FLUID CELL BLOCK & IHC","type":"radio","label":"PLEURAL FLUID CELL BLOCK & IHC","value":"PLEURAL FLUID CELL BLOCK & IHC"},
        //   {"name":"RADICAL SPECIMAN","type":"radio","label":"RADICAL SPECIMAN","value":"RADICAL SPECIMAN"},
        //   {"name":"RENAL BIOPSY","type":"radio","label":"RENAL BIOPSY","value":"RENAL BIOPSY"},
        //   {"name":"SKIN BIOPSY","type":"radio","label":"SKIN BIOPSY","value":"SKIN BIOPSY"},
        //   {"name":"SKIN BIOPSY ( PHOTO )","type":"radio","label":"SKIN BIOPSY ( PHOTO )","value":"SKIN BIOPSY ( PHOTO )"},
        //   {"name":"SLIDES FOR SECOND OPINION","type":"radio","label":"SLIDES FOR SECOND OPINION","value":"SLIDES FOR SECOND OPINION"},
        //   {"name":"SPUTUM FOR MALIGNANT CELLS","type":"radio","label":"SPUTUM FOR MALIGNANT CELLS","value":"SPUTUM FOR MALIGNANT CELLS"},
        //   {"name":"USG GUIDED FNAC","type":"radio","label":"USG GUIDED FNAC","value":"USG GUIDED FNAC"},
        //   {"name":"VAGINAL DISCHARGE FOR CYTOLOGY","type":"radio","label":"VAGINAL DISCHARGE FOR CYTOLOGY","value":"VAGINAL DISCHARGE FOR CYTOLOGY"},
        //   {"name":"ABPA MINI (ASPER GILLUS FUMIGATUS APECIFIC IgG,ASPERGILLUS SPECIFIC IgE)","type":"radio","label":"ABPA MINI (ASPER GILLUS FUMIGATUS APECIFIC IgG,ASPERGILLUS SPECIFIC IgE)","value":"ABPA MINI (ASPER GILLUS FUMIGATUS APECIFIC IgG,ASPERGILLUS SPECIFIC IgE)"},
        //   {"name":"ABPA SCREEN TOTAL IgF ASPER GILLUS FUMIGATUS APECIFIC IgE","type":"radio","label":"ABPA SCREEN TOTAL IgF ASPER GILLUS FUMIGATUS APECIFIC IgE","value":"ABPA SCREEN TOTAL IgF ASPER GILLUS FUMIGATUS APECIFIC IgE"},
        //   {"name":"AEROBIC CULTURE & SENSITIVITY","type":"radio","label":"AEROBIC CULTURE & SENSITIVITY","value":"AEROBIC CULTURE & SENSITIVITY"},
        //   {"name":"AFB CULTURE SPUTUM","type":"radio","label":"AFB CULTURE SPUTUM","value":"AFB CULTURE SPUTUM"},
        //   {"name":"AFB CULTURE(TISSUE)","type":"radio","label":"AFB CULTURE(TISSUE)","value":"AFB CULTURE(TISSUE)"},
        //   {"name":"AFB FOR CULTURE & SENSITIVITY","type":"radio","label":"AFB FOR CULTURE & SENSITIVITY","value":"AFB FOR CULTURE & SENSITIVITY"},
        //   {"name":"AFB STAIN","type":"radio","label":"AFB STAIN","value":"AFB STAIN"},
        //   {"name":"AFB STAIN FOR VAGINAL DISCHARGE","type":"radio","label":"AFB STAIN FOR VAGINAL DISCHARGE","value":"AFB STAIN FOR VAGINAL DISCHARGE"},
        //   {"name":"AFB STAIN PUS","type":"radio","label":"AFB STAIN PUS","value":"AFB STAIN PUS"},
        //   {"name":"AFB SUSCEPTIBILITY,BACTEC:13 DRUG PANEL","type":"radio","label":"AFB SUSCEPTIBILITY,BACTEC:13 DRUG PANEL","value":"AFB SUSCEPTIBILITY,BACTEC:13 DRUG PANEL"},
        //   {"name":"AIR SAMPLE PLATE 1","type":"radio","label":"AIR SAMPLE PLATE 1","value":"AIR SAMPLE PLATE 1"},
        //   {"name":"AIR SAMPLE PLATE 2","type":"radio","label":"AIR SAMPLE PLATE 2","value":"AIR SAMPLE PLATE 2"},
        //   {"name":"AIR SAMPLE PLATE 3","type":"radio","label":"AIR SAMPLE PLATE 3","value":"AIR SAMPLE PLATE 3"},
        //   {"name":"AIR SAMPLE PLATE 4","type":"radio","label":"AIR SAMPLE PLATE 4","value":"AIR SAMPLE PLATE 4"},
        //   {"name":"ALBERT STAIN FOR DIPHTHERIA BACILLI","type":"radio","label":"ALBERT STAIN FOR DIPHTHERIA BACILLI","value":"ALBERT STAIN FOR DIPHTHERIA BACILLI"},
        //   {"name":"ALLERGIC BRONCHOPULMONARY ASPERGILLOSIS (ABPA)","type":"radio","label":"ALLERGIC BRONCHOPULMONARY ASPERGILLOSIS (ABPA)","value":"ALLERGIC BRONCHOPULMONARY ASPERGILLOSIS (ABPA)"},
        //   {"name":"ANTI HAV IGM","type":"radio","label":"ANTI HAV IGM","value":"ANTI HAV IGM"},
        //   {"name":"ANTI HEV IGM","type":"radio","label":"ANTI HEV IGM","value":"ANTI HEV IGM"},
        //   {"name":"ANTI NMDA RECEPTOR ENCEPHALITIS IGG ANTIBODIES (CSF)","type":"radio","label":"ANTI NMDA RECEPTOR ENCEPHALITIS IGG ANTIBODIES (CSF)","value":"ANTI NMDA RECEPTOR ENCEPHALITIS IGG ANTIBODIES (CSF)"},
        //   {"name":"ANTI PHOSPHOLIPID SYNDROME PANEL","type":"radio","label":"ANTI PHOSPHOLIPID SYNDROME PANEL","value":"ANTI PHOSPHOLIPID SYNDROME PANEL"},
        //   {"name":"ANTI VGKC IgG Ab (IF ASSAY)","type":"radio","label":"ANTI VGKC IgG Ab (IF ASSAY)","value":"ANTI VGKC IgG Ab (IF ASSAY)"},
        //   {"name":"ANTI-SARS -COV-2 TOTAL ANTIBODY SERUM","type":"radio","label":"ANTI-SARS -COV-2 TOTAL ANTIBODY SERUM","value":"ANTI-SARS -COV-2 TOTAL ANTIBODY SERUM"},
        //   {"name":"ASCITIC FLUID FOR AFB CULTURE & SENSITIVITY(MANUAL","type":"radio","label":"ASCITIC FLUID FOR AFB CULTURE & SENSITIVITY(MANUAL","value":"ASCITIC FLUID FOR AFB CULTURE & SENSITIVITY(MANUAL"},
        //   {"name":"ASCITIC FLUID FOR AFB STAINING","type":"radio","label":"ASCITIC FLUID FOR AFB STAINING","value":"ASCITIC FLUID FOR AFB STAINING"},
        //   {"name":"ASCITIC FLUID FOR CULTURE & SENSITIVITY","type":"radio","label":"ASCITIC FLUID FOR CULTURE & SENSITIVITY","value":"ASCITIC FLUID FOR CULTURE & SENSITIVITY"},
        //   {"name":"ASCITIC FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","type":"radio","label":"ASCITIC FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","value":"ASCITIC FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)"},
        //   {"name":"ASCITIC FLUID FOR CULTURE & SENSITIVITY(MANUAL)","type":"radio","label":"ASCITIC FLUID FOR CULTURE & SENSITIVITY(MANUAL)","value":"ASCITIC FLUID FOR CULTURE & SENSITIVITY(MANUAL)"},
        //   {"name":"ASCITIC FLUID FOR FUNGAL STAIN","type":"radio","label":"ASCITIC FLUID FOR FUNGAL STAIN","value":"ASCITIC FLUID FOR FUNGAL STAIN"},
        //   {"name":"ASCITIC FLUID FOR GRAM STAIN","type":"radio","label":"ASCITIC FLUID FOR GRAM STAIN","value":"ASCITIC FLUID FOR GRAM STAIN"},
        //   {"name":"ASPERGILLUS ANTIBODIES","type":"radio","label":"ASPERGILLUS ANTIBODIES","value":"ASPERGILLUS ANTIBODIES"},
        //   {"name":"ASPIRATED FLUID FOR CULTURE & SENSITIVITY","type":"radio","label":"ASPIRATED FLUID FOR CULTURE & SENSITIVITY","value":"ASPIRATED FLUID FOR CULTURE & SENSITIVITY"},
        //   {"name":"ASPIRATED FLUID FOR GRAM STAIN","type":"radio","label":"ASPIRATED FLUID FOR GRAM STAIN","value":"ASPIRATED FLUID FOR GRAM STAIN"},
        //   {"name":"BAL FOR CULTURE & SENSITIVITY (BY AUTOMATED SYSTEM)","type":"radio","label":"BAL FOR CULTURE & SENSITIVITY (BY AUTOMATED SYSTEM)","value":"BAL FOR CULTURE & SENSITIVITY (BY AUTOMATED SYSTEM)"},
        //   {"name":"BAL FOR GRAMSTAIN","type":"radio","label":"BAL FOR GRAMSTAIN","value":"BAL FOR GRAMSTAIN"},
        //   {"name":"BAL FOR XPERT PLUS","type":"radio","label":"BAL FOR XPERT PLUS","value":"BAL FOR XPERT PLUS"},
        //   {"name":"BILE FOR CS FROM GALLBLADDER","type":"radio","label":"BILE FOR CS FROM GALLBLADDER","value":"BILE FOR CS FROM GALLBLADDER"},
        //   {"name":"BILE FOR CS FROM(CBD)","type":"radio","label":"BILE FOR CS FROM(CBD)","value":"BILE FOR CS FROM(CBD)"},
        //   {"name":"BK VIRUS DNA QUANTITATIVE(REAL TIME PCR)","type":"radio","label":"BK VIRUS DNA QUANTITATIVE(REAL TIME PCR)","value":"BK VIRUS DNA QUANTITATIVE(REAL TIME PCR)"},
        //   {"name":"BLOOD C/S (Paired) SAMPLE 2","type":"radio","label":"BLOOD C/S (Paired) SAMPLE 2","value":"BLOOD C/S (Paired) SAMPLE 2"},
        //   {"name":"BLOOD C/S(Paired) SAMPLE 1","type":"radio","label":"BLOOD C/S(Paired) SAMPLE 1","value":"BLOOD C/S(Paired) SAMPLE 1"},
        //   {"name":"BLOOD CULTURE & SENSITIVITY","type":"radio","label":"BLOOD CULTURE & SENSITIVITY","value":"BLOOD CULTURE & SENSITIVITY"},
        //   {"name":"BLOOD CULTURE & SENSITIVITY(FUNGAL)","type":"radio","label":"BLOOD CULTURE & SENSITIVITY(FUNGAL)","value":"BLOOD CULTURE & SENSITIVITY(FUNGAL)"},
        //   {"name":"BLOOD LYMPHO CULTURE (Cyto Genitic Studies)","type":"radio","label":"BLOOD LYMPHO CULTURE (Cyto Genitic Studies)","value":"BLOOD LYMPHO CULTURE (Cyto Genitic Studies)"},
        //   {"name":"BONE MARROW CULTURE&SENSITIVITY","type":"radio","label":"BONE MARROW CULTURE&SENSITIVITY","value":"BONE MARROW CULTURE&SENSITIVITY"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AEROBIC CULTURE","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AEROBIC CULTURE","value":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AEROBIC CULTURE"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AFB CULTURE & SENSITIVITY","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AFB CULTURE & SENSITIVITY","value":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AFB CULTURE & SENSITIVITY"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AFB STAIN","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AFB STAIN","value":"BRONCHO ALVEOLAR LAVAGE FLUID FOR AFB STAIN"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FLUID FOR FUNGAL C/S","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FLUID FOR FUNGAL C/S","value":"BRONCHO ALVEOLAR LAVAGE FLUID FOR FUNGAL C/S"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FLUID FOR FUNGAL STAIN","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FLUID FOR FUNGAL STAIN","value":"BRONCHO ALVEOLAR LAVAGE FLUID FOR FUNGAL STAIN"},
        //   {"name":"BRONCHO ALVEOLAR LAVAGE FLUID FOR GRAM STAIN","type":"radio","label":"BRONCHO ALVEOLAR LAVAGE FLUID FOR GRAM STAIN","value":"BRONCHO ALVEOLAR LAVAGE FLUID FOR GRAM STAIN"},
        //   {"name":"BRUCELLA ANTIBODIES (TUBE AGGLUTINATON)","type":"radio","label":"BRUCELLA ANTIBODIES (TUBE AGGLUTINATON)","value":"BRUCELLA ANTIBODIES (TUBE AGGLUTINATON)"},
        //   {"name":"C DIFFICILE TOXIN A/B : RAPID TEST","type":"radio","label":"C DIFFICILE TOXIN A/B : RAPID TEST","value":"C DIFFICILE TOXIN A/B : RAPID TEST"},
        //   {"name":"C DIFFICILE TOXIN A/B: RAPID TEST (STOOL)","type":"radio","label":"C DIFFICILE TOXIN A/B: RAPID TEST (STOOL)","value":"C DIFFICILE TOXIN A/B: RAPID TEST (STOOL)"},
        //   {"name":"CATHETER TIP C&S","type":"radio","label":"CATHETER TIP C&S","value":"CATHETER TIP C&S"},
        //   {"name":"CBNAAT (D.T.H)","type":"radio","label":"CBNAAT (D.T.H)","value":"CBNAAT (D.T.H)"},
        //   {"name":"CBNAAT (EXPERT MTB/RIF)","type":"radio","label":"CBNAAT (EXPERT MTB/RIF)","value":"CBNAAT (EXPERT MTB/RIF)"},
        //   {"name":"CBNAAT (GMCH)","type":"radio","label":"CBNAAT (GMCH)","value":"CBNAAT (GMCH)"},
        //   {"name":"CENTRAL LINE TIP C&S","type":"radio","label":"CENTRAL LINE TIP C&S","value":"CENTRAL LINE TIP C&S"},
        //   {"name":"CHICKEN POX (VARICELLA ZOSTER VIRUS (VZV) IGG ANTIBODIES (VZV IgG)","type":"radio","label":"CHICKEN POX (VARICELLA ZOSTER VIRUS (VZV) IGG ANTIBODIES (VZV IgG)","value":"CHICKEN POX (VARICELLA ZOSTER VIRUS (VZV) IGG ANTIBODIES (VZV IgG)"},
        //   {"name":"CHIKUNGUNY IgM ANTIBODY, SERUM","type":"radio","label":"CHIKUNGUNY IgM ANTIBODY, SERUM","value":"CHIKUNGUNY IgM ANTIBODY, SERUM"},
        //   {"name":"CHROMOOPTIMA","type":"radio","label":"CHROMOOPTIMA","value":"CHROMOOPTIMA"},
        //   {"name":"CLOSTRIDIUM DIFFICILE REAL TIME PCR (STOOL)","type":"radio","label":"CLOSTRIDIUM DIFFICILE REAL TIME PCR (STOOL)","value":"CLOSTRIDIUM DIFFICILE REAL TIME PCR (STOOL)"},
        //   {"name":"COVID-19 ANTIGEN TEST","type":"radio","label":"COVID-19 ANTIGEN TEST","value":"COVID-19 ANTIGEN TEST"},
        //   {"name":"COXSACKIE VIRUS IgG & IgM","type":"radio","label":"COXSACKIE VIRUS IgG & IgM","value":"COXSACKIE VIRUS IgG & IgM"},
        //   {"name":"CRYPTOCOCCAL ANTIGEN","type":"radio","label":"CRYPTOCOCCAL ANTIGEN","value":"CRYPTOCOCCAL ANTIGEN"},
        //   {"name":"CSF FOR AFB CULTURE & SENSITIVITY","type":"radio","label":"CSF FOR AFB CULTURE & SENSITIVITY","value":"CSF FOR AFB CULTURE & SENSITIVITY"},
        //   {"name":"CSF FOR AFB STAIN","type":"radio","label":"CSF FOR AFB STAIN","value":"CSF FOR AFB STAIN"},
        //   {"name":"CSF FOR AFB STAINING","type":"radio","label":"CSF FOR AFB STAINING","value":"CSF FOR AFB STAINING"},
        //   {"name":"CSF FOR AQUAPORIN ANTIBODY(NMO igG)","type":"radio","label":"CSF FOR AQUAPORIN ANTIBODY(NMO igG)","value":"CSF FOR AQUAPORIN ANTIBODY(NMO igG)"},
        //   {"name":"CSF FOR CULTURE & SESITIVITY(AUTO MATED)","type":"radio","label":"CSF FOR CULTURE & SESITIVITY(AUTO MATED)","value":"CSF FOR CULTURE & SESITIVITY(AUTO MATED)"},
        //   {"name":"CSF FOR CULTURE & SESITIVITY(MANUAL)","type":"radio","label":"CSF FOR CULTURE & SESITIVITY(MANUAL)","value":"CSF FOR CULTURE & SESITIVITY(MANUAL)"},
        //   {"name":"CSF FOR FUNGAL CS","type":"radio","label":"CSF FOR FUNGAL CS","value":"CSF FOR FUNGAL CS"},
        //   {"name":"CSF FOR FUNGAL STAIN","type":"radio","label":"CSF FOR FUNGAL STAIN","value":"CSF FOR FUNGAL STAIN"},
        //   {"name":"CSF FOR GRAM STAIN","type":"radio","label":"CSF FOR GRAM STAIN","value":"CSF FOR GRAM STAIN"},
        //   {"name":"CSF FOR JAPANESE ENCEPHALITIS","type":"radio","label":"CSF FOR JAPANESE ENCEPHALITIS","value":"CSF FOR JAPANESE ENCEPHALITIS"},
        //   {"name":"CSF FOR OLIGOCLONAL BAND","type":"radio","label":"CSF FOR OLIGOCLONAL BAND","value":"CSF FOR OLIGOCLONAL BAND"},
        //   {"name":"CSF FOR VDRL","type":"radio","label":"CSF FOR VDRL","value":"CSF FOR VDRL"},
        //   {"name":"CSF HSV I & II ( IgM ELISA )","type":"radio","label":"CSF HSV I & II ( IgM ELISA )","value":"CSF HSV I & II ( IgM ELISA )"},
        //   {"name":"CSF HSV I & II (IgG ELISA)","type":"radio","label":"CSF HSV I & II (IgG ELISA)","value":"CSF HSV I & II (IgG ELISA)"},
        //   {"name":"CYSTICERCUS IgG ANTIBODIES ( SERUM)","type":"radio","label":"CYSTICERCUS IgG ANTIBODIES ( SERUM)","value":"CYSTICERCUS IgG ANTIBODIES ( SERUM)"},
        //   {"name":"CYSTICERCUS IgG ANTIBODIES ( CSF)","type":"radio","label":"CYSTICERCUS IgG ANTIBODIES ( CSF)","value":"CYSTICERCUS IgG ANTIBODIES ( CSF)"},
        //   {"name":"CYTOMEGALO VIRUS SDNA DETECTOR(CSF)","type":"radio","label":"CYTOMEGALO VIRUS SDNA DETECTOR(CSF)","value":"CYTOMEGALO VIRUS SDNA DETECTOR(CSF)"},
        //   {"name":"CYTOMEGALOVIRUS IgG ANTIBODIES(CMV IgG)","type":"radio","label":"CYTOMEGALOVIRUS IgG ANTIBODIES(CMV IgG)","value":"CYTOMEGALOVIRUS IgG ANTIBODIES(CMV IgG)"},
        //   {"name":"CYTOMEGALOVIRUS IgM ANTIBODIES","type":"radio","label":"CYTOMEGALOVIRUS IgM ANTIBODIES","value":"CYTOMEGALOVIRUS IgM ANTIBODIES"},
        //   {"name":"DENGUE (SCREENING TEST)","type":"radio","label":"DENGUE (SCREENING TEST)","value":"DENGUE (SCREENING TEST)"},
        //   {"name":"DENGUE IGM ELISA","type":"radio","label":"DENGUE IGM ELISA","value":"DENGUE IGM ELISA"},
        //   {"name":"DENGUE IGM FOR SCREENING","type":"radio","label":"DENGUE IGM FOR SCREENING","value":"DENGUE IGM FOR SCREENING"},
        //   {"name":"DENGUE NS1 ANTIGEN & IgG - IgM ANTI BODIES","type":"radio","label":"DENGUE NS1 ANTIGEN & IgG - IgM ANTI BODIES","value":"DENGUE NS1 ANTIGEN & IgG - IgM ANTI BODIES"},
        //   {"name":"DENGUE NS1 ANTIGEN FOR SCREENING","type":"radio","label":"DENGUE NS1 ANTIGEN FOR SCREENING","value":"DENGUE NS1 ANTIGEN FOR SCREENING"},
        //   {"name":"DENGUE NS1 ELISA","type":"radio","label":"DENGUE NS1 ELISA","value":"DENGUE NS1 ELISA"},
        //   {"name":"DIALYSATE FLUID FOR GRAM STAIN & C/S","type":"radio","label":"DIALYSATE FLUID FOR GRAM STAIN & C/S","value":"DIALYSATE FLUID FOR GRAM STAIN & C/S"},
        //   {"name":"DIALYSIS FLUID FOR CULTURE & SENSITIVITY","type":"radio","label":"DIALYSIS FLUID FOR CULTURE & SENSITIVITY","value":"DIALYSIS FLUID FOR CULTURE & SENSITIVITY"},
        //   {"name":"DIALYSIS FLUID FOR GRAM STAIN","type":"radio","label":"DIALYSIS FLUID FOR GRAM STAIN","value":"DIALYSIS FLUID FOR GRAM STAIN"},
        //   {"name":"DRINKING WATER CULTURE","type":"radio","label":"DRINKING WATER CULTURE","value":"DRINKING WATER CULTURE"},
        //   {"name":"DUCHENE/ BECKER MUSCULAR DYSTROPHY","type":"radio","label":"DUCHENE/ BECKER MUSCULAR DYSTROPHY","value":"DUCHENE/ BECKER MUSCULAR DYSTROPHY"},
        //   {"name":"DUCHENNE MUSCULAR DYSTROPHY (DMD) CARRIER TEST BY PCR","type":"radio","label":"DUCHENNE MUSCULAR DYSTROPHY (DMD) CARRIER TEST BY PCR","value":"DUCHENNE MUSCULAR DYSTROPHY (DMD) CARRIER TEST BY PCR"},
        //   {"name":"E.T.TUBE FOR CULTURE & SENSITIVITY","type":"radio","label":"E.T.TUBE FOR CULTURE & SENSITIVITY","value":"E.T.TUBE FOR CULTURE & SENSITIVITY"},
        //   {"name":"E.T.TUBE FOR GRAM STAIN","type":"radio","label":"E.T.TUBE FOR GRAM STAIN","value":"E.T.TUBE FOR GRAM STAIN"},
        //   {"name":"EAR SWAB FOR CULTURE & SENSITIVITY","type":"radio","label":"EAR SWAB FOR CULTURE & SENSITIVITY","value":"EAR SWAB FOR CULTURE & SENSITIVITY"},
        //   {"name":"EAR SWAB FOR GRAM STAIN","type":"radio","label":"EAR SWAB FOR GRAM STAIN","value":"EAR SWAB FOR GRAM STAIN"},
        //   {"name":"ECHINOCOCCUS IgG ANTIBODIES","type":"radio","label":"ECHINOCOCCUS IgG ANTIBODIES","value":"ECHINOCOCCUS IgG ANTIBODIES"},
        //   {"name":"EMA (endomysial. antibody IGA)","type":"radio","label":"EMA (endomysial. antibody IGA)","value":"EMA (endomysial. antibody IGA)"},
        //   {"name":"ENTAMOEBA HISTOLYTICA ANTIBODIES","type":"radio","label":"ENTAMOEBA HISTOLYTICA ANTIBODIES","value":"ENTAMOEBA HISTOLYTICA ANTIBODIES"},
        //   {"name":"EPSTEIN-BARR VIRSU (EBV)DNA PCR","type":"radio","label":"EPSTEIN-BARR VIRSU (EBV)DNA PCR","value":"EPSTEIN-BARR VIRSU (EBV)DNA PCR"},
        //   {"name":"FILARIA IgG/IgM ANTIBODIES","type":"radio","label":"FILARIA IgG/IgM ANTIBODIES","value":"FILARIA IgG/IgM ANTIBODIES"},
        //   {"name":"FLT3 MUTATION DETECTION","type":"radio","label":"FLT3 MUTATION DETECTION","value":"FLT3 MUTATION DETECTION"},
        //   {"name":"FLU REAL TIME PCR","type":"radio","label":"FLU REAL TIME PCR","value":"FLU REAL TIME PCR"},
        //   {"name":"FLU REAL TIME PCR (H1 N1)","type":"radio","label":"FLU REAL TIME PCR (H1 N1)","value":"FLU REAL TIME PCR (H1 N1)"},
        //   {"name":"FNAC FOR CULTURE AND SENSITIVITY","type":"radio","label":"FNAC FOR CULTURE AND SENSITIVITY","value":"FNAC FOR CULTURE AND SENSITIVITY"},
        //   {"name":"FNAC SAMPLE FOR AFB STAIN","type":"radio","label":"FNAC SAMPLE FOR AFB STAIN","value":"FNAC SAMPLE FOR AFB STAIN"},
        //   {"name":"FNAC SAMPLE FOR GRAM STAIN","type":"radio","label":"FNAC SAMPLE FOR GRAM STAIN","value":"FNAC SAMPLE FOR GRAM STAIN"},
        //   {"name":"FUNGAL C&S SPUTUM","type":"radio","label":"FUNGAL C&S SPUTUM","value":"FUNGAL C&S SPUTUM"},
        //   {"name":"FUNGAL C/S","type":"radio","label":"FUNGAL C/S","value":"FUNGAL C/S"},
        //   {"name":"FUNGAL STAIN","type":"radio","label":"FUNGAL STAIN","value":"FUNGAL STAIN"},
        //   {"name":"GAMMA INTERFERON(M.TUBERCULOSIS INIENFEON GAMMA RELEASE ASSAY)(IGRA)","type":"radio","label":"GAMMA INTERFERON(M.TUBERCULOSIS INIENFEON GAMMA RELEASE ASSAY)(IGRA)","value":"GAMMA INTERFERON(M.TUBERCULOSIS INIENFEON GAMMA RELEASE ASSAY)(IGRA)"},
        //   {"name":"GAMMA INTERFERON(M.tuberculosis interferon Gamma Release Assay(IGRA)","type":"radio","label":"GAMMA INTERFERON(M.tuberculosis interferon Gamma Release Assay(IGRA)","value":"GAMMA INTERFERON(M.tuberculosis interferon Gamma Release Assay(IGRA)"},
        //   {"name":"GRAM STAIN","type":"radio","label":"GRAM STAIN","value":"GRAM STAIN"},
        //   {"name":"GRAM STAIN - PUS","type":"radio","label":"GRAM STAIN - PUS","value":"GRAM STAIN - PUS"},
        //   {"name":"GRAM STAIN - SPUTUM","type":"radio","label":"GRAM STAIN - SPUTUM","value":"GRAM STAIN - SPUTUM"},
        //   {"name":"GRAM STAIN - THROAT SWAB","type":"radio","label":"GRAM STAIN - THROAT SWAB","value":"GRAM STAIN - THROAT SWAB"},
        //   {"name":"GRAM STAIN - TIP","type":"radio","label":"GRAM STAIN - TIP","value":"GRAM STAIN - TIP"},
        //   {"name":"GRAM STAIN FOR VAGINAL DISCHARGE","type":"radio","label":"GRAM STAIN FOR VAGINAL DISCHARGE","value":"GRAM STAIN FOR VAGINAL DISCHARGE"},
        //   {"name":"H.PYLORI ANTIGEN DETECTION","type":"radio","label":"H.PYLORI ANTIGEN DETECTION","value":"H.PYLORI ANTIGEN DETECTION"},
        //   {"name":"HBeAg","type":"radio","label":"HBeAg","value":"HBeAg"},
        //   {"name":"HBsAG ELISA","type":"radio","label":"HBsAG ELISA","value":"HBsAG ELISA"},
        //   {"name":"HBV (QUANTITATIVE BY COBAS TAQMAN)","type":"radio","label":"HBV (QUANTITATIVE BY COBAS TAQMAN)","value":"HBV (QUANTITATIVE BY COBAS TAQMAN)"},
        //   {"name":"HBV VIRAL LOAD BY REAL TIME PCR","type":"radio","label":"HBV VIRAL LOAD BY REAL TIME PCR","value":"HBV VIRAL LOAD BY REAL TIME PCR"},
        //   {"name":"HCV ANTIBODY","type":"radio","label":"HCV ANTIBODY","value":"HCV ANTIBODY"},
        //   {"name":"HCV GENOTYPING","type":"radio","label":"HCV GENOTYPING","value":"HCV GENOTYPING"},
        //   {"name":"HCV RNA QUANTITATIVE","type":"radio","label":"HCV RNA QUANTITATIVE","value":"HCV RNA QUANTITATIVE"},
        //   {"name":"HEPATITIS B CORE ANTIBODY TOTAL","type":"radio","label":"HEPATITIS B CORE ANTIBODY TOTAL","value":"HEPATITIS B CORE ANTIBODY TOTAL"},
        //   {"name":"HEPATITIS B SURFACE ANTIBODY(ANTI HBS) TOTAL","type":"radio","label":"HEPATITIS B SURFACE ANTIBODY(ANTI HBS) TOTAL","value":"HEPATITIS B SURFACE ANTIBODY(ANTI HBS) TOTAL"},
        //   {"name":"HEPATITIS B VIRUS CORE IGM ANTIBODIES","type":"radio","label":"HEPATITIS B VIRUS CORE IGM ANTIBODIES","value":"HEPATITIS B VIRUS CORE IGM ANTIBODIES"},
        //   {"name":"HEPATITIS BC ANTIBODY (SERUM)","type":"radio","label":"HEPATITIS BC ANTIBODY (SERUM)","value":"HEPATITIS BC ANTIBODY (SERUM)"},
        //   {"name":"HEPATITIS BE ANTIBODY(SERUM)","type":"radio","label":"HEPATITIS BE ANTIBODY(SERUM)","value":"HEPATITIS BE ANTIBODY(SERUM)"},
        //   {"name":"HETEROPHILE ANTIBODIES(INFECTIOUS MONONUCLEOSIS)","type":"radio","label":"HETEROPHILE ANTIBODIES(INFECTIOUS MONONUCLEOSIS)","value":"HETEROPHILE ANTIBODIES(INFECTIOUS MONONUCLEOSIS)"},
        //   {"name":"HIV 1 & 2 ( 324 ANTIGANE )","type":"radio","label":"HIV 1 & 2 ( 324 ANTIGANE )","value":"HIV 1 & 2 ( 324 ANTIGANE )"},
        //   {"name":"HIV MONITOR (VIRAL LORD, CD4 /CD8)","type":"radio","label":"HIV MONITOR (VIRAL LORD, CD4 /CD8)","value":"HIV MONITOR (VIRAL LORD, CD4 /CD8)"},
        //   {"name":"HIV-1 VIRAL LOAD BY REAL TIME PCR","type":"radio","label":"HIV-1 VIRAL LOAD BY REAL TIME PCR","value":"HIV-1 VIRAL LOAD BY REAL TIME PCR"},
        //   {"name":"IGA, IGM & IGG IMMUNOGLOBLIM ,QUANTITIVE","type":"radio","label":"IGA, IGM & IGG IMMUNOGLOBLIM ,QUANTITIVE","value":"IGA, IGM & IGG IMMUNOGLOBLIM ,QUANTITIVE"},
        //   {"name":"INDIAN INK PREPARATION FOR CRYPTOCOCCUS","type":"radio","label":"INDIAN INK PREPARATION FOR CRYPTOCOCCUS","value":"INDIAN INK PREPARATION FOR CRYPTOCOCCUS"},
        //   {"name":"JC VIRUS QUANTITATIVE (REAL TIME PCR)","type":"radio","label":"JC VIRUS QUANTITATIVE (REAL TIME PCR)","value":"JC VIRUS QUANTITATIVE (REAL TIME PCR)"},
        //   {"name":"JE (Mc ELISA) (GMCH)","type":"radio","label":"JE (Mc ELISA) (GMCH)","value":"JE (Mc ELISA) (GMCH)"},
        //   {"name":"KALA-AZAR (ICT)","type":"radio","label":"KALA-AZAR (ICT)","value":"KALA-AZAR (ICT)"},
        //   {"name":"KNEE FLUID ASPIRATE FOR CULTURE & SENSITIVITY","type":"radio","label":"KNEE FLUID ASPIRATE FOR CULTURE & SENSITIVITY","value":"KNEE FLUID ASPIRATE FOR CULTURE & SENSITIVITY"},
        //   {"name":"KNEE FLUID ASPIRATE FOR GRAM STAIN","type":"radio","label":"KNEE FLUID ASPIRATE FOR GRAM STAIN","value":"KNEE FLUID ASPIRATE FOR GRAM STAIN"},
        //   {"name":"KOH MOUNT - SPUTUM","type":"radio","label":"KOH MOUNT - SPUTUM","value":"KOH MOUNT - SPUTUM"},
        //   {"name":"LEGIONELLA PNENUMOPHILA ANTIGEN DETECTION URINE","type":"radio","label":"LEGIONELLA PNENUMOPHILA ANTIGEN DETECTION URINE","value":"LEGIONELLA PNENUMOPHILA ANTIGEN DETECTION URINE"},
        //   {"name":"LEPTOSPIRA DNA PCR","type":"radio","label":"LEPTOSPIRA DNA PCR","value":"LEPTOSPIRA DNA PCR"},
        //   {"name":"LEPTOSPIRA IGG ANTIBODIES (ELISA)","type":"radio","label":"LEPTOSPIRA IGG ANTIBODIES (ELISA)","value":"LEPTOSPIRA IGG ANTIBODIES (ELISA)"},
        //   {"name":"LEPTOSPIRA IGM ANTIBODIES (ELISA)","type":"radio","label":"LEPTOSPIRA IGM ANTIBODIES (ELISA)","value":"LEPTOSPIRA IGM ANTIBODIES (ELISA)"},
        //   {"name":"LEPTOSPIRA IGM ANTIBODIES(RAPID)","type":"radio","label":"LEPTOSPIRA IGM ANTIBODIES(RAPID)","value":"LEPTOSPIRA IGM ANTIBODIES(RAPID)"},
        //   {"name":"LINE PROBE ASSAY (GMCH)","type":"radio","label":"LINE PROBE ASSAY (GMCH)","value":"LINE PROBE ASSAY (GMCH)"},
        //   {"name":"MALARIA(PF/PV)SCREENING","type":"radio","label":"MALARIA(PF/PV)SCREENING","value":"MALARIA(PF/PV)SCREENING"},
        //   {"name":"MOD.Z.N.STAINING FOR NOCARDIA-SPUTUM*","type":"radio","label":"MOD.Z.N.STAINING FOR NOCARDIA-SPUTUM*","value":"MOD.Z.N.STAINING FOR NOCARDIA-SPUTUM*"},
        //   {"name":"MYCOPLASMA PNEUMONIAE IGM ANTIBODIES","type":"radio","label":"MYCOPLASMA PNEUMONIAE IGM ANTIBODIES","value":"MYCOPLASMA PNEUMONIAE IGM ANTIBODIES"},
        //   {"name":"ORCEN STAIN","type":"radio","label":"ORCEN STAIN","value":"ORCEN STAIN"},
        //   {"name":"PAN NEUROTROPIC VIRUS PANEL","type":"radio","label":"PAN NEUROTROPIC VIRUS PANEL","value":"PAN NEUROTROPIC VIRUS PANEL"},
        //   {"name":"PANCREATIC FLUID FOR AFB CULTURE & SENSITIVITY","type":"radio","label":"PANCREATIC FLUID FOR AFB CULTURE & SENSITIVITY","value":"PANCREATIC FLUID FOR AFB CULTURE & SENSITIVITY"},
        //   {"name":"PANCREATIC FLUID FOR AFB STAINING","type":"radio","label":"PANCREATIC FLUID FOR AFB STAINING","value":"PANCREATIC FLUID FOR AFB STAINING"},
        //   {"name":"PANCREATIC FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","type":"radio","label":"PANCREATIC FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","value":"PANCREATIC FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)"},
        //   {"name":"PANCREATIC FLUID FOR CULTURE & SENSITIVITY(MANUAL)","type":"radio","label":"PANCREATIC FLUID FOR CULTURE & SENSITIVITY(MANUAL)","value":"PANCREATIC FLUID FOR CULTURE & SENSITIVITY(MANUAL)"},
        //   {"name":"PANCREATIC FLUID FOR GRAM STAIN","type":"radio","label":"PANCREATIC FLUID FOR GRAM STAIN","value":"PANCREATIC FLUID FOR GRAM STAIN"},
        //   {"name":"PARVOVIRUS B19 DNA PCR","type":"radio","label":"PARVOVIRUS B19 DNA PCR","value":"PARVOVIRUS B19 DNA PCR"},
        //   {"name":"PCR FOR HERPES SIMPLEX VIRUS - DNA","type":"radio","label":"PCR FOR HERPES SIMPLEX VIRUS - DNA","value":"PCR FOR HERPES SIMPLEX VIRUS - DNA"},
        //   {"name":"PERICARDIAL FLUID FOR AFB","type":"radio","label":"PERICARDIAL FLUID FOR AFB","value":"PERICARDIAL FLUID FOR AFB"},
        //   {"name":"PERICARDIAL FLUID FOR AFB CULTURE & SENSITIVITY","type":"radio","label":"PERICARDIAL FLUID FOR AFB CULTURE & SENSITIVITY","value":"PERICARDIAL FLUID FOR AFB CULTURE & SENSITIVITY"},
        //   {"name":"PERICARDIAL FLUID FOR CULTURE & SENSITIVITY","type":"radio","label":"PERICARDIAL FLUID FOR CULTURE & SENSITIVITY","value":"PERICARDIAL FLUID FOR CULTURE & SENSITIVITY"},
        //   {"name":"PERICARDIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","type":"radio","label":"PERICARDIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","value":"PERICARDIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)"},
        //   {"name":"PERICARDIAL FLUID FOR GRAM STAIN","type":"radio","label":"PERICARDIAL FLUID FOR GRAM STAIN","value":"PERICARDIAL FLUID FOR GRAM STAIN"},
        //   {"name":"PERICARDIAL FLUID FOR GRAMSTAIN","type":"radio","label":"PERICARDIAL FLUID FOR GRAMSTAIN","value":"PERICARDIAL FLUID FOR GRAMSTAIN"},
        //   {"name":"PERICARDIAL FLUID FOR STAINING","type":"radio","label":"PERICARDIAL FLUID FOR STAINING","value":"PERICARDIAL FLUID FOR STAINING"},
        //   {"name":"PERICARDIAL FLUID FOR TB PCR","type":"radio","label":"PERICARDIAL FLUID FOR TB PCR","value":"PERICARDIAL FLUID FOR TB PCR"},
        //   {"name":"PERITONEAL DIALYSIS FLUID FOR FUNGAL STAIN","type":"radio","label":"PERITONEAL DIALYSIS FLUID FOR FUNGAL STAIN","value":"PERITONEAL DIALYSIS FLUID FOR FUNGAL STAIN"},
        //   {"name":"PERITONEAL DIALYSIS FLUID FOR GRAM STAIN","type":"radio","label":"PERITONEAL DIALYSIS FLUID FOR GRAM STAIN","value":"PERITONEAL DIALYSIS FLUID FOR GRAM STAIN"},
        //   {"name":"PERITONEAL FLUID FOR CULTURE AND SENSITIVITY","type":"radio","label":"PERITONEAL FLUID FOR CULTURE AND SENSITIVITY","value":"PERITONEAL FLUID FOR CULTURE AND SENSITIVITY"},
        //   {"name":"PERITONEAL FLUID FOR CULTURE AND SENSITIVITY (AUTOMATED)","type":"radio","label":"PERITONEAL FLUID FOR CULTURE AND SENSITIVITY (AUTOMATED)","value":"PERITONEAL FLUID FOR CULTURE AND SENSITIVITY (AUTOMATED)"},
        //   {"name":"PLEURAL FLUID FOR AFB CULTURE & SENSITIVITY","type":"radio","label":"PLEURAL FLUID FOR AFB CULTURE & SENSITIVITY","value":"PLEURAL FLUID FOR AFB CULTURE & SENSITIVITY"},
        //   {"name":"PLEURAL FLUID FOR AFB STAINING","type":"radio","label":"PLEURAL FLUID FOR AFB STAINING","value":"PLEURAL FLUID FOR AFB STAINING"},
        //   {"name":"PLEURAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","type":"radio","label":"PLEURAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","value":"PLEURAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)"},
        //   {"name":"PLEURAL FLUID FOR CULTURE & SENSITIVITY(MANUAL)","type":"radio","label":"PLEURAL FLUID FOR CULTURE & SENSITIVITY(MANUAL)","value":"PLEURAL FLUID FOR CULTURE & SENSITIVITY(MANUAL)"},
        //   {"name":"PLEURAL FLUID FOR FUNGAL STAIN","type":"radio","label":"PLEURAL FLUID FOR FUNGAL STAIN","value":"PLEURAL FLUID FOR FUNGAL STAIN"},
        //   {"name":"PLEURAL FLUID FOR GRAM STAIN","type":"radio","label":"PLEURAL FLUID FOR GRAM STAIN","value":"PLEURAL FLUID FOR GRAM STAIN"},
        //   {"name":"PLURAL FLUID FOR CULTURE & SENSITIVITY","type":"radio","label":"PLURAL FLUID FOR CULTURE & SENSITIVITY","value":"PLURAL FLUID FOR CULTURE & SENSITIVITY"},
        //   {"name":"PLURAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","type":"radio","label":"PLURAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","value":"PLURAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)"},
        //   {"name":"PLURAL FLUID FOR GRAM STAIN","type":"radio","label":"PLURAL FLUID FOR GRAM STAIN","value":"PLURAL FLUID FOR GRAM STAIN"},
        //   {"name":"PLURAL FLUID FOR OVA CYSTS","type":"radio","label":"PLURAL FLUID FOR OVA CYSTS","value":"PLURAL FLUID FOR OVA CYSTS"},
        //   {"name":"PNEUMOCYSTIS CARNINI/JI ROVESI","type":"radio","label":"PNEUMOCYSTIS CARNINI/JI ROVESI","value":"PNEUMOCYSTIS CARNINI/JI ROVESI"},
        //   {"name":"PUS FOR AFB CULTURE AND SENSITIVITY","type":"radio","label":"PUS FOR AFB CULTURE AND SENSITIVITY","value":"PUS FOR AFB CULTURE AND SENSITIVITY"},
        //   {"name":"PUS FOR CULTURE & SENSITIVITY","type":"radio","label":"PUS FOR CULTURE & SENSITIVITY","value":"PUS FOR CULTURE & SENSITIVITY"},
        //   {"name":"PUS FOR CULTURE & SENSITIVITY (FUNGAL)","type":"radio","label":"PUS FOR CULTURE & SENSITIVITY (FUNGAL)","value":"PUS FOR CULTURE & SENSITIVITY (FUNGAL)"},
        //   {"name":"PUS FOR GRAM STAIN","type":"radio","label":"PUS FOR GRAM STAIN","value":"PUS FOR GRAM STAIN"},
        //   {"name":"PUS FOR MAGLINANT CELLS","type":"radio","label":"PUS FOR MAGLINANT CELLS","value":"PUS FOR MAGLINANT CELLS"},
        //   {"name":"PUS FOR TB PCR","type":"radio","label":"PUS FOR TB PCR","value":"PUS FOR TB PCR"},
        //   {"name":"RETROVIRUS(ELISA)","type":"radio","label":"RETROVIRUS(ELISA)","value":"RETROVIRUS(ELISA)"},
        //   {"name":"RT PCR FOR COVID19","type":"radio","label":"RT PCR FOR COVID19","value":"RT PCR FOR COVID19"},
        //   {"name":"RUBELLA IgG & IgM","type":"radio","label":"RUBELLA IgG & IgM","value":"RUBELLA IgG & IgM"},
        //   {"name":"S.Typhi IgG Test","type":"radio","label":"S.Typhi IgG Test","value":"S.Typhi IgG Test"},
        //   {"name":"S.TYPHI IgM ELISA","type":"radio","label":"S.TYPHI IgM ELISA","value":"S.TYPHI IgM ELISA"},
        //   {"name":"SARS COVID-2 IgG/IgM ANTIBODY,SERUM","type":"radio","label":"SARS COVID-2 IgG/IgM ANTIBODY,SERUM","value":"SARS COVID-2 IgG/IgM ANTIBODY,SERUM"},
        //   {"name":"SCA PANEL (SCA TYPE-1,12,2,3,6)","type":"radio","label":"SCA PANEL (SCA TYPE-1,12,2,3,6)","value":"SCA PANEL (SCA TYPE-1,12,2,3,6)"},
        //   {"name":"SCRUB TYPHUS (RAPID)","type":"radio","label":"SCRUB TYPHUS (RAPID)","value":"SCRUB TYPHUS (RAPID)"},
        //   {"name":"SCRUB TYPHUS IgM ANTIBODY","type":"radio","label":"SCRUB TYPHUS IgM ANTIBODY","value":"SCRUB TYPHUS IgM ANTIBODY"},
        //   {"name":"SEMEN FOR CULTURE & SENSITIVITY","type":"radio","label":"SEMEN FOR CULTURE & SENSITIVITY","value":"SEMEN FOR CULTURE & SENSITIVITY"},
        //   {"name":"Serum HSV I & I I(IgM ELISA)","type":"radio","label":"Serum HSV I & I I(IgM ELISA)","value":"Serum HSV I & I I(IgM ELISA)"},
        //   {"name":"Serum HSV I & II (IgG ELISA)","type":"radio","label":"Serum HSV I & II (IgG ELISA)","value":"Serum HSV I & II (IgG ELISA)"},
        //   {"name":"SES POST TRANSPLANT/FEBRILE/NEUTROPEIA/PNEUMONIA PANEL","type":"radio","label":"SES POST TRANSPLANT/FEBRILE/NEUTROPEIA/PNEUMONIA PANEL","value":"SES POST TRANSPLANT/FEBRILE/NEUTROPEIA/PNEUMONIA PANEL"},
        //   {"name":"SES SEPSIS PANEL","type":"radio","label":"SES SEPSIS PANEL","value":"SES SEPSIS PANEL"},
        //   {"name":"SES SEPSIS+SES ABR(COMBO)","type":"radio","label":"SES SEPSIS+SES ABR(COMBO)","value":"SES SEPSIS+SES ABR(COMBO)"},
        //   {"name":"SKIN SCRAPING FOR FUNGUS","type":"radio","label":"SKIN SCRAPING FOR FUNGUS","value":"SKIN SCRAPING FOR FUNGUS"},
        //   {"name":"SKIN SWAB AND GRAM STAIN","type":"radio","label":"SKIN SWAB AND GRAM STAIN","value":"SKIN SWAB AND GRAM STAIN"},
        //   {"name":"SKIN SWAB FOR CULTURE & SENSITIVITY","type":"radio","label":"SKIN SWAB FOR CULTURE & SENSITIVITY","value":"SKIN SWAB FOR CULTURE & SENSITIVITY"},
        //   {"name":"SLIT & SMEAR FOR AFB","type":"radio","label":"SLIT & SMEAR FOR AFB","value":"SLIT & SMEAR FOR AFB"},
        //   {"name":"SMA GENE TEST(SPINAL MUSCULAR ATROPHY MICRODELETION PCR)","type":"radio","label":"SMA GENE TEST(SPINAL MUSCULAR ATROPHY MICRODELETION PCR)","value":"SMA GENE TEST(SPINAL MUSCULAR ATROPHY MICRODELETION PCR)"},
        //   {"name":"SPUTUM FOR AB (ASBESTOS BODIES)","type":"radio","label":"SPUTUM FOR AB (ASBESTOS BODIES)","value":"SPUTUM FOR AB (ASBESTOS BODIES)"},
        //   {"name":"SPUTUM FOR AFB ( CONCENTRATION METHOD )","type":"radio","label":"SPUTUM FOR AFB ( CONCENTRATION METHOD )","value":"SPUTUM FOR AFB ( CONCENTRATION METHOD )"},
        //   {"name":"SPUTUM FOR AFB 24Hours ( CONCENTRATION METHOD )","type":"radio","label":"SPUTUM FOR AFB 24Hours ( CONCENTRATION METHOD )","value":"SPUTUM FOR AFB 24Hours ( CONCENTRATION METHOD )"},
        //   {"name":"SPUTUM FOR AFB FOR 2/3 DAYS","type":"radio","label":"SPUTUM FOR AFB FOR 2/3 DAYS","value":"SPUTUM FOR AFB FOR 2/3 DAYS"},
        //   {"name":"SPUTUM FOR AFB STAIN","type":"radio","label":"SPUTUM FOR AFB STAIN","value":"SPUTUM FOR AFB STAIN"},
        //   {"name":"SPUTUM FOR CULTURE AND SENSITIVITY","type":"radio","label":"SPUTUM FOR CULTURE AND SENSITIVITY","value":"SPUTUM FOR CULTURE AND SENSITIVITY"},
        //   {"name":"SPUTUM FOR CYTOLOGY (OVA,CYST)","type":"radio","label":"SPUTUM FOR CYTOLOGY (OVA,CYST)","value":"SPUTUM FOR CYTOLOGY (OVA,CYST)"},
        //   {"name":"SPUTUM FOR FUNGAL STAIN","type":"radio","label":"SPUTUM FOR FUNGAL STAIN","value":"SPUTUM FOR FUNGAL STAIN"},
        //   {"name":"STAFF COVID-19 ANTIGEN TEST","type":"radio","label":"STAFF COVID-19 ANTIGEN TEST","value":"STAFF COVID-19 ANTIGEN TEST"},
        //   {"name":"STERILITY CHECK (COLLECTED BLOOD BAG)","type":"radio","label":"STERILITY CHECK (COLLECTED BLOOD BAG)","value":"STERILITY CHECK (COLLECTED BLOOD BAG)"},
        //   {"name":"STERILITY CHECK (EMPTY BLOOD-BAG)","type":"radio","label":"STERILITY CHECK (EMPTY BLOOD-BAG)","value":"STERILITY CHECK (EMPTY BLOOD-BAG)"},
        //   {"name":"STOOL FOR CULTURE & SENSITIVITY","type":"radio","label":"STOOL FOR CULTURE & SENSITIVITY","value":"STOOL FOR CULTURE & SENSITIVITY"},
        //   {"name":"STOOL FOR GRAM STAIN","type":"radio","label":"STOOL FOR GRAM STAIN","value":"STOOL FOR GRAM STAIN"},
        //   {"name":"STOOL FOR OPPORTUNISTIC PATHOGENS","type":"radio","label":"STOOL FOR OPPORTUNISTIC PATHOGENS","value":"STOOL FOR OPPORTUNISTIC PATHOGENS"},
        //   {"name":"STOOL R/E","type":"radio","label":"STOOL R/E","value":"STOOL R/E"},
        //   {"name":"SUDAN RED/OIL RED STAIN","type":"radio","label":"SUDAN RED/OIL RED STAIN","value":"SUDAN RED/OIL RED STAIN"},
        //   {"name":"SURFACE SAMPLE 1","type":"radio","label":"SURFACE SAMPLE 1","value":"SURFACE SAMPLE 1"},
        //   {"name":"SURFACE SAMPLE 2","type":"radio","label":"SURFACE SAMPLE 2","value":"SURFACE SAMPLE 2"},
        //   {"name":"SURFACE SAMPLE 3","type":"radio","label":"SURFACE SAMPLE 3","value":"SURFACE SAMPLE 3"},
        //   {"name":"SURFACE SAMPLE 4","type":"radio","label":"SURFACE SAMPLE 4","value":"SURFACE SAMPLE 4"},
        //   {"name":"SWAB CULTURE SAMPLE 1","type":"radio","label":"SWAB CULTURE SAMPLE 1","value":"SWAB CULTURE SAMPLE 1"},
        //   {"name":"SWAB CULTURE SAMPLE 2","type":"radio","label":"SWAB CULTURE SAMPLE 2","value":"SWAB CULTURE SAMPLE 2"},
        //   {"name":"SWAB CULTURE SAMPLE 3","type":"radio","label":"SWAB CULTURE SAMPLE 3","value":"SWAB CULTURE SAMPLE 3"},
        //   {"name":"SWAB CULTURE SAMPLE 4","type":"radio","label":"SWAB CULTURE SAMPLE 4","value":"SWAB CULTURE SAMPLE 4"},
        //   {"name":"SWAB FOR CULTURE & SENSITIVITY","type":"radio","label":"SWAB FOR CULTURE & SENSITIVITY","value":"SWAB FOR CULTURE & SENSITIVITY"},
        //   {"name":"SWAB FOR FUNGAL C/S","type":"radio","label":"SWAB FOR FUNGAL C/S","value":"SWAB FOR FUNGAL C/S"},
        //   {"name":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","type":"radio","label":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","value":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)"},
        //   {"name":"SYNOVIAL FLUID FOR AFB CULTURE & SENSITIVITY","type":"radio","label":"SYNOVIAL FLUID FOR AFB CULTURE & SENSITIVITY","value":"SYNOVIAL FLUID FOR AFB CULTURE & SENSITIVITY"},
        //   {"name":"SYNOVIAL FLUID FOR AFB STAINING","type":"radio","label":"SYNOVIAL FLUID FOR AFB STAINING","value":"SYNOVIAL FLUID FOR AFB STAINING"},
        //   {"name":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY","type":"radio","label":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY","value":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY"},
        //   {"name":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","type":"radio","label":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)","value":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(AUTOMATED)"},
        //   {"name":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(MANUAL)","type":"radio","label":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(MANUAL)","value":"SYNOVIAL FLUID FOR CULTURE & SENSITIVITY(MANUAL)"},
        //   {"name":"SYNOVIAL FLUID FOR GRAM STAIN","type":"radio","label":"SYNOVIAL FLUID FOR GRAM STAIN","value":"SYNOVIAL FLUID FOR GRAM STAIN"},
        //   {"name":"SYNOVIAL FLUID FOR STAINING","type":"radio","label":"SYNOVIAL FLUID FOR STAINING","value":"SYNOVIAL FLUID FOR STAINING"},
        //   {"name":"SYPHILIS IGM/IGG(SCREANING) TEST","type":"radio","label":"SYPHILIS IGM/IGG(SCREANING) TEST","value":"SYPHILIS IGM/IGG(SCREANING) TEST"},
        //   {"name":"TACROLIMUS","type":"radio","label":"TACROLIMUS","value":"TACROLIMUS"},
        //   {"name":"TAP WATER CULTURE","type":"radio","label":"TAP WATER CULTURE","value":"TAP WATER CULTURE"},
        //   {"name":"TB FERON (M.TUBERWLOSIS INTERFERON GAMMA RELEASE ASSAY IGRA)","type":"radio","label":"TB FERON (M.TUBERWLOSIS INTERFERON GAMMA RELEASE ASSAY IGRA)","value":"TB FERON (M.TUBERWLOSIS INTERFERON GAMMA RELEASE ASSAY IGRA)"},
        //   {"name":"TB PCR BLOOD","type":"radio","label":"TB PCR BLOOD","value":"TB PCR BLOOD"},
        //   {"name":"TB PCR FOR ASCITIC FLUID","type":"radio","label":"TB PCR FOR ASCITIC FLUID","value":"TB PCR FOR ASCITIC FLUID"},
        //   {"name":"TB PCR FOR CSF","type":"radio","label":"TB PCR FOR CSF","value":"TB PCR FOR CSF"},
        //   {"name":"TB PCR FOR PLEURAL FLUID","type":"radio","label":"TB PCR FOR PLEURAL FLUID","value":"TB PCR FOR PLEURAL FLUID"},
        //   {"name":"TB PCR FOR TISSUE","type":"radio","label":"TB PCR FOR TISSUE","value":"TB PCR FOR TISSUE"},
        //   {"name":"TB PCR FOR URINE","type":"radio","label":"TB PCR FOR URINE","value":"TB PCR FOR URINE"},
        //   {"name":"TB PLATINA","type":"radio","label":"TB PLATINA","value":"TB PLATINA"},
        //   {"name":"THROAT SWAB FOR CULTURE & SENSITIVITY","type":"radio","label":"THROAT SWAB FOR CULTURE & SENSITIVITY","value":"THROAT SWAB FOR CULTURE & SENSITIVITY"},
        //   {"name":"THROAT SWAB FOR GRAM STAIN","type":"radio","label":"THROAT SWAB FOR GRAM STAIN","value":"THROAT SWAB FOR GRAM STAIN"},
        //   {"name":"TISSUE CULTURE & SENSITIVITY","type":"radio","label":"TISSUE CULTURE & SENSITIVITY","value":"TISSUE CULTURE & SENSITIVITY"},
        //   {"name":"TISSUE FOR AFB STAIN","type":"radio","label":"TISSUE FOR AFB STAIN","value":"TISSUE FOR AFB STAIN"},
        //   {"name":"TISSUE FOR FUNGAL CULTURE","type":"radio","label":"TISSUE FOR FUNGAL CULTURE","value":"TISSUE FOR FUNGAL CULTURE"},
        //   {"name":"TISSUE FOR GRAM STAIN","type":"radio","label":"TISSUE FOR GRAM STAIN","value":"TISSUE FOR GRAM STAIN"},
        //   {"name":"TOTAL ANTI HBC","type":"radio","label":"TOTAL ANTI HBC","value":"TOTAL ANTI HBC"},
        //   {"name":"TOXO IgG & IgM","type":"radio","label":"TOXO IgG & IgM","value":"TOXO IgG & IgM"},
        //   {"name":"TRACHEAL ASPIRATE FOR AFB","type":"radio","label":"TRACHEAL ASPIRATE FOR AFB","value":"TRACHEAL ASPIRATE FOR AFB"},
        //   {"name":"TRACHEAL ASPIRATE FOR C/S","type":"radio","label":"TRACHEAL ASPIRATE FOR C/S","value":"TRACHEAL ASPIRATE FOR C/S"},
        //   {"name":"TRACHEAL ASPIRATE FOR FUNGAL STAIN","type":"radio","label":"TRACHEAL ASPIRATE FOR FUNGAL STAIN","value":"TRACHEAL ASPIRATE FOR FUNGAL STAIN"},
        //   {"name":"TRACHEAL ASPIRATE FOR GRAM STAIN","type":"radio","label":"TRACHEAL ASPIRATE FOR GRAM STAIN","value":"TRACHEAL ASPIRATE FOR GRAM STAIN"},
        //   {"name":"TRACHEAL SWAB FOR CULTURE & SENSITIVITY","type":"radio","label":"TRACHEAL SWAB FOR CULTURE & SENSITIVITY","value":"TRACHEAL SWAB FOR CULTURE & SENSITIVITY"},
        //   {"name":"TRACHEAL SWAB FOR GRAM STAIN","type":"radio","label":"TRACHEAL SWAB FOR GRAM STAIN","value":"TRACHEAL SWAB FOR GRAM STAIN"},
        //   {"name":"TREPONEMA PALLIDIUM HEMAGGLOTINATION ASSAY ( TPHA)","type":"radio","label":"TREPONEMA PALLIDIUM HEMAGGLOTINATION ASSAY ( TPHA)","value":"TREPONEMA PALLIDIUM HEMAGGLOTINATION ASSAY ( TPHA)"},
        //   {"name":"TRYPANOSOMA CRUZI IgG","type":"radio","label":"TRYPANOSOMA CRUZI IgG","value":"TRYPANOSOMA CRUZI IgG"},
        //   {"name":"TUBERCULOSIS SCREENING ( MANTOUX TEST)","type":"radio","label":"TUBERCULOSIS SCREENING ( MANTOUX TEST)","value":"TUBERCULOSIS SCREENING ( MANTOUX TEST)"},
        //   {"name":"URINE CULTURE","type":"radio","label":"URINE CULTURE","value":"URINE CULTURE"},
        //   {"name":"URINE FOR AFB (2/3 DAYS)","type":"radio","label":"URINE FOR AFB (2/3 DAYS)","value":"URINE FOR AFB (2/3 DAYS)"},
        //   {"name":"URINE FOR AFB CULTURE","type":"radio","label":"URINE FOR AFB CULTURE","value":"URINE FOR AFB CULTURE"},
        //   {"name":"URINE FOR CITRATE","type":"radio","label":"URINE FOR CITRATE","value":"URINE FOR CITRATE"},
        //   {"name":"URINE FOR FUNGAL SMEAR","type":"radio","label":"URINE FOR FUNGAL SMEAR","value":"URINE FOR FUNGAL SMEAR"},
        //   {"name":"URINE FOR OXALATE","type":"radio","label":"URINE FOR OXALATE","value":"URINE FOR OXALATE"},
        //   {"name":"URINE FUNGAL CULTURE","type":"radio","label":"URINE FUNGAL CULTURE","value":"URINE FUNGAL CULTURE"},
        //   {"name":"USG ASPIRATED FLUID FOR HYDROCOELE FOR AFB STAIN","type":"radio","label":"USG ASPIRATED FLUID FOR HYDROCOELE FOR AFB STAIN","value":"USG ASPIRATED FLUID FOR HYDROCOELE FOR AFB STAIN"},
        //   {"name":"USG ASPIRATED FLUID FOR HYDROCOELE FOR GRAM STAIN","type":"radio","label":"USG ASPIRATED FLUID FOR HYDROCOELE FOR GRAM STAIN","value":"USG ASPIRATED FLUID FOR HYDROCOELE FOR GRAM STAIN"},
        //   {"name":"VAGINAL DISCHARGE FOR CULTURE AND SENSITIVITY","type":"radio","label":"VAGINAL DISCHARGE FOR CULTURE AND SENSITIVITY","value":"VAGINAL DISCHARGE FOR CULTURE AND SENSITIVITY"},
        //   {"name":"VARICELLA ZOSTER VIRUS (VZA) IGM ANTIBODIES (CHECKEN POX)","type":"radio","label":"VARICELLA ZOSTER VIRUS (VZA) IGM ANTIBODIES (CHECKEN POX)","value":"VARICELLA ZOSTER VIRUS (VZA) IGM ANTIBODIES (CHECKEN POX)"},
        //   {"name":"VDRL SCREENING","type":"radio","label":"VDRL SCREENING","value":"VDRL SCREENING"},
        //   {"name":"WEIL FELIX","type":"radio","label":"WEIL FELIX","value":"WEIL FELIX"},
        //   {"name":"WIDAL TEST","type":"radio","label":"WIDAL TEST","value":"WIDAL TEST"},
        //   {"name":"WOUND SWAB FOR CULTURE & SENSITIVITY","type":"radio","label":"WOUND SWAB FOR CULTURE & SENSITIVITY","value":"WOUND SWAB FOR CULTURE & SENSITIVITY"},
        //   {"name":"WOUND SWAB FOR GRAM STAIN","type":"radio","label":"WOUND SWAB FOR GRAM STAIN","value":"WOUND SWAB FOR GRAM STAIN"},
        //   {"name":"ALPHA-1 ANTITRYPSIN GENOTYPING","type":"radio","label":"ALPHA-1 ANTITRYPSIN GENOTYPING","value":"ALPHA-1 ANTITRYPSIN GENOTYPING"},
        //   {"name":"BCR ABL 1 KINASE DOMAIN MUTATION ANALYSIS","type":"radio","label":"BCR ABL 1 KINASE DOMAIN MUTATION ANALYSIS","value":"BCR ABL 1 KINASE DOMAIN MUTATION ANALYSIS"},
        //   {"name":"BIOFIRE BLOOD PANEL","type":"radio","label":"BIOFIRE BLOOD PANEL","value":"BIOFIRE BLOOD PANEL"},
        //   {"name":"BIOFIRE CSF PANEL","type":"radio","label":"BIOFIRE CSF PANEL","value":"BIOFIRE CSF PANEL"},
        //   {"name":"CFTR GENE MUTATION","type":"radio","label":"CFTR GENE MUTATION","value":"CFTR GENE MUTATION"},
        //   {"name":"CMV VIRAL LOAD","type":"radio","label":"CMV VIRAL LOAD","value":"CMV VIRAL LOAD"},
        //   {"name":"DUCHENNE / BECKER MUSCULAR DYSTROPHY BY PCR","type":"radio","label":"DUCHENNE / BECKER MUSCULAR DYSTROPHY BY PCR","value":"DUCHENNE / BECKER MUSCULAR DYSTROPHY BY PCR"},
        //   {"name":"FIP1L1 PDGFRA GENE REARRANGEMENT","type":"radio","label":"FIP1L1 PDGFRA GENE REARRANGEMENT","value":"FIP1L1 PDGFRA GENE REARRANGEMENT"},
        //   {"name":"HLA - 5 LOCi (A,B,C, DR B1, DQ1) HR-LOCITYPING (EDTA)","type":"radio","label":"HLA - 5 LOCi (A,B,C, DR B1, DQ1) HR-LOCITYPING (EDTA)","value":"HLA - 5 LOCi (A,B,C, DR B1, DQ1) HR-LOCITYPING (EDTA)"},
        //   {"name":"HLA - 6 LOCI (A,B,C, DR B1, DQ1) HR-LOCITYPING (EDTA)","type":"radio","label":"HLA - 6 LOCI (A,B,C, DR B1, DQ1) HR-LOCITYPING (EDTA)","value":"HLA - 6 LOCI (A,B,C, DR B1, DQ1) HR-LOCITYPING (EDTA)"},
        //   {"name":"LEUKO DYSTROPHY GENE PANEL BY NGS","type":"radio","label":"LEUKO DYSTROPHY GENE PANEL BY NGS","value":"LEUKO DYSTROPHY GENE PANEL BY NGS"},
        //   {"name":"MYC GENE","type":"radio","label":"MYC GENE","value":"MYC GENE"},
        //   {"name":"HYDATID SEROLOGY COMPLEMENT FIXATION","type":"radio","label":"HYDATID SEROLOGY COMPLEMENT FIXATION","value":"HYDATID SEROLOGY COMPLEMENT FIXATION"},
        //   {"name":"KALA-AZAR","type":"radio","label":"KALA-AZAR","value":"KALA-AZAR"},
        //   {"name":"LEISHMANIA DONOVANI ( LD ) BODIES DETECTION","type":"radio","label":"LEISHMANIA DONOVANI ( LD ) BODIES DETECTION","value":"LEISHMANIA DONOVANI ( LD ) BODIES DETECTION"},
        //   {"name":"STOOL FOR ROTA VIRUS ANTIGEN","type":"radio","label":"STOOL FOR ROTA VIRUS ANTIGEN","value":"STOOL FOR ROTA VIRUS ANTIGEN"}
        // ],
        inputs: [
          {
            name: 'Search',
            placeholder: 'Search here',
            type: 'text', 
            id: 'search'
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data: any) => {
              //console.log(data)
              //this.filterdata(data)
            }
          }
        ]
      });
  
      await this.alert.present(); 
     // this.updateAlertMessage(json);

    
    });
   
   
  }
  filterdata(){
    //console.log(data.Search)
    var search2 = ((document.getElementById("search") as HTMLInputElement).value);
    const formData = new FormData();
    formData.append('token', 'ZXYlmPt6OpAmaLFfjkdjldfjdlM')
    formData.append('data', search2)
    this.http.post("https://cureplus.online/APIs/filterdata1.php", formData)
    .pipe(
      finalize(() => {
      })
    )
    .subscribe(res => {
      var l=0
      this.row_data=[]
      this.zone.run(() => {
        var json=JSON.parse(JSON.stringify(res))
        for(var i=0; i<json.length;i++){
          l++
          //console.log(json[0])
          this.row_data.push({
            dataid: 'dates'+l,
            name: json[i].name,
            category:json[i].category,
            address:json[i].address,
            rating:json[i].rating,
            count:Number(json[i].maxlimit),
            status:json[i].status,
            id:json[i].id
          })
        }
      });
  
    });
  }


}
