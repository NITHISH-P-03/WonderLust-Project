const Review = require("../models/review.js");
const Listing=require("../models/listing.js");

module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review is Created");
    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview=async (req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews:reviewId}});
    //The $puLL operator removes from an existing array all instances of a value or values that match a specified condition.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is Deleted");
    res.redirect(`/listings/${id}`);

    //here this  helps only when deleteing single review ut when we delete the entire list 
    //then the review will still be available in review schema so inorder to delete that

    //when we request delete from the page it comes  when  it goes to Delete Route /*app.delete("/listings/:id", */
    //there when findByIdAndDelte is called it goes to listingSchema Where a midddle ware isdeclared 
    //which deletes the entire list
};