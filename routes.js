// routes.js

const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
const path = require('path');

const uri = 'mongodb+srv://pandeygrocks:Saurabh04@maindb.ijbfr2l.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

router.use(express.urlencoded({ extended: true }));

// Define the /submit route handler
router.post('/submit', async (req, res) => {
  const n = req.body["signup-name"];
  const ph = req.body["signup-phone"];
  const add = req.body["signup-address"];
  const em = req.body["signup-email"];
  const usern = req.body["signup-username"];
  const passw = req.body["signup-password"];
  const incent=0;

  const newUser = {
    name: n,
    phone: ph,
    address: add,
    email: em,
    username: usern,
    password: passw,
    incentive: incent,
  };

  console.log(newUser);

  const db = client.db('MainDB');
  const collection = db.collection('Users');

  try {
    await collection.insertOne(newUser);
    console.log('Data saved to MongoDB:', newUser);
    res.send('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Error saving data to MongoDB');
  }
});

router.get('/dashboard', (req, res) => {
  // Serve the 'dashboard.html' file
  res.sendFile(path.join(__dirname, '/views/pages/dashboard.html'));
});

router.get('/login', (req,res) => {
  res.sendFile(__dirname + '/views/pages/loginUser.html');
});

router.get('/offers', (req,res) => {
  res.sendFile(__dirname + '/views/pages/offers.html');
});

router.get('/success', (req,res) => {
  res.sendFile(__dirname + '/public/landingSuccess.html');
});

router.get('/profile', (req,res) => {
  res.sendFile(__dirname + '/views/pages/profile2.html');
});

router.post('/login', async (req, res) => {
  const usernameOrEmail = req.body['login-username-email'];
  const password = req.body['login-password'];

  const db = client.db('MainDB');
  const collection = db.collection('Users');

  try {
    // Check if the username or email and password match a user in the database
    const user = await collection.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      password: password,
    });

    if (user) {
      // User exists and password is correct
      
      console.log('Redirect');
      res.redirect('/dashboard');
      console.log('Success');
    } else {
      // User doesn't exist or password is incorrect
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
});

// router.post('/login', async (req, res) => {
//   const usernameOrEmail = req.body['login-username-email'];
//   const password = req.body['login-password'];

//   const db = client.db('MainDB');
//   const collection = db.collection('Users');

//   try {
//     // Check if the username or email and password match a user in the database
//     const user = await collection.findOne({
//       $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
//       password: password,
//     });

//     if (user) {
//       // User exists and password is correct
//       console.log('Redirect');
//       res.redirect('/dashboard');
//       console.log('Success');
//     } else {
//       // User doesn't exist or password is incorrect
//       res.send('Login failed');
//     }
//   } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).send('Login failed');
//   }
// });

router.get('/loginad', async (req, res) => {
  res.sendFile(__dirname + '/views/pages/loginadmin.html');
}
);
router.get('/givecredit', (req,res) => {
  res.sendFile(__dirname +'/views/pages/givecredit.html');
});

router.post('/loginad', async (req, res) => {
  const aemail = req.body['admin_email'];
  const apwd = req.body['admin_password'];
  
  const db = client.db('MainDB');
  const collection = db.collection('admins');

  try{
    const user = await collection.findOne({
      $or: [{email : aemail}], password: apwd,
    });
    if (user) {
      console.log('Redirect');
      res.redirect('/admin');
      console.log('Success');
    }
    else {
      // User doesn't exist or password is incorrect
      res.redirect('/loginad');
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Login failed');
  }
}
);

router.get('/collectionCentres', async (req, res) => {
  try {
      await client.connect();

      const db = client.db('MainDB');
      const collection = db.collection('collectionCentre');

      console.log(collection);

      const documents = await collection.find({}).toArray();
      console.log(documents);
      res.json(documents);
  } catch (error) {
      console.error('Error retrieving collectionCentres:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
      await client.close();
  }
});
// for admin 
const bodyParser = require('body-parser');
const app= express();

// Serve your HTML file
router.get('/admin', (req, res) => {
  res.sendFile(__dirname + '/views/pages/admin.html');
});

// Handle form submission
router.post('/admin', async (req, res) => {
  try {
    const { username, credit } = req.body;
    const db = client.db('MainDB');
    const collections = db.collection('Users');
    // Find the user in the database
    const user = await collections.findOne({ username });

    if (!user) {
      return res.send('User not found');
    }
    //parsing check
    
    // Update the user's credits
    user.incentive += parseInt(credit, 10);
    await collections.updateOne({ username }, { $set: user });

    res.send(`Credits updated successfully for ${user.username}. New credits: ${user.incentive}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


connectToDatabase();
module.exports = router;
