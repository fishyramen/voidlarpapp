export interface CoinInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  logo: string;
  marketCap: string;
}

export const allCoins: CoinInfo[] = [
  { symbol: "BTC", name: "Bitcoin", price: 101900.00, change: 1.05, logo: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", marketCap: "$2.0T" },
  { symbol: "ETH", name: "Ethereum", price: 3714.50, change: -2.10, logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", marketCap: "$447B" },
  { symbol: "SOL", name: "Solana", price: 135.30, change: 5.61, logo: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png", marketCap: "$63B" },
  { symbol: "USDC", name: "USD Coin", price: 1.00, change: 0.01, logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png", marketCap: "$33B" },
  { symbol: "USDT", name: "Tether", price: 1.00, change: 0.00, logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png", marketCap: "$112B" },
  { symbol: "BNB", name: "BNB", price: 608.40, change: 1.22, logo: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png", marketCap: "$91B" },
  { symbol: "XRP", name: "XRP", price: 2.18, change: -0.85, logo: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png", marketCap: "$125B" },
  { symbol: "ADA", name: "Cardano", price: 0.68, change: 3.40, logo: "https://assets.coingecko.com/coins/images/975/small/cardano.png", marketCap: "$24B" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.155, change: -1.50, logo: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png", marketCap: "$22B" },
  { symbol: "AVAX", name: "Avalanche", price: 35.20, change: 2.80, logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png", marketCap: "$14B" },
  { symbol: "DOT", name: "Polkadot", price: 7.10, change: -0.32, logo: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png", marketCap: "$10B" },
  { symbol: "MATIC", name: "Polygon", price: 0.58, change: 1.90, logo: "https://assets.coingecko.com/coins/images/4713/small/polygon.png", marketCap: "$5.4B" },
  { symbol: "LINK", name: "Chainlink", price: 14.80, change: 4.20, logo: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png", marketCap: "$8.7B" },
  { symbol: "BONK", name: "Bonk", price: 0.000025, change: -1.23, logo: "https://assets.coingecko.com/coins/images/28600/small/bonk.jpg", marketCap: "$1.6B" },
  { symbol: "RAY", name: "Raydium", price: 3.60, change: 5.67, logo: "https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg", marketCap: "$530M" },
  { symbol: "JTO", name: "Jito", price: 3.13, change: -0.45, logo: "https://assets.coingecko.com/coins/images/33228/small/jto.png", marketCap: "$370M" },
  { symbol: "JUP", name: "Jupiter", price: 0.82, change: 3.10, logo: "https://assets.coingecko.com/coins/images/34188/small/jup.png", marketCap: "$1.1B" },
  { symbol: "WIF", name: "dogwifhat", price: 2.45, change: 8.30, logo: "https://assets.coingecko.com/coins/images/33566/small/dogwifhat.jpg", marketCap: "$2.4B" },
  { symbol: "RENDER", name: "Render", price: 7.85, change: 2.15, logo: "https://assets.coingecko.com/coins/images/11636/small/rndr.png", marketCap: "$3.0B" },
  { symbol: "ARB", name: "Arbitrum", price: 1.12, change: -0.78, logo: "https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg", marketCap: "$2.8B" },
  { symbol: "SUI", name: "Sui", price: 1.75, change: 6.20, logo: "https://assets.coingecko.com/coins/images/26375/small/sui_asset.jpeg", marketCap: "$5.2B" },
  { symbol: "OP", name: "Optimism", price: 2.35, change: 1.80, logo: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png", marketCap: "$2.6B" },
  { symbol: "APT", name: "Aptos", price: 8.90, change: -1.10, logo: "https://assets.coingecko.com/coins/images/26455/small/aptos_round.png", marketCap: "$3.8B" },
  { symbol: "INJ", name: "Injective", price: 24.50, change: 3.75, logo: "https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png", marketCap: "$2.3B" },
  { symbol: "TIA", name: "Celestia", price: 12.40, change: -2.30, logo: "https://assets.coingecko.com/coins/images/31967/small/tia.jpg", marketCap: "$2.1B" },
  { symbol: "SEI", name: "Sei", price: 0.65, change: 4.50, logo: "https://assets.coingecko.com/coins/images/28205/small/Sei_Logo_-_Transparent.png", marketCap: "$1.8B" },
  { symbol: "NEAR", name: "NEAR Protocol", price: 5.20, change: 2.40, logo: "https://assets.coingecko.com/coins/images/10365/small/near.jpg", marketCap: "$5.6B" },
  { symbol: "FTM", name: "Fantom", price: 0.42, change: -0.90, logo: "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png", marketCap: "$1.2B" },
  { symbol: "ATOM", name: "Cosmos", price: 9.80, change: 1.30, logo: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png", marketCap: "$3.7B" },
  { symbol: "FIL", name: "Filecoin", price: 5.60, change: -1.80, logo: "https://assets.coingecko.com/coins/images/12817/small/filecoin.png", marketCap: "$2.8B" },
  { symbol: "LTC", name: "Litecoin", price: 72.50, change: 0.85, logo: "https://assets.coingecko.com/coins/images/2/small/litecoin.png", marketCap: "$5.4B" },
  { symbol: "UNI", name: "Uniswap", price: 6.40, change: 2.60, logo: "https://assets.coingecko.com/coins/images/12504/small/uni.jpg", marketCap: "$4.8B" },
  { symbol: "AAVE", name: "Aave", price: 92.30, change: 3.10, logo: "https://assets.coingecko.com/coins/images/12645/small/AAVE.png", marketCap: "$1.4B" },
  { symbol: "MKR", name: "Maker", price: 1520.00, change: -0.60, logo: "https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png", marketCap: "$1.4B" },
  { symbol: "GRT", name: "The Graph", price: 0.18, change: 1.45, logo: "https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png", marketCap: "$1.7B" },
  { symbol: "PEPE", name: "Pepe", price: 0.0000012, change: 12.50, logo: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg", marketCap: "$5.0B" },
  { symbol: "SHIB", name: "Shiba Inu", price: 0.0000089, change: -0.40, logo: "https://assets.coingecko.com/coins/images/11939/small/shiba.png", marketCap: "$5.2B" },
  { symbol: "CRV", name: "Curve DAO", price: 0.58, change: 2.90, logo: "https://assets.coingecko.com/coins/images/12124/small/Curve.png", marketCap: "$700M" },
  { symbol: "STX", name: "Stacks", price: 1.85, change: -1.20, logo: "https://assets.coingecko.com/coins/images/2069/small/Stacks_logo_full.png", marketCap: "$2.7B" },
  { symbol: "IMX", name: "Immutable", price: 1.60, change: 3.80, logo: "https://assets.coingecko.com/coins/images/17233/small/immutableX-symbol-BLK-RGB.png", marketCap: "$2.4B" },
  { symbol: "ONDO", name: "Ondo Finance", price: 0.95, change: 5.40, logo: "https://assets.coingecko.com/coins/images/26580/small/ONDO.png", marketCap: "$1.3B" },
  { symbol: "PYTH", name: "Pyth Network", price: 0.38, change: -2.60, logo: "https://assets.coingecko.com/coins/images/31924/small/pyth.png", marketCap: "$1.4B" },
  { symbol: "W", name: "Wormhole", price: 0.55, change: 1.10, logo: "https://assets.coingecko.com/coins/images/35087/small/womrhole_logo_full_color_rgb_2000px_72ppi_fb766ac85a.png", marketCap: "$980M" },
  { symbol: "PENDLE", name: "Pendle", price: 4.20, change: 7.30, logo: "https://assets.coingecko.com/coins/images/15069/small/Pendle_Logo_Normal-03.png", marketCap: "$680M" },
  { symbol: "ENA", name: "Ethena", price: 0.72, change: -3.10, logo: "https://assets.coingecko.com/coins/images/36530/small/ethena.png", marketCap: "$1.0B" },
];
