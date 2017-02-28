const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({
    
    // firstName entre 2 et 20 caractères
    firstName: {
    type: String, // Type validation
    required: true, 
    minlength: [ 2, 'Name is too short' ], // Minimum length
    maxlength: 20 // Maximum length
  },

    // lastName entre 2 et 20 caractères
    lastName: {
    type: String, // Type validation
    required: true, 
    minlength: [ 2, 'Name is too short' ], // Minimum length
    maxlength: 20 // Maximum length
  },
    
    
    role: {
    type: String,
    required: true, 
    enum: [ 'citizen', 'manager' ] // citizen or manager
    },
    
    // date de la création de l'utilisateur
    date: { type: Date, 
           default: Date.now, 
           required: true }
    
});

    userSchema.index({ firstName: 1, lastName: 1  }, { unique: true });

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);