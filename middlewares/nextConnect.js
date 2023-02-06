export const onError = (err, req, res, next) => {
  // render the error page
  res.status(err.status || 500).json({ message: err.message });
  res.end();
};

export const onNoMatch = (req, res) => {
  res.sendStatus(404);
  res.end();
};
