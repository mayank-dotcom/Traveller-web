const Listing = require ("../models/schema");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });
module.exports.new = (req, res) => { 
    res.render('listings/new'); 
}; 
module.exports.create = async (req, res) => {
    const GPS = (req.body.listing.country,req.body.listing.location);

    let response = await geocodingClient.forwardGeocode({
        query: GPS,
        limit: 1,
      })
        .send();      

    let url = req.file.path;
    let filename = req.file.filename;
    console.log("Request Body:", req.body); // Log request body
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    newListing.category = req.body.listing.category;
    let savedListing = await newListing.save();   
    console.log(savedListing);
    // console.log(newListing);
    req.flash("success" , "New listing created!");
   
    res.redirect('/home',);
};
module.exports.destroy = async (req, res) => {
    const { id } = req.params;
    const deleteList = await Listing.findByIdAndDelete(id);
    console.log(deleteList);
    req.flash("del" , "Listing was deleted !");
   
    res.redirect('/home');
};
module.exports.edit =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const category = listing.category;
    let ogimg_url = listing.image.url;
    ogimg_url= ogimg_url.replace('/upload', '/upload/h_250,w_250');
    res.render('listings/edit', { listing,ogimg_url,category});
};
module.exports.review =async (req, res) => {
    const { id } = req.params;
    const myListing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
        path:"author",
        },
    }).populate("owner");
    res.render('listings/individual', { myListing });
    console.log(myListing);
};
