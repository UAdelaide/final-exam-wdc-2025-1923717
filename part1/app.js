var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var dogsRouter = require('/api/dogs');
var walkrequestssRouter = require('/api/walkrequests/open');
var walkersRouter = require('/api/walkers/summary');

app.use('/api/dogs',dogsRouter);
app.use('/api/walkrequests/open',walkrequestssRouter);
app.use('/api/walkrequests/open',walkersRouter);

let db;

(async () => {
  try {
    // Connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'DogWalkService'
    });

    // Create a table if it doesn't exist
    await db.execute(`
    CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('owner', 'walker') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )

    CREATE TABLE Dogs (
    dog_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    size ENUM('small', 'medium', 'large') NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id)
    )

    CREATE TABLE WalkRequests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    dog_id INT NOT NULL,
    requested_time DATETIME NOT NULL,
    duration_minutes INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    status ENUM('open', 'accepted', 'completed', 'cancelled') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
    )

    CREATE TABLE WalkApplications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    walker_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
    FOREIGN KEY (walker_id) REFERENCES Users(user_id),
    CONSTRAINT unique_application UNIQUE (request_id, walker_id)
    )

    CREATE TABLE WalkRatings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    walker_id INT NOT NULL,
    owner_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comments TEXT,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES WalkRequests(request_id),
    FOREIGN KEY (walker_id) REFERENCES Users(user_id),
    FOREIGN KEY (owner_id) REFERENCES Users(user_id),
    CONSTRAINT unique_rating_per_walk UNIQUE (request_id)
    )
    `);

    // Insert data if table is empty
    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', hashed789', 'owner),
        ('steve456', steve@example.com', 'hashed665', 'walker'),
        ('kate124', 'kate@example.com', 'hashed123', 'owner'),
        ('emma442', 'emma@example.com', 'hashed556', 'owner'),
        ('luke332', 'luke@example.com', 'hashed711', 'owner');
       `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT Dogs.name,
    Dogs.size
    FROM Dogs
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Dogs' });
  }
});

app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT
    WalkRequests.request_id,
    WalkRequests.request_time,
    WalkRequests.duration_minutes,
    WalkRequests.location
    FROM WalkRequests
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch WalkRequests' });
  }
});



module.exports = app;


