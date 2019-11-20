import Block from "../types/Block";
import Transaction from "../types/Transaction";

export default interface IBlockchain {
  chain: Block[];
  currentNodeUrl: string;
  pendingTransactions: Transaction[];
  networkNodes: string[];

  createNewBlock(nonce: number, previousBlockHash: string, hash: string): Block;
  getLastBlock(): void;
  createNewTransaction(
    amount: number,
    sender: string,
    recipient: string
  ): Transaction;
  hashBlock(
    previousBlockHash: string,
    currentBlockData: Transaction[],
    nonce: number
  ): string;
  proofOfWork(
    previousBlockHash: string,
    currentBlockData: Transaction[]
  ): number;
  addTransactionToPendingTransactions(transaction: Transaction): number;
  chainIsValid(blockchain: Block[]): boolean;
  getBlock(blockHash: string): Block;
  getTransaction(
    transactionId: string
  ): { transaction: Transaction; block: Block };
  getAddressData(
    address: string
  ): { addressTransactions: Transaction[]; addressBalance: number };
}
