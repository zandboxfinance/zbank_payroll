# zbank_payroll
A crypto payroll back office built on the internet computer. 

<kbd>
<img width="800" alt="image" src="https://github.com/zandboxfinance/zbank_payroll/assets/136881343/17b1f403-598f-4e15-a710-bfc9edf42681">
</kbd>

# Prerequisites
* Downloaded and installed [Node.js](https://nodejs.org/en).
* Downloaded and installed [Angular](https://angular.io/cli).
* Downloaded and installed the [DFINITY Canister SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install#installing-the-ic-sdk-1).
* Downloaded [Bitcoin Node](https://youtu.be/H6Wu9n9Qwa8)
* Remember to stop any Internet Computer or other network process that would create a port conflict on 4943.

# Demo
## Environment preparation

1. Start Bitcoin local node

   ```bash
   ./bin/bitcoind -conf=$(pwd)/bitcoin.conf -datadir=$(pwd)/data --port=18444
   ```
   
1. Start ICP local network

   ```bash
   dfx start --clean --background
   ```

## Deploy the project on ICP local network

1. backend

   ```bash
   cargo update
   dfx deploy zbank_payroll_backend
   ```
   
1. bitcoin

   ```bash
   dfx deploy zbank_bitcoin --argument '(variant { Regtest })'
   ```
   
1. frontend (We use Angular to build)

   ```bash
   dfx generate zbank_bitcoin
   dfx generate zbank_payroll_backend
   cd src/canister/frontend
   npm install
   ng build
   dfx deploy zbank_payroll_frontend
   ```
   
   You can also use `ng serve` to start frontend server without deploy on ICP.

## Usefule Bitcoin commands

1. mining

   ```bash
   ./bin/bitcoin-cli -conf=$(pwd)/bitcoin.conf generatetoaddress <number-of-blocks> <address>
   ```

1. check mem pool

   ```bash
   ./bin/bitcoin-cli -conf=$(pwd)/bitcoin.conf getrawmempool
   ```

1. Create wallet

   ```bash
   ./bin/bitcoin-cli -conf=$(pwd)/bitcoin.conf -regtest createwallet "<wallet_name>"
   ```

1. Load wallet

   ```bash
   ./bin/bitcoin-cli -conf=$(pwd)/bitcoin.conf loadwallet "<wallet_name>"
   ```

1. Get new wallet address

   ```bash
   ./bin/bitcoin-cli -conf=$(pwd)/bitcoin.conf getnewaddress "<wallet_name>" "legacy"
   ```

# Todo
* Make data persistent (preupgrade and postupgrade)
* Deploy on ICP main network
* Support other networks like ETH, TRON, etc.
* Design business model to cover cycle costs
* Add network fee and platform fee features
* Add IAM(Identity Access Management) and RBAC(role-based access control)

# Next Roadmap
* Unsecured Loan: With transaction data on the payroll back office, we can provide credit rating for companies, and build the next product to link them with investors.

