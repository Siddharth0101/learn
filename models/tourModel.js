const mongoose = require('mongoose');
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'length should be max 40'],
    minlength: [3, 'length should be min 3'],
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [1, 'min is 1'],
    max: [5, 'max is 5']
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  secretTour: {
    type: Boolean,
    default: false
  },
  slug: String
});
//only workds on the save () and create ()
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.post('save', function (doc) {
  console.log(doc)
})

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } })
})

tourSchema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
