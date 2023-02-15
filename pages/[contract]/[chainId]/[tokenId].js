import Web3 from "web3";
import axios from "axios";
import { Multicall } from "ethereum-multicall";
import { chainConfigs, chainIdToInfo } from "../../../utils/chainConfigs";
import ABI_ERC721 from "../../../assets/abis/basicERC721.abi.json";
import { getNavigableURL, shortenAddress } from "../../../utils/constants";
import Meta from "../../../components/Meta";
import WalletInfo from "../../../components/WalletInfo";
import { Web3UserContext } from "../../../context";
import { switchNetwork } from "../../../context/utils";
import traverseAbi from "../../../assets/abis/traverse.abi..json";
import { useEffect, useRef, useState } from "react";

export default function Page({ nftInfo, isInfoLoaded, reason }) {
  
 


  
  
  const {
    metadata,
    contractAddress,
    tokenId,
    chainId,
    metadataURI,
    tokenOwner,
  } = nftInfo;
  const { image, name, description } = metadata;

  const blockExplorer = chainIdToInfo[chainId].blockExplorer;

  let imgSrc = getNavigableURL(image);

  const {
    contextState: {
      web3Instance,
      account,
      provider,
      connectedChainId,
      isWalletConnected,
    },
  } = Web3UserContext();

  const isSameChain = parseInt(connectedChainId) === parseInt(chainId);
  const isOwner =
    String(tokenOwner).toLocaleLowerCase() ===
    String(account).toLocaleLowerCase();
  const sourceChain = chainIdToInfo[chainId].chainName;

  const [destChainInfo, setDestChainInfo] = useState(null);

  const setDestChainId = (event) => {
    const chainId = event.target.value;
    setDestChainInfo(chainId);
  };

  const onTraverse = async () => {
    if (!destChainInfo) return;
    const dstChainId = chainIdToInfo[destChainInfo].lzChainId;
    const contractInstance = new web3Instance.eth.Contract(
      traverseAbi,
      contractAddress
    );

    const input = Number(inputValue.current);
    const payable = input > 0 ? input : 1;

    try {
      await new Promise((resolve, reject) => {
        contractInstance.methods
          .traverseChains(dstChainId, tokenId)
          .send({
            from: account,
            value: web3Instance.utils.toWei(payable.toString(), "ether"),
          })
          .once("transactionHash", function (txHash) {
            console.log(txHash);
          })
          .once("receipt", async (receipt) => {
            resolve(receipt);
          })
          .on("error", reject);
      });
    } catch (err) {}
  };

  const inputValue = useRef("");

  const onInputChange = (event) => {
    inputValue.current = event.target.value;
  };

  const optionsLists = chainConfigs.filter(
    ({ chainId: _chainId }) => _chainId !== chainId
  );
  optionsLists.push({ chainId: null, chainName: "Select Chain" });

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    const [_native_price,setPrice] = useState(0)

    const address_native ={
      avax : '0x1CE0c2827e2eF14D5C4f29a091d735A204794041',
      eth : '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      bnb : '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      fantom : '0xAD29AbB318791D579433D831ed122aFeAf29dcfe',
      polygon :'0xCC42724C6683B7E57334c4E856f4c9965ED682bD'
     }

        const price =(token_address)=>{
          var config = {
            method: 'get',
          maxBodyLength: Infinity,
            url: `https://deep-index.moralis.io/api/v2/erc20/${token_address}/price?chain=bsc&exchange=pancakeswap-v2`,
            headers: { 
              'accept': 'application/json', 
              'X-API-Key': 'tiHvMOddWxkAqm0AzSC4a1aMX7V0xUnQaVhUdPnXOnfKbCFnchxNVlUV8LmeJBqS'
            }
          };
          
          axios(config)
          .then(function (response) {
            setPrice(JSON.parse(JSON.stringify(response.data.usdPrice)));
            
          })
          .catch(function (error) {
            console.log(error);
          });
        }
     
        
      useEffect(()=>{

        if(sourceChain =="Avalanche"){
          price(address_native.avax)
        }else if(sourceChain=="Ethereum"){
          price(address_native.eth)
        }else if(sourceChain=="BSC"){
          price(address_native.bsc)
        }else if(sourceChain =="Fantom" ){
          price(address_native.fantom)
        }else if(sourceChain=="Polygon"){
          price(address_native.polygon)
        }

      },[sourceChain])

      let chainamount2 =  Number(20/_native_price);
      let chainamount =  Number(chainamount2.toFixed(3));
      console.log(_native_price);
      console.log(sourceChain);
      console.log(chainamount);
//////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <Meta title={name} description={description} />

      <section className="pb-5">
        <div className="pb-3">
          <WalletInfo />
        </div>

        <div className="container mt-5">
          {!isInfoLoaded && <h2>ERROR#500: {reason}</h2>}

          {isInfoLoaded && (
            <div className="row mt-5">
              <div className="col-md-5">
                <picture>
                  <video
                    poster={imgSrc}
                    src={imgSrc}
                    alt="Card image cap"
                    width="100%"
                    autoPlay
                    playsInline
                    loop
                  />
                </picture>
              </div>

              <div className="col-md-1" />

              <div className="col-md-6">
                <h1>{name}</h1>
                <h5>Description</h5>
                <p>{description}</p>
                <hr />

                <div className="row">
                  {/* left start*/}

                  <div className="col-6 h5-mb0">
                    <div>
                      <h5>Source Chain</h5>
                      <p>{sourceChain}</p>
                    </div>

                    <div>
                      <h5>Select Destination Chain</h5>
                      <div className="p-2" />
                      <select
                        className="form-select"
                        value={destChainInfo || "Select Chain"}
                        onChange={setDestChainId}
                      >
                        {optionsLists.map(({ chainName, chainId }) => (
                          <option key={chainId} value={chainId}>
                            {chainName}
                          </option>
                        ))}
                      </select>

                      <div class="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                          id="amount"
                          type="number"
                          value={chainamount}
                          class="form-control"
                          onChange={onInputChange}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      {isSameChain && isOwner && (
                        <button
                          onClick={onTraverse}
                          className=" example-btn w-100"
                        >
                          Traverse
                        </button>

                       
                      )}
                     
                      {isWalletConnected && !isSameChain && (
                        <button
                          className="btn btn-outline-secondary button-round w-100"
                          onClick={switchNetwork.bind(this, provider, chainId)}
                        >
                          Switch Chain to {sourceChain}
                        </button>
                      )}

                      {!isWalletConnected && (
                        <h5>Please connect your wallet</h5>
                      )}
                    </div>
                  </div>
                  {/* left end*/}

                  {/* right  start*/}
                  <div className="col-6 h5-mb0">
                    <h5>Source Contract</h5>
                    <p>
                      <a
                        className="hover-color"
                        href={`${blockExplorer}/token/${contractAddress}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shortenAddress(contractAddress)}
                      </a>
                    </p>

                    <h5>NFT Name</h5>
                    <p>{name}</p>

                    <h5>NFT Id</h5>
                    <p>
                      <a
                        className="hover-color"
                        href={`${blockExplorer}/token/${contractAddress}?a=${tokenId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {tokenId}
                      </a>
                    </p>

                    <p>
                      <a
                        className="hover-color"
                        href={metadataURI}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Show metadata
                      </a>
                    </p>
                    {/* right end*/}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { contract, tokenId, chainId } = context.params;

  const rpcURL = chainIdToInfo[chainId].rpcURL;

  const web3 = new Web3(rpcURL);

  const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

  const contractContext = [
    {
      reference: "ERC721",
      contractAddress: contract,
      abi: ABI_ERC721,
      calls: [
        {
          reference: "ERC721",
          methodName: "name",
          methodParameters: [],
        },
        {
          reference: "ERC721",
          methodName: "symbol",
          methodParameters: [],
        },
        {
          reference: "ERC721",
          methodName: "tokenURI",
          methodParameters: [tokenId],
        },
        {
          reference: "ERC721",
          methodName: "ownerOf",
          methodParameters: [tokenId],
        },
      ],
    },
  ];

  try {
    const res = await multicall.call(contractContext);

    const tokenURI = res.results.ERC721.callsReturnContext[2].returnValues[0];

    let toFetchURI = getNavigableURL(tokenURI);

    const { data } = await axios.get(toFetchURI);

    const nftInfo = {
      name: res.results.ERC721.callsReturnContext[0].returnValues[0],
      symbol: res.results.ERC721.callsReturnContext[1].returnValues[0],
      metadata: data,
      contractAddress: contract,
      tokenId,
      chainId,
      metadataURI: toFetchURI,
      tokenOwner: res.results.ERC721.callsReturnContext[3].returnValues[0],
    };

    return {
      props: { nftInfo, isInfoLoaded: true, reason: null },
    };
  } catch (err) {
    return {
      props: {
        nftInfo: {
          name: null,
          symbol: null,
          metadata: {},
          contractAddress: contract,
          tokenId,
          chainId,
          metadataURI: null,
          tokenOwner: null,
        },
        isInfoLoaded: false,

        reason: err.message || "Something went wrong loading nft data.",
      },
    };
  }
};
