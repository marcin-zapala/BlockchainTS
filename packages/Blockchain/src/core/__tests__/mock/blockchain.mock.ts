const blockchain = [
    {
      index: 1,
      timestamp: 1574233202147,
      transaction: [],
      nonce: 0,
      hash: "0",
      previousBlockHash: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      index: 2,
      timestamp: 1574233223296,
      transaction: [],
      nonce: 4922,
      hash: "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990",
      previousBlockHash: "0"
    },
    {
      index: 3,
      timestamp: 1574233272698,
      transaction: [
        {
          transactionId: "7d4bf8200b6311ea8dd98d2e4e1f42d8",
          amount: 1,
          sender: "send",
          recipient: "recip"
        }
      ],
      nonce: 107816,
      hash: "0000e6aefc6d14c942761527583da9fca8394ab7401e5eb845c9334fd6f40e06",
      previousBlockHash:
        "0000948c41f8bc463e1d058f48d7f28d6fd097f47978d0d247ba3472c2247990"
    }
  ]

export default blockchain;
