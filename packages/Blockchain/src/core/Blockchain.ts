import { sha256 } from "js-sha256";
import IBlockchain from "../interfaces/IBlockchain";
import Block from "../types/Block";
import Transaction from "../types/Transaction";
import uuid from "uuid/v1";

const currentNodeUrl = process.argv[3];

export default class Blockchain implements IBlockchain {
  chain: Block[];
  pendingTransactions: Transaction[];
  currentNodeUrl: string;
  networkNodes: string[];

  constructor() {
    this.chain = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.pendingTransactions = [];

    this.createNewBlock(0, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "0");
  }

  createNewBlock(
    nonce: number = 0,
    previousBlockHash: string = "",
    hash: string = ""
  ): Block {
    const newBlock: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transaction: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash
    };

    this.pendingTransactions = [];
    this.chain = [...this.chain, newBlock];

    return newBlock;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createNewTransaction(
    amount: number = 0,
    sender: string = "",
    recipient: string = ""
  ): Transaction {
    return {
      transactionId: uuid()
        .split("-")
        .join(""),
      amount,
      sender,
      recipient
    };
  }

  addTransactionToPendingTransactions(transaction: Transaction): number {
    this.pendingTransactions = [...this.pendingTransactions, transaction];

    return this.getLastBlock()["index"] + 1;
  }

  hashBlock(
    previousBlockHash: string = "",
    currentBlockData: Transaction[] = [],
    nonce: number
  ): string {
    return sha256(
      `${previousBlockHash}${nonce}${JSON.stringify(currentBlockData)}`
    );
  }

  proofOfWork(
    previousBlockHash: string = "",
    currentBlockData: Transaction[] = []
  ): number {
    let nonce: number = 0;
    let hash: string = this.hashBlock(
      previousBlockHash,
      currentBlockData,
      nonce
    );

    while (hash.substring(0, 4) !== "0000") {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  chainIsValid(blockchain: Block[]): boolean {
    let validChain = true;

    //ommit genesis block
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        prevBlock.hash,
        currentBlock.transaction,
        currentBlock.nonce
      );

      if (blockHash.substring(0, 4) !== "0000") {
        validChain = false;
      }

      if (currentBlock.previousBlockHash !== prevBlock.hash) {
        validChain = false;
      }
    }
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock.nonce === 0;
    const correctBlockHash =
      genesisBlock.previousBlockHash ===
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const correctHash = genesisBlock.hash === "0";
    const correctTransactions = genesisBlock.transaction.length === 0;

    if (
      !correctNonce ||
      !correctBlockHash ||
      !correctHash ||
      !correctTransactions
    ) {
      validChain = false;
    }

    return validChain;
  }

  getBlock(blockHash: string): Block {
    return this.chain.find(({ hash }) => hash === blockHash);
  }

  getTransaction(
    transactionId: string
  ): { transaction: Transaction; block: Block } {
    let correctTransaction = null;
    let correctBlock = null;
    this.chain.forEach(block => {
      block.transaction.forEach(transaction => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        }
      });
    });

    return {
      transaction: correctTransaction,
      block: correctBlock
    };
  }

  getAddressData(
    address: string
  ): { addressTransactions: Transaction[]; addressBalance: number } {
    const addressTransactions: Transaction[] = [];
    this.chain.forEach(block => {
      block.transaction.forEach(transaction => {
        if (
          transaction.sender === address ||
          transaction.recipient === address
        ) {
          addressTransactions.push(transaction);
        }
      });
    });

    let balance = 0;
    addressTransactions.forEach(transaction => {
      if (transaction.recipient === address) {
        balance += transaction.amount;
      }

      if (transaction.sender === address) {
        balance -= transaction.amount;
      }
    });

    return {
      addressTransactions,
      addressBalance: balance
    };
  }
}
