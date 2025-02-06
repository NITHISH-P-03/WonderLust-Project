const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

async function main(){
   await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to DataBase");
}).catch((err)=>{
    console.log(err);
});

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"67a029a310bf499ee96db233"})); 
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();