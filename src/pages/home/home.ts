import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, ToastController} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import {WooCommerceProvider} from "../../providers/woocommerce/woocommerce";
import {ProductDetailsPage} from "../product-details/product-details";
import {SearchPage} from "../search/search";
import { Storage } from '@ionic/storage';
import {CartPage} from "../cart/cart";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts: any[];
  page: number;
  searchQuery: string = "";


  cartItems: any[] = [];
  count: any;
  productuser: any;

  @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, private woocommerce: WooCommerceProvider, public toastCtrl: ToastController,  public storage: Storage) {

    this.page = 2;
    this.productuser = {};

    this.WooCommerce = WC({
      url: "http://lifestylefurniture.co/lelebaba",
      consumerKey: "ck_8810abbfd1cb8d6c0573757dd61b35b059c2157c",
      consumerSecret: "cs_6b97edf0b39010475b209826ae123a4354258fc0"
    });

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then( (data) => {
      console.log('Slide Products',JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err)
    })



  }//end of constructor

  ionViewDidEnter(){

    this.storage.ready().then(()=>{

      this.storage.get("cart").then( (data)=>{
        this.cartItems = data;
        console.log ('count', this.cartItems);
        this.count = this.cartItems.length;



        if(this.cartItems.length > 0){
          this.cartItems.forEach( (item, index)=> {

            this.productuser = item.user_id;
            // console.log('qqqqqqqqq',this.productuser )
            // if ( this.productuser == this.user.id){
            //
            //   // console.log ('success with obj', Object.keys(item) );
            //   console.log ('success data', item);
            // }

          })

        }






      })

    })
  }


  ionViewDidLoad(){

    // #3 section ( product slider )
    setInterval(()=> {
      if(this.productSlides.getActiveIndex() == this.productSlides.length() -1)
        this.productSlides.slideTo(0);

      this.productSlides.slideNext();
    }, 3000)

  }


  loadMoreProducts(event){
    console.log(event);
    if(event == null)
    {
      this.page = 2;
      this.moreProducts = [];
    }
    else
      this.page++;

    this.WooCommerce.getAsync("products?page=" + this.page).then( (data) => {
      console.log('Product List',JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if(event != null)
      {
        event.complete();
      }

      if(JSON.parse(data.body).products.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();

      }


    }, (err) => {
      console.log(err)
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product} );
  }

  mySearch(event){

    if(this.searchQuery.length > 0){
      this.navCtrl.push(SearchPage, {"searchQuery": this.searchQuery});
    }
  }

  onLoadCartPage(){
    this.navCtrl.push(CartPage);
  }

}
