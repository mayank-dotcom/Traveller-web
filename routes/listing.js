const express = require('express');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema_error.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/schema.js');
const router = express.Router();
const{isLoggedIn, isOwner,validateListing} = require('../middleware.js');
const LC = require('../Controller/listing.js');
const multer  = require('multer');
const{storage} = require("../Cloudconfig.js");
const upload = multer({ storage });

router.get('/new', isLoggedIn,LC.new);
router.post('/create',isLoggedIn,upload.single("listing[imageUrl]"),
wrapAsync(LC.create), 
(req,res) => {
    res.send(req.file);
});
router
.route('/:id')
.get(
     wrapAsync(LC.review)
    )
.delete(
    isLoggedIn, 
    wrapAsync(LC.destroy)
);
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(LC.edit));
router.put('/edited/:id', isLoggedIn,isOwner,upload.single("listing[imageUrl]"),
    wrapAsync(async (req, res) => {
    const { id } = req.params;
    let nlisting = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    try{
    if(typeof req.file!=="undefined") { 
    let url = req.file.path;
    let filename = req.file.filename;
    nlisting.image = { url, filename};
    await nlisting.save();
    }
}
catch(e){
    console.log(e);
}
console.log(nlisting);
    req.flash("edited" , "Listing was updated !");

    res.redirect('/home');
}));

module.exports = router;