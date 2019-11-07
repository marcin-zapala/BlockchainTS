# BlockchainTS
It will be complete solution to handle simple PoW based blockchain

(Work in progress)
## Setup

```
npm install --global lerna

git clone https://github.com/marcin-zapala/BlockchainTS.git

lerna bootstrap --hoist

lerna run tsc
```

### Todos:
 - [x] local blockchain
 - [x] add lerna for monorepo (core, API, blockexplorer)
 - [ ] endpoints to work on nodes (WIP)
 - [ ] online startup from lerna
 - [ ] integrate with CircleCi
    - [ ] run checks only on changed repo
 - [ ] add pull request template
 - [ ] decentalizing 
 - [ ] synchoronizing
 - [ ] consensus
 - [ ] blockexplorer
 