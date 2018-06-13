import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {MenuPage} from "../menu/menu";

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  constructor( public navCrtl: NavController){}

  goMenu(){
    this.navCrtl.push(MenuPage);
  }

}
