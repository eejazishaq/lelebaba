import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';


@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public alertCtrl: AlertController,
              public payPal: PayPal,

  ){

    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      { method_id: "bacs", method_title: "Direct Bank Transfer" },
      { method_id: "cheque", method_title: "Cheque Payment" },
      { method_id: "cod", method_title: "Cash on Delivery" },
      { method_id: "paypal", method_title: "PayPal" }];


    this.WooCommerce = WC({
      url: "http://lifestylefurniture.co/lelebaba",
      consumerKey: "ck_8810abbfd1cb8d6c0573757dd61b35b059c2157c",
      consumerSecret: "cs_6b97edf0b39010475b209826ae123a4354258fc0"
    });

    this.storage.get("userLoginInfo").then((userLoginInfo) => {

      this.userInfo = userLoginInfo.user;

      let email = userLoginInfo.user.email;

      this.WooCommerce.getAsync("customers/email/" + email).then((data) => {

        this.newOrder = JSON.parse(data.body).customer;

      })

    })

  }//End of constructor

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;

    if (this.billing_shipping_same) {
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }

  }

  placeOrder() {

    let orderItems: any[] = [];
    let data: any = {};

    let paymentData: any = {};

    this.paymentMethods.forEach((element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });


    data = {
      payment_details: {
        method_id: paymentData.method_id,
        method_title: paymentData.method_title,
        paid: true
      },

      billing_address: this.newOrder.billing_address,
      shipping_address: this.newOrder.shipping_address,
      customer_id: this.userInfo.id || '',
      line_items: orderItems
    };


    if (paymentData.method_id == "paypal") {

      this.payPal.init({
        PayPalEnvironmentProduction: "YOUR_PRODUCTION_CLIENT_ID",
        PayPalEnvironmentSandbox: "AVrzn8JnQ6v11UqUG3ShVuEldeLNFynsxHd9owjJF5YNCjY7zEuh-42BKL7x_YC_J6g6QKHolO6b65y_"
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {

          this.storage.get("cart").then((cart) => {

            let total = 0.00;
            cart.forEach((element, index) => {
              orderItems.push({ product_id: element.product.id, quantity: element.qty });
              total = total + (element.product.price * element.qty);
            });

            let payment = new PayPalPayment(total.toString(), 'USD', 'Description', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then((response) => {
              // Successfully paid

              alert(JSON.stringify(response));


              data.line_items = orderItems;
              //console.log(data);
              let orderData: any = {};

              orderData.order = data;

              this.WooCommerce.postAsync('orders', orderData).then((data) => {
                alert("Order placed successfully!");

                let response = (JSON.parse(data.body).order);

                this.alertCtrl.create({
                  title: "Order Placed Successfully",
                  message: "Your order has been placed successfully. Your order number is " + response.order_number,
                  buttons: [{
                    text: "OK",
                    handler: () => {
                      this.navCtrl.push('HomePage');
                    }
                  }]
                }).present();
              })

            })

          }, () => {
            // Error or render dialog closed without being successful
          });
        }, () => {
          // Error in configuration
        });
      }, () => {
        // Error in initialization, maybe PayPal isn't supported or something else
      });





    } else {

      this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });

        data.line_items = orderItems;

        let orderData: any = {};

        orderData.order = data;

        this.WooCommerce.postAsync("orders", orderData).then((data) => {

          // console.log(JSON.parse(data.body).order);
          let response = (JSON.parse(data.body).order);

          this.alertCtrl.create({
            title: "Order Placed Successfully",
            message: "Your order has been placed successfully. Your order number is " + response.order_number,
            buttons: [{
              text: "OK",
              handler: () => {
                this.navCtrl.setRoot('HomePage');
              }
            }]
          }).present();

        })

      })

    }


  }


}
