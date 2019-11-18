import { default as Blockchain } from "Blockchain";
import express from "express";
import bodyParser from "body-parser";
import uuid from "uuid/v1";
import rp, { RequestPromise } from "request-promise";

const nodeAddress = uuid()
  .split("-")
  .join("");
const app = express();
const port = process.argv[2];
const blockchain = new Blockchain();
const REWARD = 12.5;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/blockchain", (req, res) => {
  res.send(blockchain);
});

app.post("/transaction", (req, res) => {
  const newTransaction = req.body;
  const blockIndex = blockchain.addTransactionToPendingTransactions(
    newTransaction
  );

  res.json({ note: `Transaction will be added in block ${blockIndex}` });
});

app.post(
  "/transaction/broadcast",
  ({ body: { amount, sender, recipient } }, res) => {
    const newTransaction = blockchain.createNewTransaction(
      amount,
      sender,
      recipient
    );

    blockchain.addTransactionToPendingTransactions(newTransaction);

    const requestPromises: RequestPromise[] = [];
    blockchain.networkNodes.forEach(networkNodeUrl => {
      const requestOptions = {
        uri: `${networkNodeUrl}/transaction`,
        method: "POST",
        body: newTransaction,
        json: true
      };

      requestPromises.push(rp(requestOptions));

      Promise.all(requestPromises).then(data => {
        res.json({
          note: "Transaction created and broadcast successfully"
        });
      });
    });
  }
);

app.get("/mine", (req, res) => {
  const lastBlock = blockchain.getLastBlock();
  const previousBlockHash = lastBlock.hash;

  const nonce = blockchain.proofOfWork(
    previousBlockHash,
    blockchain.pendingTransactions
  );
  const hash = blockchain.hashBlock(
    previousBlockHash,
    blockchain.pendingTransactions,
    nonce
  );

  const newBlock = blockchain.createNewBlock(nonce, previousBlockHash, hash);
  const requests: RequestPromise[] = [];

  blockchain.networkNodes.forEach(nodeUrl => {
    const requestOptions = {
      uri: `${nodeUrl}/receive-new-block`,
      method: "POST",
      body: {
        newBlock
      },
      json: true
    };

    requests.push(rp(requestOptions));
  });
  Promise.all(requests)
    .then(data => {
      console.log("addbroadcash");
      const requestOptions = {
        uri: `${blockchain.currentNodeUrl}/transaction/broadcast`,
        method: "POST",
        body: {
          amount: REWARD,
          sender: "00",
          recipient: nodeAddress
        },
        json: true
      };

      return rp(requestOptions);
    })
    .then(data => {
      res.json({
        note: "New block mined and broadcast succesfully",
        block: newBlock
      });
    });
});

//register new node and broadcast it to the network
app.post("/register-and-broadcast-node", (req, res) => {
  const { newNodeUrl } = req.body;
  if (!blockchain.networkNodes.includes(newNodeUrl)) {
    blockchain.networkNodes = [...blockchain.networkNodes, newNodeUrl];
  }

  const reqNodesPromises: RequestPromise[] = [];

  blockchain.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      uri: `${networkNodeUrl}/register-node`,
      method: "POST",
      body: {
        newNodeUrl
      },
      json: true
    };

    reqNodesPromises.push(rp(requestOptions));
    Promise.all(reqNodesPromises)
      .then(data => {
        const bulkRegisterOptions = {
          uri: `${newNodeUrl}/register-nodes-bulk`,
          method: "POST",
          body: {
            allNetworkNodes: [
              ...blockchain.networkNodes,
              blockchain.currentNodeUrl
            ]
          },
          json: true
        };

        return rp(bulkRegisterOptions);
      })
      .then(data => {
        res.json({
          note: "New node register with network successfully"
        });
      });
  });
});

//rest nodes register new incoming node
app.post("/register-node", (req, res) => {
  const { newNodeUrl } = req.body;
  if (
    !blockchain.networkNodes.includes(newNodeUrl) &&
    blockchain.currentNodeUrl !== newNodeUrl
  ) {
    blockchain.networkNodes = [...blockchain.networkNodes, newNodeUrl];
  }

  res.json({
    note: "New node registered successfully."
  });
});

//register multiple nodes at once (new node need to have info about rest nodes)
app.post("/register-nodes-bulk", (req, res) => {
  const { allNetworkNodes } = req.body;
  allNetworkNodes.forEach((networkNodeUrl: string) => {
    if (
      !blockchain.networkNodes.includes(networkNodeUrl) &&
      blockchain.currentNodeUrl !== networkNodeUrl
    ) {
      blockchain.networkNodes = [...blockchain.networkNodes, networkNodeUrl];
    }
  });

  res.json({
    note: "Bulk registration complete."
  });
});

app.post("/receive-new-block", (req, res) => {
  const { newBlock } = req.body;
  const lastBlock = blockchain.getLastBlock();

  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = ++lastBlock.index === newBlock.index;

  if (correctHash && correctIndex) {
    blockchain.chain = [...blockchain.chain, newBlock];
    blockchain.pendingTransactions = [];
    res.json({
      note: "New block received and accepted",
      newBlock
    });
  } else {
    res.json({
      note: "New block rejected",
      newBlock
    });
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));
