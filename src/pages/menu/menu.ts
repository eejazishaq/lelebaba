import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Events } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";
import {SignupPage} from "../signup/signup";
import {CartPage} from "../cart/cart";
import {LoginPage} from "../login/login";
import {ProductsByCategoryPage} from "../products-by-category/products-by-category";


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  @ViewChild('content') childNavCtrl: NavController;
  homePage:any =  Component;
  WooCommerce: any;
  categories: any[];

  //user login
  loggedIn: boolean;
  user: any;
  productuser: any;

  //cart
  cartItems: any[] = [];
  count: any;
  item: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, private events: Events) {
    this.homePage = HomePage;
    this.categories = [];
    this.user = {};
    this.productuser = {};
    // this.item = {};

    this.WooCommerce = WC({
      url: "http://lifestylefurniture.co/lelebaba",
      consumerKey: "ck_8810abbfd1cb8d6c0573757dd61b35b059c2157c",
      consumerSecret: "cs_6b97edf0b39010475b209826ae123a4354258fc0"

    });


    //To show Categories

    this.WooCommerce.getAsync("products/categories").then((data) => {
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;

      for (let i = 0; i < temp.length; i++) {
        if (temp[i].parent == 0) {

          temp[i].subCategories = [];

          if (temp[i].slug == "clothing") {
            temp[i].icon = "shirt";
          }
          if (temp[i].slug == "music") {
            temp[i].icon = "musical-notes";
          }
          if (temp[i].slug == "posters") {
            temp[i].icon = "images";
          }

          this.categories.push(temp[i]);
        }
      }

      //Groups Subcategories

      for (let i = 0; i < temp.length; i++){
        for (let j = 0; j < this.categories.length; j++){
          //console.log("Checking " + j + " " + i)
          if(this.categories[j].id == temp[i].parent){
            this.categories[j].subCategories.push(temp[i]);
          }
        }
      }



    }, (err) => {
      console.log(err)
    });


    // To Check User Login or Not
    this.events.subscribe("updateMenu", () => {
      this.storage.ready().then(() => {
        this.storage.get("userLoginInfo").then((userLoginInfo) => {

          if (userLoginInfo != null) {

            console.log("User logged in...");
            this.user = userLoginInfo.user;
            console.log('user name',this.user);
            this.loggedIn = true;
          }
          else {
            console.log("No user found.");
            this.user = {};
            this.loggedIn = false;
          }

        })
      });


    })
  }//End Const


  ionViewDidEnter() {

    this.storage.ready().then(() => {
      this.storage.get("userLoginInfo").then((userLoginInfo) => {

        if (userLoginInfo != null) {

          console.log("User logged in...");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        }
        else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }

      })
    });


    this.storage.ready().then(()=>{

      this.storage.get("cart").then( (data)=>{
        this.cartItems = data;
        console.log ('Menu Count', this.cartItems);
        this.count = this.cartItems.length;


      })

    })





  }

  openCategoryPage(category) {

    this.navCtrl.push(ProductsByCategoryPage, { "category": category });

  }

  openPage(pageName: string) {
    if (pageName == "signup") {
      this.navCtrl.push(SignupPage);
    }
    if (pageName == "login") {
      this.navCtrl.push(LoginPage);
    }
    if (pageName == 'logout') {
      this.storage.remove("userLoginInfo").then(() => {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if (pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }

  }

  // openCart(user){
  //     let modal = this.modalCtrl.create(CartPage, {"user": user});
  //     modal.present();
  // }




}
