require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

const {Schema} = mongoose;

const conenctToDB = async () => {
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`DB connection established, host : ${conn.connection.host}`)
    }catch(err){
        console.error(err);
        process.exit(1);
    }
}

conenctToDB()
    .then()
    .catch((err) => {
        console.log(`DB Connection failed, ${err}`)
    })

const userSchema = new Schema({
    name : {
        type : Schema.Types.String,
        required : true,
        minLength : 2,
        maxLength : 30
    },
    email : {
        type : Schema.Types.String,
        required : true,
        unique : true
    },
    password : {
        type : Schema.Types.String,
        required : true,
        minLength : 6,
    },
    householdId : {
        type : Schema.Types.ObjectId,
        required : false
    },
    createdAt : {
        type : Schema.Types.Date
    }
});

const householdSchema = new Schema({
    name : {
        type : Schema.Types.String,
        required : true,
        minLength : 3,
        maxLength : 30
    },
    inviteCode : {
        type : Schema.Types.String,
        unique : true,
        length : 6,
        uppercase : true
    },
    members : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }],
    wasteScore : {
        type : Schema.Types.Number,
        min : 0,
        max : 100,
        default : 0
    },
    createdAt : {
        type : Schema.Types.Date
    }
});

const itemSchema = new Schema({
    householdId : {
        type : Schema.Types.ObjectId,
        required : true
    },
    addedBy : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    name : {
        type : Schema.Types.String,
        required : true
    },
    category : {
        type : Schema.Types.String,
        enum : ['produce', 'dairy', 'meat', 'pantry', 'frozen', 'other']
    },
    quantity : {
        type : Schema.Types.Number,
        default : 1
    },
    expiryDate : {
        type : Schema.Types.Date,
        required : true
    },
    status : {
        type : Schema.Types.String,
        enum : ['fresh', 'expiring-soon', 'expired', 'used', 'wasted']
    },
    createdAt : {
        type : Schema.Types.Date
    },
    updatedAt : {
        type : Schema   .Types.Date
    }
});

const user = mongoose.model('User', userSchema);
const household = mongoose.model('Household', householdSchema);
const item = mongoose.model('Item', itemSchema);

module.exports = {
    user,
    household,
    item
}