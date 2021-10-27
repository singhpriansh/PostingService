const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts");
const userauthRoutes = require("./routes/userauth");

const app = express();
mongoose.connect("mongodb+srv://priyanshu:spvmfufVafB7xxV@cluster0.c7q1k.mongodb.net/node-angular?retryWrites=true&w=majority")
// mongoose.connect("mongodb+srv://priyanshu:"+process.env.Mongo_atls_pss+"@cluster0.c7q1k.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log('Connected to the database!')
    })
    .catch(() => {
        console.log('Connection failed!')
    })
;

app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
        );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
        );
    next();
});

app.use("/images", express.static(path.join("backend/images")));
app.use("/api/posts", postsRoutes);
app.use("/api/user", userauthRoutes);

module.exports = app;
