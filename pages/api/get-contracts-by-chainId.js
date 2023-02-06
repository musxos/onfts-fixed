import axios from "axios";
import createHttpError from "http-errors";
import nextConnect from "next-connect";
import withMongoose from "../../lib/mongoose/withMongoose";
import { onError, onNoMatch } from "../../middlewares";
import Contract from "../../models/Contract";

export default withMongoose(
  nextConnect({
    onError,
    onNoMatch,
  }).get(async (req, res, next) => {
    try {
      const { chainId, cursor, account } = req.query;
      if (!chainId || !account)
        return next(
          createHttpError(400, "params account or chainId not specified")
        );

      const contractsInfo = await Contract.find({ deployedChainIds: chainId });

      const response = {
        cursor: null,
        page: null,
        page_size: null,
        result: [],
        total: null,
      };

      if (!contractsInfo.length) return res.status(200).json(response);

      let token_addresses = "";
      contractsInfo.forEach(({ address }, index) => {
        token_addresses += `&token_addresses=${address}`;
      });

      const paramCursor = cursor ? `&cursor=${cursor}` : "";
      const url = `https://deep-index.moralis.io/api/v2/${account}/nft?chain=${chainId}&format=decimal&limit=12${token_addresses}${paramCursor}`;

      const options = {
        method: "GET",
        url,
        headers: {
          accept: "application/json",
          "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        },
      };
      const { data } = await axios.request(options);
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  })
);
