const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const userSchema = new Schema({

    // username entre 2 et 20 caractères
    username: {
    type: String, // Type validation
    required: true,
    unique: true,
    minlength: [ 2, 'Name is too short' ], // Minimum length
    maxlength: [ 20, 'Name is too long' ] // Maximum length
  },

    // firstName entre 2 et 20 caractères
    firstName: {
    type: String, // Type validation 
    minlength: [ 2, 'Name is too short' ], // Minimum length
    maxlength: [ 20, 'Name is too long' ] // Maximum length
  },

    // lastName entre 2 et 20 caractères
    lastName: {
    type: String, // Type validation 
    minlength: [ 2, 'Name is too short' ], // Minimum length
    maxlength: [ 20, 'Name is too long' ] // Maximum length
  },
    
    // role de l'utilisateur
    role: {
    type: String,
    required: true, 
    enum: [ 'citizen', 'manager' ] // citizen or manager
    },
    
    // date de la création de l'utilisateur
    createdAt: {
    type: Date,
    default: Date.now
    }
    
});

// Create the model from the schema and export it
module.exports = mongoose.model('User', userSchema);