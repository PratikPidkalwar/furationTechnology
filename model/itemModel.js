const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        required: true,
        ref: "user"
    },

    price: {
        type: Number,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 0,
    },

    currencyId: {
        type: String,
        required: true,
        trim: true,
    },
    deletedAt: { type: Date, default: null },

    isDeleted: { type: Boolean, default: false },

},
    { timestamps: true });

module.exports = mongoose.model("item", itemSchema);