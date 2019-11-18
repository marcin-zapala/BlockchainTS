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
}
