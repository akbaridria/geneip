const IP_ASSET_REGISTRY_ABI = [
  {
    inputs: [
      { name: "chainid", type: "uint256" },
      { name: "tokenContract", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "register",
    outputs: [{ name: "id", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "chainid", type: "uint256" },
      { name: "tokenContract", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    name: "ipId",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "isRegistered",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "id", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const GENEIP_MARKETPLACE_ABI = [
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "BPS_DENOMINATOR",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "acceptOffer",
    inputs: [
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "offerId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "buy",
    inputs: [
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "cancelOffer",
    inputs: [
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "offerId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getOffers",
    inputs: [
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IGeneIPMarketplace.Offer[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "offerer", type: "address", internalType: "address" },
          { name: "offerPrice", type: "uint256", internalType: "uint256" },
          { name: "expireAt", type: "uint256", internalType: "uint256" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum IGeneIPMarketplace.OfferStatus",
          },
          { name: "nft", type: "address", internalType: "address" },
          { name: "tokenId", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOffersFrom",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IGeneIPMarketplace.Offer[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "offerer", type: "address", internalType: "address" },
          { name: "offerPrice", type: "uint256", internalType: "uint256" },
          { name: "expireAt", type: "uint256", internalType: "uint256" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum IGeneIPMarketplace.OfferStatus",
          },
          { name: "nft", type: "address", internalType: "address" },
          { name: "tokenId", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOffersTo",
    inputs: [{ name: "user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct IGeneIPMarketplace.Offer[]",
        components: [
          { name: "id", type: "uint256", internalType: "uint256" },
          { name: "offerer", type: "address", internalType: "address" },
          { name: "offerPrice", type: "uint256", internalType: "uint256" },
          { name: "expireAt", type: "uint256", internalType: "uint256" },
          {
            name: "status",
            type: "uint8",
            internalType: "enum IGeneIPMarketplace.OfferStatus",
          },
          { name: "nft", type: "address", internalType: "address" },
          { name: "tokenId", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "list",
    inputs: [
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "price", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "listings",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "seller", type: "address", internalType: "address" },
      { name: "price", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "makeOffer",
    inputs: [
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "expireAt", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "offerById",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "id", type: "uint256", internalType: "uint256" },
      { name: "offerer", type: "address", internalType: "address" },
      { name: "offerPrice", type: "uint256", internalType: "uint256" },
      { name: "expireAt", type: "uint256", internalType: "uint256" },
      {
        name: "status",
        type: "uint8",
        internalType: "enum IGeneIPMarketplace.OfferStatus",
      },
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "offers",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "offersFrom",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "offersTo",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFeeBps",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "platformFeeRecipient",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setPlatformFeeRecipient",
    inputs: [{ name: "recipient", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unlist",
    inputs: [
      { name: "nft", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdrawExpiredOffer",
    inputs: [{ name: "offerId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
] as const;

export { IP_ASSET_REGISTRY_ABI, GENEIP_MARKETPLACE_ABI };

