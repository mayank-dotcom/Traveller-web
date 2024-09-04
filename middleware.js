const Listing = require('./models/schema');
module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('del',"You must be logged in first");
        res.redirect('/login');
    }
    next();
};
module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUsr._id)){
        req.flash("error", "You don't have permission to edit this");
        return res.redirect(`/listings/${id}`);
    } 
    next();
};
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};