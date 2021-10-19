const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs')

const app = express();

//middleware  
app.use(express.json()) // req.body
app.use(cors())

// routes
//  register and login 
app.use("/auth", require('./routes/jwtAuth'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    try {
        console.log('seccessfully connected al port  : 5000');
    }
    catch (e) {
        console.error(e)
    }
})