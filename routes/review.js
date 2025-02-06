const express=require("express");
const router=express.Router({mergeParams : true}); //this is used when there is parameter in the routes  
const wrapAsync=require("../utils/wrapAsync.js"); 
//this is in utils which is a function which handles error this
//is the alternative of try and catch
//Requiring the Custom ErrorHandling which is once again declared in util Package
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema,listingSchema}=require("../schema.js");
const Review = require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedin, isReviewAuthor}=require("../middleware.js");


const reviewController=require("../controllers/review.js");


//Post Review Route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.createReview)); 

//This is Review Delete Route
router.delete("/:reviewId",isLoggedin,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;



