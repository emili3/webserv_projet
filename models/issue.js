const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the schema for users
const issueSchema = new Schema({
    
    status:{
        type: String,
        required: true, 
        enum: [ 'new', 'inProgress', 'canceled', 'completed' ],
        default: 'new',
    },
    
    description:{
        type: String,
        required: false, 
        maxlength: 1000,
    },
    
    imageUrl:{
        type: String,
        required: false, 
        maxlength: 500,
    },
    
    latitude:{
        type: Number,
        required: true
    },
    
    longitude:{
        type: Number,
        required: true
    },
    
    tags:[{ type: String,
            required: true}],
    
    // Validation pour vérifier si le user existe
    user:{
        type: String,
        required: true,
        
         validate: {
          validator: function(userID, callback) {
            mongoose.model("User").findOne({_id: userID}, function(err, result){
               callback(!err && result);
            });
          },
          message: 'User exist'
        }
    },
    
    createdAt:{
        type: Date, 
        default: Date.now,
        required: true
    },
    
    updatedAt:{
        type: Date,
        default: Date.now,
        required: true
    }
    
    });




// Create the model from the schema and export it
module.exports = mongoose.model('Issue', issueSchema);