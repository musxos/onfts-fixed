import Web3 from "web3";
import nextConnect from "next-connect";
import createHttpError from "http-errors";
import withMongoose from "../../lib/mongoose/withMongoose";
import { onError, onNoMatch } from "../../middlewares";
import { authenticate } from "../../middlewares/auth";
import Contract from "../../models/Contract";

export default withMongoose(
  nextConnect({
    onError,
    onNoMatch,
  })
    .use(authenticate)
    .post(async (req, res, next) => {
      try {
        const { id, address, deployedChainIds } = req.body;

        console.log(address, id);

        if (!id || !address || (deployedChainIds && !deployedChainIds.length))
          return next(createHttpError(400, "invalid body"));

        const results = await Contract.updateOne(
          {
            _id: id,
          },
          { address, deployedChainIds }
        );

        res.status(200).json(results);
      } catch (err) {
        next(err);
      }
    })
);
