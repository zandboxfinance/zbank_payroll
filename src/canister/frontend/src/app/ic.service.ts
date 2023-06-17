import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

// IC Imports
const Actor = require("@dfinity/agent").Actor;
const HttpAgent = require("@dfinity/agent").HttpAgent;

const idlFactory = require('../../../../declarations/zbank_payroll_backend/zbank_payroll_backend.did.js').idlFactory;
const idlBitcoinFactory = require('../../../../declarations/zbank_bitcoin/zbank_bitcoin.did.js').idlFactory;

@Injectable({
  providedIn: 'root'
})
export class IcService {

  Actor? : any;

  constructor() {
    // define backend canister ID
    const canisterId = environment.backendCanisterId;

    // create an finity/agent
    const agent = new HttpAgent( {host: environment.backendHost} );

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

  // this is our gateway to the backend canister
  public async greet(name:string){
    return await this.Actor.greet(name);
  }
  public async get_scheduled_transaction(){
    return await this.Actor.get_scheduled_transaction();
  }
  public async add_scheduled_transaction(to_address:string, routine_type:string, network:string, currency:string, amount:number, charge_fees_from:string){
    const json_string = Object.assign({});
    json_string.to_address = to_address;
    routine_type = routine_type.toUpperCase();
    json_string.routine_type = { [routine_type]: null };
    network = network.toUpperCase();
    json_string.network = { [network]: null };
    currency = currency.toUpperCase();
    json_string.currency = { [currency]: null };
    json_string.amount = amount;
    charge_fees_from = charge_fees_from.toUpperCase();
    json_string.charge_fees_from = { [charge_fees_from]: null };
    console.log(json_string);
    return await this.Actor.add_scheduled_transaction(json_string);
  }
  public async delete_scheduled_transaction(id:string){
    return await this.Actor.delete_scheduled_transaction(id);
  }
  public async get_pending_transaction(){
    return await this.Actor.get_pending_transaction();
  }
  public async get_pending_transaction_detail(id: string){
    return await this.Actor.get_pending_transaction_detail(id);
  }
  public async review_pending_transaction(id: string, reviewed_status: string){
    return await this.Actor.review_pending_transaction(id, { [reviewed_status]: null });
  }
  public async get_executed_transaction(){
    return await this.Actor.get_executed_transaction();
  }
}