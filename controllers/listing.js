const Listing = require("../models/listing.js");


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


module.exports.renderNewForm= (req, res) => {
    //console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "The requested Listing does not Exists");
      res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
  };


  module.exports.createListing=async (req, res) => {
    //wrapAsync is a fucntion which handles error which is describer
    //in utils folder it is instead of try and catch block

    //lets validate the data i=on server side
    // let result=listingSchema.validate(req.body);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }

    //let {title,description,image,price,location,country}=req.body;
    //the above method is easier for less number of data //for more number  of data create a object
    let newlisting = req.body.listing; //the listing is we add the components in object called listing in new.ejs
    let listing = new Listing(newlisting);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing is Created");
    res.redirect("/listings");
  };

 module.exports.renderEditForm=async (req, res) => {
     let { id } = req.params;
     let listing = await Listing.findById(id);
     if (!listing) {
       req.flash("error", "The requested Listing does not Exists");
       res.redirect("/listings");
     }
     res.render("listings/edit.ejs", { listing });
   };
   
   
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing is Updated");
    res.redirect(`/listings/${id}`); //"/listings"
  };


module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted");
    // console.log(deletedList);
    res.redirect("/listings");
  }