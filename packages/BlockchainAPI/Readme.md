## BlockchainUI
Layer to communication with blockchain

### Startup 

```
    yarn start
```
In browser: localhost:3000 (or different defined port)
### /blockchain
Show whole blockchain

### /transaction
Create new transaction
~~~
body: {
    amount: number,
    sender: string,
    recipient: string
}
~~~

### /mine
Mine new block

### /register-and-broadcast-node
Register new node and broadcast it to the network
~~~
body: {
    newNodeUrl: string
}
~~~

### /register-node
Rest nodes register new incoming node
~~~
body: {
    newNodeUrl: string
}
~~~

### /register-nodes-bulk
Register multiple nodes at once (new node need to have info about rest nodes)
~~~
body {
    allNetworkNodes: string[] //nodes urls
}
~~~