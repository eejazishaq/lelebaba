import { Component } from '@angular/core';
import {Events, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {CheckoutPage} from "../checkout/checkout";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  cartItems: any[] =[];
  total: any;
  count: any;
  loggedIn: boolean;
  user: any;
  productUser: any[] = [];
  myitem: any;
  showEmptyCartMessage: boolean = false;

  constructor(private events: Events, public navCtrl: NavController, public navParams: NavParams,  public storage: Storage, public viewCtrl: ViewController, public toastController: ToastController) {

    // this.currentUser = this.navParams.get("user");
    this.user = {};
    this.total = 0.0;


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
        console.log('data',this.cartItems);



        if(this.cartItems.length > 0){

          this.cartItems.forEach( (item, index)=> {

            // this.productUser = item;
            // console.log('test ppppp', this.productUser);


            if ( item.user_id == this.user.id){
              this.total = this.total + (item.product.price * item.qty);

              // this.productUser = item;
              // console.log('test ppppp', this.productUser);

            }

          })

        } else {

          this.showEmptyCartMessage = true;

        }

      })

    })



  }// end of constructor

  ionViewDidEnter(){

    // this.storage.get("userLoginInfo").then( (data) => {
    //   if(data == null){
    //     this.navCtrl.push(LoginPage);
    //   }
    // });



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

  }

  removeFromCart(item, i){

    let price = item.product.price;
    let qty = item.qty;

    this.cartItems.splice(i, 1);

    this.storage.set("cart", this.cartItems).then( ()=> {

      this.total = this.total - (price * qty);

    });

    if(this.cartItems.length == 0){
      this.showEmptyCartMessage = true;
    }


  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  checkout(){

    this.storage.get("userLoginInfo").then( (data) => {
      if(data != null){
        this.navCtrl.push(CheckoutPage);
      } else {
        this.navCtrl.push(LoginPage, {next: 'Checkout'})
      }
    })

  }




}
