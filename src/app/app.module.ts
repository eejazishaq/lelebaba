import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import {WooCommerceProvider} from "../providers/woocommerce/woocommerce";
import {ProductsByCategoryPage} from "../pages/products-by-category/products-by-category";
import {ProductDetailsPage} from "../pages/product-details/product-details";

import { IonicStorageModule } from '@ionic/storage';
import {CartPage} from "../pages/cart/cart";
import {SignupPage} from "../pages/signup/signup";
import {LoginPage} from "../pages/login/login"
import {CheckoutPage} from "../pages/checkout/checkout";
import { PayPal } from '@ionic-native/paypal';
import {MenuPage} from "../pages/menu/menu";
// import {HttpClientModule} from '@angular/common/http';
import { OneSignal } from '@ionic-native/onesignal';
import {SearchPage} from "../pages/search/search";
import {IntroPage} from "../pages/intro/intro";
import {HideHeaderDirective} from "../directives/hide-header/hide-header";
import {HideToolDirective} from "../directives/hide-tool/hide-tool";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ListPage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage,
    LoginPage,
    CheckoutPage,
    SearchPage,
    IntroPage,
    HideHeaderDirective,
    HideToolDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    ListPage,
    ProductsByCategoryPage,
    ProductDetailsPage,
    CartPage,
    SignupPage,
    LoginPage,
    CheckoutPage,
    SearchPage,
    IntroPage
  ],
  providers: [
    StatusBar,
    WooCommerceProvider,
    SplashScreen,
    PayPal,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

  ]
})
export class AppModule {}
