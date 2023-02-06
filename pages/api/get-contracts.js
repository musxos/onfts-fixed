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
      const limit = Math.abs(req.query.limit) || 10;
      const totalPages = (await Contract.countDocuments()) / limit;
      const requestedPage = (Math.abs(req.query.page) || 1) - 1;
      const page = requestedPage <= totalPages ? requestedPage : totalPages;

      try {
        const contractsInfo = await Contract.find()
          .sort({ _id: "desc" })
          .limit(limit)
          .skip(limit * page);

        res.status(200).json({ contractsInfo, limit, page, totalPages });
      } catch (err) {
        next(err);
      }
    })
);
