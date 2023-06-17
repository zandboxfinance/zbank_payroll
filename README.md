# zbank_payroll

https://youtu.be/H6Wu9n9Qwa8
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


