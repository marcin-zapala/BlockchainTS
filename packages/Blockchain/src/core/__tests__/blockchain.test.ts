import Blockchain from "../Blockchain";
import Block from "../../types/Block";
import block from "./mock/blockchain.mock";
import blockchain from "./mock/blockchain.mock";

const MOCKED_DATE = "MOCKED_DATE";
Date.now = jest.fn().mockReturnValue("MOCKED_DATE");

describe("core/blockchain", () => {
  it("initialize blockchain should return empty chain and newTransactions", () => {
    const blockchain = new Blockchain();

    expect(blockchain).toEqual({
      chain: [
        {
          hash: "0",
          index: 1,
          nonce: 0,
          previousBlockHash: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          timestamp: "MOCKED_DATE",
          transaction: []
        }
      ],
      pendingTransactions: []
    });
  });

  describe("createNewBlock", () => {
    it("Create Block", () => {
      const blockchain = new Blockchain();
      const nonce = 2500;
      const previousBlockHash = "previousHash";
      const hash = "hash";
      const block: Block = blockchain.createNewBlock(
        nonce,
        previousBlockHash,
        hash
      );

      expect(block).toEqual({
        index: 2,
        transaction: [],
        timestamp: block.timestamp,
        nonce,
        hash,
        previousBlockHash
      });
    });

    it("test blockchain after create few blocks", () => {
      const blockchain = new Blockchain();
      blockchain.createNewBlock(125, "0", "hash1");
      blockchain.createNewBlock(250, "hash1", "hash2");
      blockchain.createNewBlock(500, "hash2", "hash3");

      expect(blockchain).toEqual({
        pendingTransactions: [],
        chain: [
          {
            hash: "0",
            index: 1,
            nonce: 0,
            previousBlockHash: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timestamp: "MOCKED_DATE",
            transaction: []
          },
          {
            index: 2,
            timestamp: MOCKED_DATE,
            transaction: [],
            nonce: 125,
            hash: "hash1",
            previousBlockHash: "0"
          },
          {
            index: 3,
            timestamp: MOCKED_DATE,
            transaction: [],
            nonce: 250,
            hash: "hash2",
            previousBlockHash: "hash1"
          },
          {
            index: 4,
            timestamp: MOCKED_DATE,
            transaction: [],
            nonce: 500,
            hash: "hash3",
            previousBlockHash: "hash2"
          }
        ]
      });
    });
  });

  describe("getLastBlock", () => {
    it("should return genesis block", () => {
      const blockchain = new Blockchain();

      expect(blockchain.getLastBlock()).toEqual({
        hash: "0",
        index: 1,
        nonce: 0,
        previousBlockHash: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: "MOCKED_DATE",
        transaction: []
      });
    });

    it("should return last defined blocks", () => {
      const blockchain = new Blockchain();

      blockchain.createNewBlock(125, "0", "hash1");
      blockchain.createNewBlock(250, "hash1", "hash2");
      blockchain.createNewBlock(500, "hash2", "hash3");

      expect(blockchain.getLastBlock()).toEqual({
        index: 4,
        timestamp: MOCKED_DATE,
        transaction: [],
        nonce: 500,
        hash: "hash3",
        previousBlockHash: "hash2"
      });
    });
  });

  describe("createNewTransaction", () => {
    it("should create transaction", () => {
      const blockchain = new Blockchain();

      blockchain.createNewBlock(125, "0", "hash1");
      blockchain.createNewTransaction(100, "Sender", "Recipient");

      blockchain.createNewBlock(250, "hash1", "hash2");
      blockchain.createNewTransaction(200, "Sender", "Recipient");
      blockchain.createNewTransaction(300, "Sender", "Recipient");

      blockchain.createNewBlock(250, "hash2", "hash3");

      blockchain.createNewTransaction(600, "Sender", "Recipient");

      expect(blockchain).toEqual({
        chain: [
          {
            hash: "0",
            index: 1,
            nonce: 0,
            previousBlockHash: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            timestamp: "MOCKED_DATE",
            transaction: []
          },
          {
            index: 2,
            timestamp: "MOCKED_DATE",
            transaction: [],
            nonce: 125,
            hash: "hash1",
            previousBlockHash: "0"
          },
          {
            index: 3,
            timestamp: "MOCKED_DATE",
            transaction: [
              { amount: 100, sender: "Sender", recipient: "Recipient" }
            ],
            nonce: 250,
            hash: "hash2",
            previousBlockHash: "hash1"
          },
          {
            index: 4,
            timestamp: "MOCKED_DATE",
            transaction: [
              { amount: 200, sender: "Sender", recipient: "Recipient" },
              { amount: 300, sender: "Sender", recipient: "Recipient" }
            ],
            nonce: 250,
            hash: "hash3",
            previousBlockHash: "hash2"
          }
        ],
        pendingTransactions: [
          { amount: 600, sender: "Sender", recipient: "Recipient" }
        ]
      });
    });
  });

  describe("hashBlock", () => {
    it("should hash data", () => {
      const blockchain = new Blockchain();

      const previousBlockHash = "ASKLJFOANC123123ASDAS";
      const currentBlockData = [
        { amount: 10, sender: "SENDER", recipient: "RECIPIENT" },
        { amount: 20, sender: "SENDER", recipient: "RECIPIENT" },
        { amount: 40, sender: "SENDER", recipient: "RECIPIENT" }
      ];

      const nonce = 100;

      const hash = blockchain.hashBlock(
        previousBlockHash,
        currentBlockData,
        nonce
      );

      //generate on https://emn178.github.io/online-tools/sha256.html
      const expected =
        "16626014d3c75c7af2a62f1d84d1cb8eee15d995303412c8d1df8bf0ad8e684a";
      expect(hash).toEqual(expected);
    });
  });

  describe("proofOfWork", () => {
    const previousBlockHash = "ASKLJFOANC123123ASDAS";
    const currentBlockData = [
      { amount: 10, sender: "SENDER", recipient: "RECIPIENT" }
    ];

    const correctNonce = 83356;

    it("should return nonce for block", () => {
      const blockchain = new Blockchain();

      const nonce = blockchain.proofOfWork(previousBlockHash, currentBlockData);

      expect(nonce).toEqual(correctNonce);
    });

    it("should give back hash start with 0000", () => {
      const blockchain = new Blockchain();
      const hash = blockchain.hashBlock(
        previousBlockHash,
        currentBlockData,
        correctNonce
      );

      expect(hash.substring(0, 4)).toBe("0000");
    });
  });

  describe("chainIsValid", () => {
    it("should return true on correct blockchain", () => {
      const blockchain = new Blockchain();
      const result = blockchain.chainIsValid(block);

      expect(result).toBeTruthy();
    });

    it("should return false on incorrect blockchain", () => {
      const blockchain = new Blockchain();
      const badBlocks = [
        ...block,
        {
          index: 4,
          timestamp: 1574233223296,
          transaction: [],
          nonce: 0,
          hash: "25",
          previousBlockHash: "0"
        }
      ];
      const result = blockchain.chainIsValid(badBlocks);

      expect(result).toBeFalsy();
    });
  });
});
