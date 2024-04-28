const express = require("express");
const router = express.Router();

const PostController = require("../controllers/posts");
const checkAuth = require("../middware/check-auth");
const multmiddextract = require("../middware/multerfile");

router.post("", checkAuth, multmiddextract, PostController.CreatePost);

router.put("/:id", checkAuth, multmiddextract, PostController.UpdatePost);

router.get("", PostController.GetAllPost);

router.get("/:id", PostController.GetOnePost);

router.delete("/:id", checkAuth, PostController.DeletePost);

module.exports = router;
