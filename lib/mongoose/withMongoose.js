import connect from "./mongodb";

// eslint-disable-next-line import/no-anonymous-default-export
export default (fn) => async (req, res) => {
  await connect();
  fn(req, res);
};
