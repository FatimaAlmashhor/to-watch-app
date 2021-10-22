const express = require("express");
const router = express.Router();
const pool = require('../db.config');
const bcrypt = require('bcryptjs');
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");

// registering 
router.post('/register', validInfo, async (req, res) => {
    try {
        // 1- destracture the req.body (name ,email , password) 
        const { name, email, password } = req.body;
        // 2- check if user exist 
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);
        // 3- bcrypt the user password 
        if (user.rows.length > 0) {
            return res.status(401).json("User already exist!");
        }
        // 4- enter the new user info 
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        let newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );
        // 5- genrating jwt token 

        const jwtToken = jwtGenerator(newUser.rows[0].user_id);
        return res.json({ jwtToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

router.post('/login', validInfo, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE  user_email = $1", [
            email
        ])
        if (user.rows.length === 0) {
            return res.status(401).json("Invalid Credential");
        }

        const vildPassword = await bcrypt.compare(
            password,
            user.rows[0].user_password
        )

        if (!vildPassword) {
            return res.status(401).json("Invalid Credential");
        }

        const jwtToken = jwtGenerator(user.rows[0].user_id);
        return res.json({ jwtToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
})
router.post("/verify", authorize, (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;