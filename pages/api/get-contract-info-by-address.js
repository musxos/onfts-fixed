import createHttpError from "http-errors";
import nextConnect from "next-connect";
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
    .get(async (req, res, next) => {
      try {
        const { address } = req.query;

        if (!address)
          return next(
            createHttpError(400, "params account or chainId not specified")
          );

        const contractsInfo = await Contract.findOne({ address });

        res.status(200).json(contractsInfo);
      } catch (err) {
        next(err);
      }
    })
);
