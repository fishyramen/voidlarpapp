export interface Collectible {
  id: string;
  name: string;
  collection: string;
  image: string;
  floorPrice: string;
  chain: string;
}

export const featuredCollections = [
  {
    id: "drip",
    name: "DRiP",
    description: "An NFT drop platform on Solana. Get free art, music, and more, every week.",
    image: "https://assets.coingecko.com/nft_contracts/images/3727/small/drip.png",
    category: "Collectibles",
  },
  {
    id: "mad-lads",
    name: "Mad Lads",
    description: "The first xNFT collection. Built by the Backpack team on Solana.",
    image: "https://assets.coingecko.com/nft_contracts/images/3562/small/mad-lads.png",
    category: "PFP",
  },
  {
    id: "tensorians",
    name: "Tensorians",
    description: "The official NFT collection from Tensor, the Solana NFT marketplace.",
    image: "https://assets.coingecko.com/nft_contracts/images/3886/small/tensorians.png",
    category: "PFP",
  },
];

export const sampleCollectibles: Collectible[] = [
  { id: "1", name: "Mad Lad #4521", collection: "Mad Lads", image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://madlads.s3.us-west-2.amazonaws.com/images/4521.png", floorPrice: "120 SOL", chain: "Solana" },
  { id: "2", name: "Tensorian #892", collection: "Tensorians", image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/TensoriansPlaceholder", floorPrice: "8.5 SOL", chain: "Solana" },
  { id: "3", name: "SMB #1337", collection: "Solana Monkey Business", image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/SMBPlaceholder", floorPrice: "45 SOL", chain: "Solana" },
  { id: "4", name: "Okay Bear #2100", collection: "Okay Bears", image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/OkayBearsPlaceholder", floorPrice: "22 SOL", chain: "Solana" },
  { id: "5", name: "DeGod #5555", collection: "DeGods", image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/DeGodsPlaceholder", floorPrice: "15 SOL", chain: "Solana" },
  { id: "6", name: "Claynosaurz #777", collection: "Claynosaurz", image: "https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://arweave.net/ClaynosaurzPlaceholder", floorPrice: "12 SOL", chain: "Solana" },
];
