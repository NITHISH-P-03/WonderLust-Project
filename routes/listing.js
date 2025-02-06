const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listing.js");
//This multer is for uploading data
const multer  = require('multer')

const {storage}=require("../cloudConfig.js"); 
const upload = multer({storage})

router.route("/")
.get( //Index Route

  wrapAsync(listingController.index)
)
.post( 
  //adding route(create Route)
  isLoggedin,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);




//New route
router.get("/new", isLoggedin,listingController.renderNewForm);


router.route("/:id")
//show route
.get(
  wrapAsync(listingController.showListing)
).put(//(Update Route)
  isLoggedin,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
).delete(//Delete Route
  isLoggedin,
  isOwner,
  wrapAsync(listingController.destroyListing)
);



//edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);







module.exports = router;
