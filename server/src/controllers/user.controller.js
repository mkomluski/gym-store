const userService = require("../services/user.service");

exports.getAll = async (req, res) => {
  const result = await userService.getAll(req.query);
  return res
    .status(200)
    .json({ message: "Successfully retrieved users", result });
};

exports.getOne = async (req, res) => {
  const result = await userService.getOne(req.params.id);
  return res
    .status(200)
    .json({ message: "Successfully found the user", result });
};

exports.update = async (req, res) => {
  const result = await userService.update(req.params.id, req.body);
  return res
    .status(200)
    .json({ message: "Successfully updated a user", result });
};

exports.remove = async (req, res) => {
  await userService.remove(req.params.id);
  return res.status(204).send();
};

exports.getMe = async (req, res) => {
  const result = await userService.getMe(req.user.id);
  return res.status(200).json({ message: "Profile retrieved", result });
};

exports.updateMe = async (req, res) => {
  const result = await userService.updateMe(req.user.id, req.body);
  return res
    .status(200)
    .json({ message: "Successfully updated the profile", result });
};
