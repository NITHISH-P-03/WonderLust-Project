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
    type: String,
    default:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwd2l0aCUyMGhvdXNlc3xlbnwwfHwwfHx8MA%3D%3D",
    set: (v) => //this is for empty imaage
      v === ""
        ? "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwd2l0aCUyMGhvdXNlc3xlbnwwfHwwfHx8MA%3D%3D"
        : v,
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

