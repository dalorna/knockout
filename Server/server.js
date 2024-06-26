require('dotenv').config({path: './app.yaml'});
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDb = require('./config/dbMongoConn');
const PORT = process.env.PORT || 3500;

// Connect to database
connectDb();

// Handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// Third party middleware Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded model form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use(express.static(path.join(__dirname, '.build')))
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'/index.html'));
});

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/recovery', require('./routes/api/recovery'));

app.use('/process', require('./routes/api/process'));

// protected routes
app.use(verifyJWT);
app.use('/league', require('./routes/api/league'));
app.use('/leagueSeason', require('./routes/api/leagueSeason'));
app.use('/pick', require('./routes/api/pick'));
app.use('/season', require('./routes/api/season'));
app.use('/mail', require('./routes/api/mail'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({
            error: "404 Not Found"
        });
    } else {
        res.type('txt').send("404 Not Found")
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});