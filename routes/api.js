const router = require("express").Router();
const apiController = require("../controllers/apiController");
const { uploadSingle } = require("../middlewares/multer");

router.get("/landing-page", apiController.landingPage);
router.get("/category-page", apiController.categoryPage);
router.get("/list-page/:id", apiController.categoriListPage);
router.post("/search/:userinput", apiController.searchUserInput);
router.get("/detail-page/:id", apiController.detailPage);
router.get("/next-page/:id", apiController.detailPageNextEpisode);
router.post("/detail-page/:id/komentar/:userid", apiController.addComment);
router.post("/booking-page", uploadSingle, apiController.bookingPage);
module.exports = router;
