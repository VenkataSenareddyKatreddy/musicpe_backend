// import bcrypt from "bcryptjs";
// import jwt from 'jsonwebtoken'
// import conn from "../config/db.js";
 
// export const login = async (req, res) => { 
//     try{
//         const {email,password} = req.body;

//         //if any of the fields are empty
//         if (!email || !password) {
//             res.status(400)
//             throw new Error("Please add all fields");
//         }

//         const db = conn.db('music_streaming');
//         const collection = db.collection('users');
//         // Check if user exists
//         const user = await collection.findOne({ email });
//         if (!user) {
//             res.status(400)
//             throw new Error("User does not exists");
//         }
//         if(user && bcrypt.compareSync(password,user.password)){
//             res.status(200).json({
//                 message:'User logged in',
//                 status:'success',
//                 token: generateToken(user._id)
//             })
//         }
//         else{ 
//             res.status(400)
//             throw new Error('Invalid credentials')
//         }


//     }
//     catch(err){
//         res.send(err.message)
//     }

// };


// //@desc: Register a new user
// //@route : POST /api/user/login
// //@access  Public
// export const register = async (req, res) => {
//   try {

//     //Get the informaiton from the request body
//     const { fullName, email, password } = req.body;

//     //if any of the fields are empty
//     if (!fullName || !email || !password) {
//       res.status(400);
//       throw new Error("Please add all fields");
//     }

//     const db = conn.db('music_streaming');
//     const collection = db.collection('users');

//     // Check if user exists
//     const userExists = await collection.findOne({ email });
//     if (userExists) {
//       res.status(400);
//       throw new Error("User already exists");
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = await collection.insertOne({
//       fullName,
//       email,
//       password: hashedPassword,
//       playllists: []
//     });
//     if (user) {
//       res.status(201).json({
//         message: "user registered",
//         status: "success", 
//       });
//     } else {
//       res.status(400);
//       throw new Error("Invalid user data");
//     }
//   } catch (err) {
//     console.log(err.message);
//     return res.send(err.message);
//   }
// };

// //Generate JWT for the user 
// const generateToken = (id) => {
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: "7d",
//     });
//     }

import jwt from 'jsonwebtoken';
import conn from "../config/db.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please provide both email and password" });
        }

        const db = conn.db('music_streaming');
        const collection = db.collection('users');

        const user = await collection.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Assuming no hashing, compare password directly
        if (user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user._id);
        return res.status(200).json({
            message: 'User logged in',
            status: 'success',
            token: token
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const db = conn.db('music_streaming');
        const collection = db.collection('users');

        const userExists = await collection.findOne({ email });

        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Assuming no hashing of password, storing as is
        const user = await collection.insertOne({
            fullName,
            email,
            password, // No hashing
            playlists: []
        });

        if (user) {
            return res.status(201).json({
                message: "User registered",
                status: "success",
            });
        } else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
