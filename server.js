let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type,Accept"
  );
  next();
});
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let { Client } = require("pg");
let client = new Client({
  user: "postgres",
  password: "MAnoj123@786",
  database: "postgres",
  port: 5432,
  host: "db.ffhgklroggnimgnnkarw.supabase.co",
  ssl: { rejectUnauthorized: false },
});
client.connect(function (res, error) {
  console.log(`Connected!!!`);
});

app.get("/allusers", function (req, res) {
  let query = "SELECT * FROM userdetails";
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(result.rows);
    }
  });
});

app.get("/userdata", function (req, res) {
  let query = "SELECT * FROM userdata";
  client.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(result.rows);
    }
  });
});

app.post("/postusers", function (req, res) {
  const query = `
    INSERT INTO userdetails 
    (first_name, last_name, gender, dob, country, state, city, zip, interests, profile_picture, password) 
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `;
  const interestsArray = ["Reading", "Writing"]
  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.gender,
    req.body.dob,
    req.body.country,
    req.body.state,
    req.body.city,
    req.body.zip,
    interestsArray,
    'https://example.com/profile-picture.jpg',
    req.body.password
  ];

  client.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.status(201).json({ message: 'User details inserted successfully' });
    }
  });
});

app.delete('/deleteuser/:id', (req, res) => {
  const userId = req.params.id;
  const deleteQuery = `DELETE FROM userdetails WHERE id = ${userId}`;
  client.query(deleteQuery, (error, result) => {
    console.log(result,error);
    if (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log(`User with ID ${userId} deleted successfully`);
        res.json({ message: 'User deleted successfully' });
    }
  });
});

app.put('/updateuser/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  console.log(updatedUserData);
  console.log(userId)
  const interestsArray = ["Reading", "Writing"]
client.query(
  "UPDATE userdetails SET first_name = $1, last_name = $2, gender = $3, dob = $4, country = $5, state = $6, city = $7, zip = $8, interests = $9, profile_picture = $10, password = $11 WHERE id = $12 RETURNING *",
  [
    updatedUserData.first_name,
    updatedUserData.last_name,
    updatedUserData.gender,
    updatedUserData.dob,
    updatedUserData.country,
    updatedUserData.state,
    updatedUserData.city,
    updatedUserData.zip,
    interestsArray,
    "https://example.com/profile-picture.jpg",
    updatedUserData.password,
    userId,
  ],
  (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      } else {
        res.status(404).send("No user found");
      }
    }
  }
);
});

app.put('/updatepassword/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
client.query(
  "UPDATE userdetails SET password = $1 WHERE id = $2 RETURNING *",
  [
    updatedUserData.password,
    userId,
  ],
  (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      if (result.rows.length > 0) {
        res.send(result.rows[0]);
      } else {
        res.status(404).send("No user found");
      }
    }
  }
);
});

app.put('/resetpassword', (req, res) => {
  console.log("11",req.body)
  const { email, newPassword, confirmPassword } = req.body;
   console.log("22",req.body.email)
  
   client.query(
    "UPDATE userdata SET password = $1 WHERE email = $2 RETURNING *",
    [
      confirmPassword,
      email,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        if (result.rows.length > 0) {
          res.send(result.rows[0]);
        } else {
          res.status(404).send("No user found");
        }
      }
    }
  );
});