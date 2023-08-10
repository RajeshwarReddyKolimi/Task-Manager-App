const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const User = require('./User');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const cors = require('cors');

require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Connected");
})
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL, }),
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));
app.use(
    cors({
        origin: 'https://main--cerulean-monstera-3ccddd.netlify.app',
        credentials: true,
    })
);

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.static(path.join(__dirname, '../frontend/build/')));

app.get('/session', (req, res) => {
    try {
        if (req.session.user) {
            return res.status(200).json({ value: true, user: req.session.user });
        } else {
            return res.status(200).json({ value: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking session' });
    }
});

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// })

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const name = req.body.username;
    const password = req.body.password;
    const existingMail = await User.findOne({
        email: email
    });
    if (existingMail) {
        return res.status(409).json({ error: 'Email already exists' });
    }
    const existingName = await User.findOne({
        name: name
    });
    if (existingName)
        return res.status(409).json({ error: 'Name already exists' });

    const user = await User.create({
        name: name, email: email, password: password
    })
    await user.save();
    req.session.user = await User.findOne({ email: email });
    return res.status(200).json({ message: 'Sign-up successful' });

});

app.post('/login', async (req, res) => {
    if (req.session.user) {
        return res.status(200).json({ message: 'Already logged in' });
    }
    const email = req.body.email;
    const password = req.body.password;
    const existingMail = await User.findOne({
        email: email
    });
    if (!existingMail) {
        return res.status(409).json({ error: 'Email does not exist' });
    }
    const currentUser = await User.findOne({ email: email, password: password });
    if (!currentUser)
        return res.status(409).json({ error: 'Invalid password' });
    req.session.user = currentUser;
    return res.status(200).json({ message: 'Login successful' });
});

app.post('/addTask', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(404).json({ error: "No User logged in" });
    }
    const title = req.body.title;
    const priority = req.body.priority;
    const deadline = req.body.deadline;
    const description = req.body.description;

    const currentUser = await User.findOne({ name: req.session.user.name });
    if (!currentUser) {
        res.status(409).json({ error: 'No User Found to add task' });
    }
    const userdetails = await User.updateOne(
        { name: currentUser.name },
        {
            $push: {
                Todo: {
                    priority: priority,
                    title: title,
                    description: description,
                    deadline: deadline
                }
            }
        }
    );

    res.status(200).json({ message: 'successful' });
});

app.get('/getTask', async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(404).json({ error: "No User logged in" });
        }
        const currentUser = req.session.user;
        const userdetails = await User.findOne({ name: currentUser.name }, { name: 1, email: 1, Todo: 1, Ongoing: 1, Done: 1, Expired: 1 });
        if (!userdetails) {
            return res.status(404).json({ error: 'No tasks found for the provided username' });
        }
        res.status(200).json({ userdetails });
    } catch (error) {
        console.error('Error during fetching data:', error);
        res.status(500).json({ error: 'An error occurred during data retrieval' });
    }
});

app.post('/deleteTask', async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(404).json({ error: "No User logged in" });
        }
        const currentUser = req.session.user;
        const type = req.body.type;
        const title = req.body.title;
        const userdetails = await User.updateOne(
            { name: currentUser.name },
            { $pull: { [type]: { title: title } } }
        );
        res.status(200).json({ message: 'Todo element removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
})
app.post('/moveTask', async (req, res) => {
    try {
        if (!req.session || !req.session.user) {
            return res.status(404).json({ error: "No User logged in" });
        }
        const currentUser = req.session.user;
        const currentType = req.body.currentType;
        const moveType = req.body.moveType;
        const title = req.body.title;
        const userDetails = await User.findOne(
            { name: currentUser.name, [currentType]: { $elemMatch: { title: title } } },
            { [currentType]: { $elemMatch: { title: title } } }
        );
        if (!userDetails) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const taskToMove = userDetails[currentType][0];
        await User.updateOne(
            { name: currentUser.name },
            {
                $push: {
                    [moveType]: taskToMove
                }
            }
        );
        await User.updateOne(
            { name: currentUser.name },
            { $pull: { [currentType]: { title: title } } }
        );
        res.status(200).json({ message: 'Todo element moved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ message: 'Logged Out' });
    } catch (error) {
        console.error('Error during fetching data:', error);
        res.status(500).json({ error: 'An error occurred during data retrieval' });
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
