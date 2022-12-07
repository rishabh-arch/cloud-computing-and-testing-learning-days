const express = require('express');
const dotenv = require("dotenv")
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json({limit:'5mb'}));

dotenv.config({ path: './config.env' });
PORT = 5000;

app.use(express.urlencoded({limit: '5mb', extended: true}));
app.disable('x-powered-by');

const userRouter = require('./routes/User');
app.use('/',userRouter);


    app.use(express.static("frontend/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })

app.listen(PORT, '0.0.0.0',() => {
    console.log(`heyyyyy , connected to database, app listening on port ${PORT}`);
});
// /root/covidproject-mern/frontend/build

// location / {
//     # First attempt to serve request as file, then
//     # as directory, then fall back to displaying a 404.
//     try_files $uri $uri/ =404;
// }