import Link from "next/link";
import { chainIdToInfo } from "../utils/chainConfigs";
import { shortenAddress } from "../utils/constants";

export default function ContractInfoCard({ address, deployedChainIds = [] }) {
  return (
    <div className="body-box">
      <div className="body-account-info-box">
        <div className="d-flex gap-3 justify-content-between align-items-center">
          <h3 className="name-title mb-0"> {shortenAddress(address)}</h3>
          <Link href={`/manage-whitelist/update-contract-info/${address}`}>
            Edit <i className="fa fa-edit"></i>
          </Link>
        </div>
        <div>
          <h5>Deployed chains</h5>
          <div className="wallet-flex-box">
            {deployedChainIds.map((chainId) => (
              <ChainInfo key={chainId} chainId={chainId} address={address} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const ChainInfo = ({ chainId, address }) => {
  const { chainName, blockExplorer } = chainIdToInfo[chainId];

  return (
    <a
      href={`${blockExplorer}/address/${address}`}
      target="_blank"
      rel="noreferrer"
      className="wallet-number mb-1"
    >
      {chainName}
    </a>
  );
};
