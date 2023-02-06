export const shortenAddress = (address) =>
  `${address.slice(0, 5)}...${address.slice(-5)}`;

export const getNavigableURL = (urlString) => {
  if (urlString && /ipfs:\/\//.test(urlString))
    return `https://ipfs.moralis.io:2053/ipfs/${urlString.split("ipfs://")[1]}`;

  return urlString;
};

export const APIs_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://dyna-swap.vercel.app"
    : "http://localhost:3000";
