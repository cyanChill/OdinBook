exports.homeGet = async (req, res, next) => {
  return res.status(200).json({ message: "Successfully pinged backend." });
};
