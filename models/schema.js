const mongoose = require('mongoose');
const { listingSchema } = require('../schema_error');
const Schema = mongoose.Schema;
const Review = require('../models/review_schema.js');

const ListingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    url: String,
    filename:String,
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  reviews :[
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  category: {
    type: 'string',
    enum:['Trending','Bed','Farm','Pools',"Mountains","Eco-Friendly","Beach","Arctic","Room","New","Lake sight","Flat","Forest","Boats","Fort"], 
    required:true
  }
});
ListingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
