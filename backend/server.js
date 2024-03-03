const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User");
require("dotenv").config();

const tokenBlacklist = new Set();

function addToBlacklist(token) {
    tokenBlacklist.add(token);
}

function isTokenBlacklisted(token) {
    return tokenBlacklist.has(token);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(200).json({ message: "Invalid" });
    }

    jwt.verify(token, process.env.JWT_KEY, (error, user) => {
        if (error) {
            return res.status(200).json({ message: "Invalid" });
        }

        if (isTokenBlacklisted(token)) {
            return res.status(200).json({ error: "Invalid" });
        }

        req.user = user;
        next();
    });
}
mongoose
    .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to the database");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
    });

app.use(
    cors({
        origin: "https://task-manager-by-rajeshwar.netlify.app",
        credentials: true,
    })
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend/build/")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.post("/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingMail = await User.findOne({
            email: email,
        });

        if (existingMail) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const existingName = await User.findOne({
            name: username,
        });

        if (existingName) {
            return res.status(409).json({ error: "Name already exists" });
        }

        const user = await User.create({
            email: email,
            name: username,
            password: hashedPassword,
        });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
            expiresIn: "30d",
        });

        return res.status(200).json({ name: user.name, token });
    } catch (error) {
        return res.status(409).json({ error });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email,
        });

        if (!user) {
            return res.status(409).json({ error: "Email does not exist" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Incorrect Password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
            expiresIn: "30d",
        });

        return res.status(200).json({ name: user.name, token });
    } catch (error) {
        return res.status(409).json({ error });
    }
});

app.post("/addTask", authenticateToken, async (req, res) => {
    try {
        const { cardId, title, priority, deadline, description } = req.body;

        const currentUser = await User.findOne({ _id: req.user.userId });
        if (!currentUser) {
            return res.status(409).json({ error: "No User Found to add task" });
        }
        const userdetails = await User.updateOne(
            { _id: currentUser._id },
            {
                $push: {
                    Todo: {
                        cardId: cardId,
                        priority: priority,
                        title: title,
                        description: description,
                        deadline: deadline,
                    },
                },
            }
        );
        res.status(200).json({ message: "successful" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

app.post("/getTask", authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findOne(
            { _id: req.user.userId },
            { name: 1, email: 1, Todo: 1, Ongoing: 1, Done: 1, Expired: 1 }
        );
        if (!currentUser) {
            return res
                .status(404)
                .json({ error: "No tasks found for the provided user" });
        }
        res.status(200).json({ userdetails: currentUser });
    } catch (error) {
        console.error("Error during fetching data:", error);
        res.status(500).json({
            error: "An error occurred during data retrieval",
        });
    }
});

app.post("/deleteTask", authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findOne({ _id: req.user.userId });
        if (!currentUser) {
            return res.status(404).json({ error: "No User found" });
        }

        const type = req.body.type;
        const cardId = req.body.cardId;

        const userdetails = await User.updateOne(
            { _id: currentUser._id },
            { $pull: { [type]: { cardId: cardId } } }
        );

        res.status(200).json({ message: "Task removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

app.post("/editTask", authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findOne({ _id: req.user.userId });
        if (!currentUser) {
            return res.status(404).json({ error: "No User found" });
        }
        const {
            type,
            cardId,
            title,
            priority,
            description,
            deadline = null,
        } = req.body;
        const result = await User.updateOne(
            {
                _id: currentUser._id,
                [type]: { $elemMatch: { cardId: cardId } },
            },
            {
                $set: {
                    [`${type}.$[element].priority`]: priority,
                    [`${type}.$[element].title`]: title,
                    [`${type}.$[element].description`]: description,
                    [`${type}.$[element].deadline`]: deadline,
                },
            },
            {
                arrayFilters: [{ "element.cardId": cardId }],
            }
        );
        res.status(200).json({ message: "Editted successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
});

app.post("/moveTask", authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findOne({ _id: req.user.userId });
        if (!currentUser) {
            return res.status(404).json({ error: "No User found" });
        }
        const currentType = req.body.currentType;
        const moveType = req.body.moveType;
        const cardId = req.body.cardId;

        const userDetails = await User.findOne(
            {
                _id: currentUser._id,
                [currentType]: { $elemMatch: { cardId: cardId } },
            },
            { [currentType]: { $elemMatch: { cardId: cardId } } }
        );

        if (!userDetails) {
            return res.status(404).json({ error: "Task not found" });
        }

        const taskToMove = userDetails[currentType][0];

        await User.updateOne(
            { _id: currentUser._id },
            { $push: { [moveType]: taskToMove } }
        );

        await User.updateOne(
            { _id: currentUser._id },
            { $pull: { [currentType]: { cardId: cardId } } }
        );

        res.status(200).json({ message: "Todo element moved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
    }
});

app.post("/logout", authenticateToken, (req, res) => {
    const token = req.user.token;
    addToBlacklist(token);
    res.status(200).json({ message: "Logged out successfully" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
