const express = require('express');
const route = require('./route/route.js');
const app = express();
const multer = require('multer')
// require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().any())

const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://Aniket:EpboWtWnytBBkVgl@cluster0.bxt9xv1.mongodb.net/Group-56-ProductManagement?retryWrites=true&w=majority",
 {useNewUrlParser: true})
    .then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err))

app.use('/', route);
//----------handling wrong api edge case--------------------------------------------
app.use((req, res, next) => {
    res.status(404).send({ status: false, error: "path not found" });
})

app.listen(process.env.PORT || 3000 , function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000 ))
});