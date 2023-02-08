export const DISCOUNT_PRICE = 0;
export const BACKEND = "https://metadata.color.museum";
export const GLOBAL_NFT_USD_VOLUME = "607896518";
export const PROVIDER =
  "https://mainnet.infura.io/v3/1d63583bc1bc48ff941b5a62a0518da4";
export const PROVIDER_TEST =
  "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
export const MINT_STATUS = "MINT IS ACTIVE";
export const MINT_LINK =
  "https://bulletin.color.museum/2022/02/the-color-nft-minting-experience-steps-to-follow/";
export const MINTED_SQUARE = 700;
export const MESSAGE =
  "I am signing this request to prove ownership of this address";

export const REAL_MODE = true;

export const SMARTCONTRACTADDR = REAL_MODE ? "0xcF12413F738AD3a14B9810bA5f86E59fcd9BaaDf" : "0x94d1CE401E13289BB3215aDec4545e8Dc01f7ca7";

export const ERC721OrderFeatureAddress = REAL_MODE ? "0x8b56607D0635b1B0C36ba1786b028200f1D68767" : "0x90A675840686A6e92DB656CEef474E770b7be76A";

export const TokenAddressList = REAL_MODE ? [
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 
  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  "0xdAC17F958D2ee523a2206206994597C13D831ec7",
] : 
[
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  // "0xc778417e063141139fce010982780140aa0cd5ab",    //Real Weth
  "0xE436313CAaaD56D6934AC0A94998a8468602548b",       //Test token
  "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
  "0xaD6D458402F60fD3Bd25163575031ACDce07538D",
  "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83",
];

export const API_URL = REAL_MODE ? "https://orders.color.museum/api/v1" : "http://localhost:3001/api/v1";

export const PROVIDER_FOR_WEB3 = REAL_MODE ? "https://mainnet.infura.io/v3/1d63583bc1bc48ff941b5a62a0518da4" : "https://eth-ropsten.alchemyapi.io/v2/6WX_comANO2DisXdo_twtwKJean8I6A_";

export const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTI2NzVkYmMwNmIxNGM0YjE4ODUxYjUiLCJpYXQiOjE2MzAzMzQxODl9.nAhhDeKelLhKrDVe8PdQgk8WcCBzfDYPqrPlXz82wF0";

export const COLLECTORS = 316;
export const NEXT_PUBLIC_OPENAI_API_KEY =
  "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";

export const WALLET_EXPIRY_TIME = 60; // in minutes