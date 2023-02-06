// apis required for the the fetching data
import axios from "axios";
import { APIs_BASE_URL } from "../utils/constants";

export const getSignInAPI = async (payload) => {
  return await axios.post(`${APIs_BASE_URL}/api/signIn`, payload);
};

export const checkTokenAPI = async (accessToken) => {
  return await axios({
    method: "get",
    url: `${APIs_BASE_URL}/api/check-token`,
    headers: accessToken
      ? { cookie: `dynaswapToken=${accessToken}` }
      : undefined,
  });
};

export const addContractAPI = async (payload) => {
  return await axios.post(`${APIs_BASE_URL}/api/add-contract`, payload);
};

export const getContractsAPI = async (page = 0) => {
  return await axios.get(`${APIs_BASE_URL}/api/get-contracts`, {
    params: { page },
  });
};

export const getContractsByChainIdAPI = async (
  chainId,
  account,
  cursor = null
) => {
  return await axios.get(`${APIs_BASE_URL}/api/get-contracts-by-chainId`, {
    params: { chainId, account, cursor },
  });
};

export const getContractInfoByAddressAPI = async (accessToken, address) => {
  return await axios.get(`${APIs_BASE_URL}/api/get-contract-info-by-address`, {
    params: {
      address,
    },
    headers: accessToken
      ? { cookie: `dynaswapToken=${accessToken}` }
      : undefined,
  });
};

export const updateContractInfoByAddressAPI = async (payload) => {
  return await axios.post(
    `${APIs_BASE_URL}/api/update-contract-by-address`,
    payload
  );
};
export const deleteContractInfoByAddressAPI = async (address) => {
  return await axios.delete(
    `${APIs_BASE_URL}/api/remove-contract-info-by-address`,
    {
      params: { address },
    }
  );
};
