import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';
import { Location } from "@angular/common";
@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.page.html',
  styleUrls: ['./assistant.page.scss'],
})

export class AssistantPage implements OnInit {
  
  constructor(private router:Router,private location:Location) { }
  setlocations:any
  flag=true
  ngOnInit() {
  }
  goto(id){
    this.router.navigateByUrl('/locationresult/'+id);
  }
  setlocation(id){
    this.flag=false
    this.setlocations=id
  }
  reset(){
    this.flag=true
    this.setlocations=''
  }
  goBack(){
    this.location.back();
  }

}
