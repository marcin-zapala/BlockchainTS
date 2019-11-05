import Transaction from "./Transaction";

type Block = {
  index: number;
  timestamp: number;
  transaction: Transaction[],
  nonce: number,
  hash: string,
  previousBlockHash: string,
};

export default Block;
