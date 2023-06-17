# zbank_payroll

A crypto payroll back office built on the internet computer. 

<kbd>
<img width="800" alt="image" src="https://github.com/zandboxfinance/zbank_payroll/assets/136881343/17b1f403-598f-4e15-a710-bfc9edf42681">
</kbd>

# Prerequisites
* Downloaded and installed [Node.js](https://nodejs.org/en).
* Downloaded and installed the [DFINITY Canister SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install#installing-the-ic-sdk-1).
* Downloaded [Bitcoin node](https://youtu.be/H6Wu9n9Qwa8)
* Remember to stop any Internet Computer or other network process that would create a port conflict on 4943.

# Demo
Bitcoin local node
```bash
./bin/bitcoind -conf=$(pwd)/bitcoin.conf -datadir=$(pwd)/data --port=18444
```

Start dfinity network locally
```bash
dfx start --clean --background
```
## Deploy the project on ICP local network

backend
```bash
cargo update
dfx deploy zbank_payroll_backend
```

bitcoin
```bash
dfx deploy zbank_bitcoin --argument '(variant { Regtest })'
```

frontend
```bash
dfx generate zbank_bitcoin
dfx generate zbank_payroll_backend
cd zbank_payroll/src/canister/frontend
npm install
ng build
dfx deploy zbank_payroll_frontend
```
`ng serve` which will start a server at `http://localhost:4200`, proxying API requests to the replica at port 4943.


