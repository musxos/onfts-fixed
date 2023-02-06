import { useEffect, useRef, useState } from "react";
import { Web3UserContext } from "../context";
import { getContractsByChainIdAPI } from "../services/apis";

export const useMoralis = (chainId) => {
  const {
    contextState: { account },
  } = Web3UserContext();

  const isEffectHookInit = useRef(false);

  const [{ isLoading, success, failure, error, response }, setState] = useState(
    {
      isLoading: false,
      success: false,
      failure: false,
      error: null,
      response: {
        cursor: null,
        page: null,
        page_size: null,
        result: [],
        total: null,
      },
    }
  );

  useEffect(() => {
    account &&
      chainId &&
      (async () => {
        if (isEffectHookInit.current) return;

        isEffectHookInit.current = true;

        setState((p) => ({ ...p, isLoading: true }));

        try {
          const { data } = await getContractsByChainIdAPI(chainId, account);

          setState((p) => ({
            ...p,
            isLoading: false,
            success: true,
            response: data,
          }));
        } catch (err) {
          setState((p) => ({
            ...p,
            isLoading: false,
            failure: true,
            error: err,
          }));
        }
      })();
  }, [account, chainId]);

  const onCursor = async (cursor) => {
    setState((p) => ({ ...p, isLoading: true }));

    try {
      const { data } = await getContractsByChainIdAPI(chainId, account, cursor);

      setState((prev) => {
        const { response: _response } = prev;

        const payload = {
          ..._response,
          ...data,
          result: [..._response.result, ...data.result],
        };

        return {
          ...prev,
          isLoading: false,
          success: true,
          response: payload,
        };
      });
    } catch (err) {
      setState((p) => ({
        ...p,
        isLoading: false,
        failure: true,
        error: err,
      }));
    }
  };

  return { isLoading, success, failure, error, response, onCursor };
};
