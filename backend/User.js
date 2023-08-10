const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    Todo: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        deadline: { type: Date }
    }],
    Ongoing: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        deadline: { type: Date }
    }],
    Done: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }
    }],
    Expired: [{
        priority: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true }
    }]
})
module.exports = mongoose.model("User", userSchema);
