const express = require('express');
const app = express();
const cors = require('cors');

//middleware
app.use(cors());
//fullstack needs data from client side by request body
//gives access to req.body property 
app.use(express.json());


app.listen(5000, () => {
    console.log('Server is running on port 5000');
});