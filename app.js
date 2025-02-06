
//.env refers to  environmental variables which stores import details
if(process.env.NODE_ENV != "production" ){
    require("dotenv").config();
}
//console.log(process.env);


const express=require("express");
const app=express();
const mongoose=require("mongoose");

const port=8080;
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js"); //this is in utils which is a function which handles error this
//is the alternative of try and catch
//Requiring the Custom ErrorHandling which is once again declared in util Package
const ExpressError=require("./utils/ExpressError.js");

const session=require('express-session');
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));

//This is for Router Express which has listings
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

async function main(){
    await mongoose.connect(MONGO_URL);
 }
 
 main().then(()=>{
     console.log("connected to DataBase");
 }).catch((err)=>{
     console.log(err);
 });

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,//(1week : 7days*24hrs*60mins*60secs*1000millisecs)
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error"); 
    res.locals.currUser=req.user;
    next();
})


// app.get("/demoUser",async (req,res)=>{
//     let fakeUser=({
//         email:"student@gmail.com",
//         username:"Abdevilliers"
//     });

//     let registeredUser=await User.register(fakeUser,"helloword");
//     res.send(registeredUser);
// })


// app.get("/",(req,res)=>{
//     res.send("This is the Home page");
// })




//Listings
app.use("/listings",listingRouter);


//REVIEWS
app.use("/listings/:id/reviews",reviewRouter);

//User
app.use("/",userRouter)



//This is Error Handling
app.all(("*"),(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//here now we are describing the middleware which handles the error
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
   // res.status(statusCode).send(message);
   // res.send("Something Went Wrong");

    //here this works when we use next(err) so if it finds any error by useing (try,catch),(wrapAsync) 
    //then it Shows Something went Wrong    
});


//if the user gives the route which doesnt match with all other routes which we described then'





app.listen(8080,()=>{
    console.log(`Server is running on port ${port}`);
});

