import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
import {ProductDetailsPage} from "../product-details/product-details";
import {HomePage} from "../home/home";


@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.page = 1;
    this.category = this.navParams.get("category");

    this.WooCommerce = WC({
      url: "http://lifestylefurniture.co/lelebaba",
      consumerKey: "ck_8810abbfd1cb8d6c0573757dd61b35b059c2157c",
      consumerSecret: "cs_6b97edf0b39010475b209826ae123a4354258fc0"
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data) => {
      console.log('Products by Category',JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err)
    })


  }

  loadMoreProducts(event) {
    this.page++;
    console.log("Getting page " + this.page);
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
      let temp = (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
      event.complete();

      if (temp.length < 10)
        event.enable(false);
    })
  }

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product} );
  }


  toGoBack(){
    // console.count('sdfdf');
    // this.navCtrl.popToRoot();
    this.navCtrl.pop();
  }


}
