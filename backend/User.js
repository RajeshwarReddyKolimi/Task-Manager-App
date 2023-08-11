const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    Todo: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        deadline: { type: Date },
        cardId: { type: String }
    }],
    Ongoing: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        deadline: { type: Date },
        cardId: { type: String }
    }],
    Done: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        cardId: { type: String }
    }],
    Expired: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        cardId: { type: String }
    }]
})
module.exports = mongoose.model("User", userSchema);
