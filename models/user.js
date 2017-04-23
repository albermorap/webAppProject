var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = new Schema({  
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  meta: {
      name:     String,
      surname:  String,
      age:      { type: Number, min: 0 },
      country:  String
  },
  created_at: { type: Date, default: Date.now },
  updated_at:   Date,
  showsWatched: [ObjectId],
  showsPending: [ObjectId]
});

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

module.exports.User = mongoose.model("User", userSchema);