import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { IcService } from './ic.service';
import { IcBitcoinService } from './ic.bitcoin.service';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  frontendCanisterId = environment.frontendCanisterId;
  isCollapsed = false;
  enablePortal = false;
  isLoadingForWallet = false;
  isDisableForWallet = true;
  bitcoin_address = '';

  title = 'frontend';

  isWalletVisible = false;

  // response to display into the template
  ic_response: string = '';
  walletList: any;
  networks = ['BTC', 'ETH', 'TRON'];
  currentWalletInfo: any;
  currenctWalletAddress: string = '';
  // import the service to this component
  constructor(
    private router: Router,
    private ngxSpinnerService: NgxSpinnerService,
    private icService: IcService,
    private icBitcoinService: IcBitcoinService
  ) {
  }

  // service call from the component
  // public async getGreet(name:string){
  //   try{
  //     this.ic_response = await this.icService.greet(name);
  //   }
  //   catch(err){
  //     console.log(err);
  //   }
  // }
  ngOnInit() {
    (async () => {
      this.bitcoin_address = await this.icBitcoinService.get_bitcoin_address();
      this.isDisableForWallet = false;
      console.log(this.bitcoin_address);
    })();
    // this.ngxSpinnerService.show();
  }
  ngAfterViewInit(): void {
  }
  public demoLogin() {
    this.enablePortal = !this.enablePortal;
    this.router.navigate(['/portal']);
  }
  public showWallet() {
    this.getWallet();
  }
  public closeWallet() {
    this.isWalletVisible = false;
  }
  async getWallet() {
    this.isLoadingForWallet = true;
    // let tmpListOfData = new Array();
    try {
      // const f = await this.icService.get_wallet();
      // f.forEach( (element: any) => {
      //   let tmpData = {network: Object.keys(element.network[0]), wallet_address: element.wallet_address};
      //   tmpListOfData.push(tmpData);
      // });
      // this.walletList = tmpListOfData;
      const bitcoin_balance = await this.icBitcoinService.get_bitcoin_balance(this.bitcoin_address);
      // this.walletList = [{ network: 'BTC', address: this.bitcoin_address, balance: Number(bitcoin_balance) / 100000000 }];
      //TODO API Get wallet
      this.walletList = {
        BTC: { address: this.bitcoin_address, content: [{ currency: 'BTC', balance: Number(bitcoin_balance) / 100000000 }] },
        ETH: { address: '', content: [{ currency: 'ETH', balance: '0' }, { currency: 'USDT', balance: '0' }] },
        TRON: { address: '', content: [{ currency: 'TRON', balance: '0' }, { currency: 'USDT', balance: '0' }] },
      }
      this.refreshWallet('BTC');
      this.isLoadingForWallet = false;
      this.isWalletVisible = true;
      // console.log(f);
    }
    catch (err) {
      console.log(err);
    }
  }

  refreshWallet(network: string) {
    this.currentWalletInfo = this.walletList[network].content;
    this.currenctWalletAddress = this.walletList[network].address;
  }


}
