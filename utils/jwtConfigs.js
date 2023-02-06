import jsonwebtoken from "jsonwebtoken";

export const JWT_SECRET_KEY = "longlonglonglonglonglonglongjwtscret";

/**
 * @dev removes the user info of `wallet` address from local database/storage
 * @param user is the user info object
 * @returns string
 */
export const issueJWT = (user) => {
  const _id = user._id;
  const expiresIn = Date.now() + 1000 * 60 * 60 * 24 * 1; // one day

  const payload = {
    sub: _id,
  };

  const signedToken = jsonwebtoken.sign(payload, JWT_SECRET_KEY, { expiresIn });

  return "Bearer " + signedToken;
};
