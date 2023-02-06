import Cookies from "js-cookie";
import { AuthLayout, onAuthSuccess } from "../../components/AuthLayout";
import { Web3UserContext } from "../../context";
import { getAppCookies } from "../../middlewares/utils";
import { checkTokenAPI, getSignInAPI } from "../../services/apis";
import metamaskIcon from "../../assets/images/metamask-icon.svg";

export default function Index(props) {
  const {
    contextState: { isWalletConnected, web3Instance, account, web3Modal, Web3 },
  } = Web3UserContext();

  //  get signature and verify if the requesting user is authorized
  const onWalletConnect = async () => {
    const getWalletAddress = async () => {
      const provider = await web3Modal.connect();

      const web3Instance = new Web3(provider);
      let account = (await web3Instance.eth.getAccounts())[0];
      if (!account) {
        await provider.request({
          method: "eth_requestAccounts",
        });
        account = (await web3Instance.eth.getAccounts())[0];
      }

      return { account, web3Instance };
    };
    try {
      let _account = account;
      let _web3Instance = web3Instance;
      if (!isWalletConnected)
        ({ account: _account, web3Instance: _web3Instance } =
          await getWalletAddress());

      const message =
        "Please sign this message to verify your account. This will not trigger a blockchain transaction. This signature will be used to issue token to admin wallets.";

      const signature = await _web3Instance.eth.personal.sign(
        _web3Instance.utils.fromUtf8(message),
        _account
      );

      const {
        data: { accessToken },
      } = await getSignInAPI({
        message,
        signature,
      });

      Cookies.set("dynaswapToken", accessToken);

      onAuthSuccess();
    } catch (err) {}
  };

  const { isAuthenticated } = props;

  return (
    <AuthLayout isAuthenticated={isAuthenticated}>
      <section className="body-box">
        <div className="d-flex justify-content-center">
          <div>
            <h2>Connect Wallet to manage whitelist</h2>

            <div className="w-75 m-auto mt-5">
              <button
                className="btn btn-primary button-round w-100 "
                onClick={onWalletConnect}
              >
                <picture>
                  <img {...metamaskIcon} alt="metamask" className="icon" />
                </picture>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}

export async function getServerSideProps(context) {
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
}
