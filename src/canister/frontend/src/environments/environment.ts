import canisters from '../../../../../.dfx/local/canister_ids.json';

export const environment = {
  production: false,
  frontendCanisterId: canisters.zbank_payroll_frontend.local,
  backendCanisterId: canisters.zbank_payroll_backend.local,
  bitcoinCanisterId: canisters.zbank_bitcoin.local,
  backendHost: 'http://localhost:4943',
  bitcoinHost: 'http://localhost:4943'
};