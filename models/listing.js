const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url:String,
    filename:String
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type: Schema.Types.ObjectId, //THIS IS FOR USING Review Schema
    ref:"Review",
  }],
  owner:{
    type: Schema.Types.ObjectId, //THIS IS FOR USING User Schema
    ref:"User",
  }
});


//when delete is clicked and it goes to findByIdAndDelete which comes to here
listingSchema.post("findOneAndDelete", async (req,res )=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}}); //here when the review id matches with the 
    // listingreviews array
    //after deleting reviews, delete the listing 
  }
})

const Listing = mongoose.model("Listing", listingSchema); //the model is named Listing, so Mongoose converts it to the plural form listings.
module.exports = Listing;

