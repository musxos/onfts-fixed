import { DashboardNav } from "../../components/DashboardNav";
import { AuthLayout } from "../../components/AuthLayout";
import { getAppCookies } from "../../middlewares/utils";
import { checkTokenAPI, getContractsAPI } from "../../services/apis";
import { useEffect, useRef, useState } from "react";
import ContractInfoCard from "../../components/ContractInfoCard";

export default function Index(props) {
  const { isAuthenticated } = props;
  const isEffectHookInit = useRef(false);

  const [{ contractsInfo, limit, page, totalPages }, setContractsInfo] =
    useState({ contractsInfo: [], limit: null, page: null, totalPages: null });

  useEffect(() => {
    if (isEffectHookInit.current) return;

    isAuthenticated &&
      getContractsAPI()
        .then((res) => setContractsInfo({ ...res.data }))
        .catch(console.log);

    isEffectHookInit.current = true;
  }, [isAuthenticated]);
  return (
    <AuthLayout isAuthenticated={isAuthenticated}>
      <section className="body-box">
        <DashboardNav />

        <>
          {contractsInfo.map((contractInfo) => (
            <ContractInfoCard {...contractInfo} key={contractInfo._id} />
          ))}
        </>
      </section>
    </AuthLayout>
  );
}

export const getServerSideProps = async (context) => {
  const { dynaswapToken } = getAppCookies(context.req);

  let user = {};
  let isAuthenticated = false;

  if (dynaswapToken) {
    try {
      const res = await checkTokenAPI(dynaswapToken);
      user = res.data;
      isAuthenticated = true;
    } catch (err) {}
  }
  return {
    props: {
      user,
      isAuthenticated,
    },
  };
};
