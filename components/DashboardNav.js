import Link from "next/link";
import Router from "next/router";

import Cookies from "js-cookie";

export const DashboardNav = () => {
  const onSignOut = () => {
    Cookies.remove("dynaswapToken");
    Router.push("/");
  };
  return (
    <>
      <div className="d-md-flex justify-content-between">
        <div className="d-flex gap-3 align-items-center">
          <Link href="/manage-whitelist">View Contracts</Link>
          <Link href="/manage-whitelist/add-contract">Add Contract</Link>
        </div>

        <div>
          <button
            className="btn btn-outline-primary button-round"
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
      </div>

      <hr />
    </>
  );
};
