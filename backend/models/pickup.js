const mongoose = require("mongoose")

const pickupSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true

    },

    message: {
        type: String
    }

},

{
    timestamps: true
}

)

module.exports = mongoose.model("Pickup", pickupSchema)