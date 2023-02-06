import Web3 from "web3";
import nextConnect from "next-connect";
import createHttpError from "http-errors";
import { onError, onNoMatch } from "../../middlewares";
import User from "../../models/User";
import withMongoose from "../../lib/mongoose/withMongoose";
import { issueJWT } from "../../utils/jwtConfigs";

export default withMongoose(
  nextConnect({
    onError,
    onNoMatch,
  }).post(async (req, res, next) => {
    const web3 = new Web3();

    try {
      const { message, signature } = req.body;

      if (!message || !signature)
        return next(createHttpError(400, "invalid body"));

      const walletAddress = web3.eth.accounts.recover(message, signature);

      const user = await User.findOne({ wallet: walletAddress });
      if (!user) return next(createHttpError(403));

      const userPayload = {
        _id: user._id,
        wallet: user.wallet,
      };

      const accessToken = issueJWT(userPayload);
      return res.status(200).json({
        ...userPayload,
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  })
);
