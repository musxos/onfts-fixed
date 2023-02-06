import { DashboardNav } from "../../../components/DashboardNav";
import { AuthLayout } from "../../../components/AuthLayout";
import { getAppCookies } from "../../../middlewares/utils";
import {
  deleteContractInfoByAddressAPI,
  getContractInfoByAddressAPI,
  updateContractInfoByAddressAPI,
} from "../../../services/apis";
import Web3 from "web3";
import { useEffect, useRef, useState } from "react";
import { chainConfigs } from "../../../utils/chainConfigs";
import Alert from "../../../components/Alert";
import Router from "next/router";

export default function Index(props) {
  const { isAuthenticated, contractInfo } = props;

  const [{ inputError, checkBoxError }, setFieldError] = useState({
    inputError: null,
    checkBoxError: null,
  });

  const inputValue = useRef("");
  const deployedChainIds = useRef([]);
  const inputRef = useRef();
  const isComponentMounted = useRef(false);

  useEffect(() => {
    if (!contractInfo?.address) Router.push("/manage-whitelist");
    isComponentMounted.current = true;

    contractInfo?.address &&
      (() => {
        const { address, deployedChainIds: _deployedChainIds } = contractInfo;

        inputRef.current.value = address;
        inputValue.current = address;

        deployedChainIds.current = _deployedChainIds;
        _deployedChainIds.forEach((deployedChainId) => {
          document.getElementById(deployedChainId).checked = true;
        });
      })();

    return () => {
      isComponentMounted.current = false;
    };
  }, [contractInfo]);

  const onInputChange = (e) => {
    inputValue.current = e.target.value;
  };

  const onCheckBoxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) return deployedChainIds.current.push(value);
    deployedChainIds.current = deployedChainIds.current.filter(
      (chainId) => chainId !== value
    );
  };

  const alertSetTimeoutId = useRef(null);
  const [{ altertProps, alertInfo }, setAlert] = useState({
    altertProps: {},
    alertInfo: null,
  });
  const updateAlert = ({ altertProps, alertInfo }) => {
    setAlert({ altertProps, alertInfo });
    if (!isComponentMounted.current) return;
    clearTimeout(alertSetTimeoutId.current);
    alertSetTimeoutId.current = setTimeout(() => {
      setAlert({ altertProps: {}, alertInfo: null });
    }, 3000);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    const web3 = new Web3();
    let areInputsValid = true;

    setFieldError({
      inputError: null,
      checkBoxError: null,
    });

    if (deployedChainIds.current.length == 0) {
      areInputsValid = false;
      setFieldError((prev) => ({
        ...prev,
        checkBoxError: "Please select a chain",
      }));
    }

    if (!web3.utils.isAddress(inputValue.current.toLowerCase())) {
      areInputsValid = false;
      setFieldError((prev) => ({
        ...prev,
        inputError: "Please enter a valid ethereum address",
      }));
    }

    if (!areInputsValid) return;

    try {
      const payload = {
        id: contractInfo._id,
        address: inputValue.current,
        deployedChainIds: deployedChainIds.current,
      };
      await updateContractInfoByAddressAPI(payload);

      updateAlert({
        alertInfo: "Contract Information updated successfully",
        altertProps: { className: "alert-success" },
      });
    } catch (err) {
      let alertInfo = "Failed to update Contract Information";

      updateAlert({
        alertInfo,
        altertProps: { className: "alert-danger" },
      });
    }
  };

  const onRemoveInfo = async (e) => {
    e.preventDefault();
    try {
      await deleteContractInfoByAddressAPI(contractInfo.address);
      Router.push("/manage-whitelist");
      console.log("here");
    } catch (err) {}
  };
  return (
    <>
      <Alert altertProps={altertProps}>{alertInfo}</Alert>

      <AuthLayout isAuthenticated={isAuthenticated} isAuthSuccessCheck={false}>
        <section className="body-box">
          <DashboardNav />

          <form onSubmit={onFormSubmit}>
            <div style={{ maxWidth: 600, margin: "auto" }}>
              <div className="form-group">
                <label htmlFor="address">Contract Address</label>
                <input
                  ref={inputRef}
                  id="address"
                  type="text"
                  className="form-control"
                  onChange={onInputChange}
                  required
                />

                <small className="text-danger">{inputError}&nbsp;</small>
              </div>

              <div className="py-2">
                <label>Select Deployed Networks</label>
              </div>

              <div className="row">
                {chainConfigs.map(({ chainName, chainId }) => (
                  <div key={chainId} className="col-md-6 col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={chainId}
                        id={chainId}
                        onChange={onCheckBoxChange}
                      />
                      <label className="form-check-label" htmlFor={chainId}>
                        {chainName}
                      </label>
                    </div>
                  </div>
                ))}

                <small className="text-danger">{checkBoxError}&nbsp;</small>
              </div>

              <div className="d-flex justify-content-center gap-2 flex-wrap pt-3">
                <button
                  className="btn btn-primary w-100 button-round"
                  type="submit"
                >
                  Update Information
                </button>

                <button
                  className="btn btn-danger w-100 button-round"
                  onClick={onRemoveInfo}
                >
                  Remove Information
                </button>
              </div>
            </div>
          </form>
        </section>
      </AuthLayout>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { dynaswapToken } = getAppCookies(context.req);

  let isAuthenticated = false;

  let contractInfo = {};

  if (dynaswapToken) {
    try {
      const { address } = context.query;
      const res = await getContractInfoByAddressAPI(dynaswapToken, address);
      contractInfo = res.data;
      isAuthenticated = true;
    } catch (err) {}
  }
  return {
    props: {
      contractInfo,
      isAuthenticated,
    },
  };
};
