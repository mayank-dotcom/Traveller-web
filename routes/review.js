const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require("../models/review_schema.js");
const {  reviewSchema } = require('../schema_error.js');
const Listing = require('../models/schema.js');
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require('../utils/wrapAsync.js');
const{isLoggedIn} = require('../middleware');
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    console.log(req.params.id)
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review posted");
    req.flash("rev" , "New review was added!");
    res.redirect(`/listings/${listing._id}`);
}));


router.delete('/:reviewId',isLoggedIn ,wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findOneAndDelete(reviewId);
    req.flash("del" , "Review deleted!");

    res.redirect(`/listings/${id}`);
}));
module.exports = router;