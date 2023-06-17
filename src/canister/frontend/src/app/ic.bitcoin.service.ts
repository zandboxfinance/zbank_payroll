import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

// IC Imports
const Actor = require("@dfinity/agent").Actor;
const HttpAgent = require("@dfinity/agent").HttpAgent;

const idlFactory = require('../../../../declarations/zbank_bitcoin/zbank_bitcoin.did.js').idlFactory;

@Injectable({
  providedIn: 'root'
})
export class IcBitcoinService {

  Actor? : any;

  constructor() {
    // define backend canister ID
    const canisterId = environment.bitcoinCanisterId;

    // create an finity/agent
    const agent = new HttpAgent( {host: environment.bitcoinHost} );

    /*
    if(!environment.production) {
      agent.fetchRootKey();
    }
    */
    // you can comment this line for production
    agent.fetchRootKey();

    // finally create an actor as the main gateway to your public exposed functions
    this.Actor = Actor.createActor(idlFactory, {agent, canisterId});
  }

  public async get_bitcoin_address(){
    return await this.Actor.get_p2pkh_address();
  }

  public async get_bitcoin_balance(address: string){
    return await this.Actor.get_balance(address);
  }

  public async send(destination_address: string, amount: number){
    const json_string = Object.assign({});
    json_string.destination_address = destination_address;
    json_string.amount_in_satoshi = amount * 100000000;
    return await this.Actor.send(json_string);
  }

}