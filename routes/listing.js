const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index and create route
router
  .route("/")
  .get(isLoggedIn, wrapAsync(listingController.index))
  // .post(isLoggedIn,validateListing,wrapAsync(listingController.createListing));
  .post(
    isLoggedIn,
    validateListing,
    upload.single("Listing[image]"),
    wrapAsync(listingController.createListing)
  );
//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);
//show , update and delete route
router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("Listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
