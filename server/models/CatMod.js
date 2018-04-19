const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// const _ = require('underscore');

let CatModel = {};

// const convertId = mongoose.Types.ObjectId;

const CatSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    default: 'cat',
    trim: true,
  },

  breed: {
    type: String,
    default: 'glitch',
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  totalPets: {
    type: Number,
    min: 0,
    default: 0,
    required: true,
  },

  lastPlayer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Account',
  },

  lastTimePet: {
    type: Date,
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

CatSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  _id: doc._id,
  breed: doc.breed,
  owner: doc.owner,
  totalPets: doc.totalPets,
  lastPlayer: doc.lastPlayer,
});

CatSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: ownerId,
  };
  return CatModel.find(search, callback);
};

CatSchema.statics.findRandom = (ownerId, callback) => {
  const search = {
    owner: { $ne: ownerId },
  };
  CatModel.count(search, (err, count) => {
    if (err) {
      return callback(err);
    }
    const rand = Math.floor(Math.random() * count);
    return CatModel.findOne().skip(rand).exec(callback);
  });
};

CatSchema.statics.findById = (catId, callback) => {
  const search = {
    _id: catId,
  };
  return CatModel.findOne(search, callback);
};

CatModel = mongoose.model('Cat', CatSchema);

module.exports.CatModel = CatModel;
module.exports.CatSchema = CatSchema;
