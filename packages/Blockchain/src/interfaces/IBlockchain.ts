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
  ): number;
  hashBlock(
    previousBlockHash: string,
    currentBlockData: Transaction[],
    nonce: number
  ): string;
  proofOfWork(
    previousBlockHash: string,
    currentBlockData: Transaction[]
  ): number;
}
