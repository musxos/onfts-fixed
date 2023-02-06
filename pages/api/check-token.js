import nextConnect from "next-connect";
import withMongoose from "../../lib/mongoose/withMongoose";
import { onError, onNoMatch } from "../../middlewares";
import { authenticate } from "../../middlewares/auth";

export default withMongoose(
  nextConnect({
    onError,
    onNoMatch,
  })
    .use(authenticate)
    .get((req, res) => {
      res.status(200).json(req.user);
    })
);
