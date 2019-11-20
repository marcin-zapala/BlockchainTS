# BlockchainTS
It will be complete solution to handle simple PoW based blockchain

## Setup

```
npm install --global lerna

git clone https://github.com/marcin-zapala/BlockchainTS.git

lerna bootstrap --hoist

lerna run tsc

```

## Startup
add new node to nodes pool
~~~
lerna run node_1 //will run locally node on port 3001

localhost:3001/register-and-broadcast-node

body {
    allNetworkNodes: string[]
}
~~~

on new node invoke

~~~
newNodeUrl:port/consensus
~~~

now you have new synchronized node in your network


### Todos:
 - [x] local blockchain
 - [x] add lerna for monorepo (core, API, blockexplorer)
 - [x] endpoints to work on nodes
 - [x] decentalizing 
 - [x] synchoronizing
 - [x] consensus (longest chain rule)
 - [x] blockexplorer endpoints
 