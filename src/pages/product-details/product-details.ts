import { Component } from '@angular/core';
import {Events, ModalController, NavController, NavParams, ToastController} from 'ionic-angular';
import * as WC from 'woocommerce-api';

import { Storage } from '@ionic/storage';
import {CartPage} from "../cart/cart";


@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  //user login
  loggedIn: boolean;
  user: any;

  product: any;
  WooCommerce: any;
  reviews: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController, private events: Events) {

    this.user = {};
    this.product = this.navParams.get("product");

    console.log('this product',this.product);


    this.WooCommerce = WC({
      url: "http://lifestylefurniture.co/lelebaba",
      consumerKey: "ck_8810abbfd1cb8d6c0573757dd61b35b059c2157c",
      consumerSecret: "cs_6b97edf0b39010475b209826ae123a4354258fc0"
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then((data) => {

      this.reviews = JSON.parse(data.body).product_reviews;
      console.log('review',this.reviews);

    }, (err) => {
      console.log(err);
    })


    // To Check User Login or Not
    // this.events.subscribe("updateMenu", () => {
    //   this.storage.ready().then(() => {
    //     this.storage.get("userLoginInfo").then((userLoginInfo) => {
    //
    //       if (userLoginInfo != null) {
    //
    //         console.log("User logged in...");
    //         this.user = userLoginInfo.user;
    //         console.log('user name',this.user);
    //         this.loggedIn = true;
    //       }
    //       else {
    //         console.log("No user found.");
    //         this.user = {};
    //         this.loggedIn = false;
    //       }
    //
    //     })
    //   });
    //
    //
    // })




  }//end of constructor



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

  }//end of ion viw



  addToCart(product, user) {


    this.storage.get("cart").then((data) => {


        if (data == null || data.length == 0) {
          data = [];

          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price),
            "user_id": user.id
          });


        } else {

          let added = 0;

          for (let i = 0; i < data.length; i++) {

            if (product.id == data[i].product.id) {
              let qty = data[i].qty;

              console.log("Product is already in the cart");

              data[i].qty = qty + 1;
              data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
              added = 1;
            }

          }

          if (added == 0) {
            data.push({
              "product": product,
              "qty": 1,
              "amount": parseFloat(product.price),
              "user_id": user.id
            })
          }

        }


        this.storage.set("cart", data).then(() => {
          console.log("Cart Updated");
          console.log(data);

          this.toastCtrl.create({
            message: "Cart Updated",
            duration: 3000
          }).present();

        })



    })

  }

  openCart(){

    this.modalCtrl.create(CartPage).present();

  }



}
