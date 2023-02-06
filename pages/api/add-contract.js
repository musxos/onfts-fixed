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
      const web3 = new Web3();

      try {
        const { address, deployedChainIds } = req.body;

        if (!address || (deployedChainIds && !deployedChainIds.length))
          return next(createHttpError(400, "invalid body"));

        const isRecordExists = await Contract.findOne({ address });

        if (isRecordExists) return next(createHttpError(409));

        const contract = new Contract({
          address,
          deployedChainIds,
        });

        const results = await contract.save();
        res.status(201).json(results);
      } catch (err) {
        next(err);
      }
    })
);
