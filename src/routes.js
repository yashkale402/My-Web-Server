// src/routes.js
const express = require('express');
const router = express.Router();
const db = require('./database');  // Import the DocumentClient
const { v4: uuidv4 } = require('uuid');  // For unique ID generation

// DynamoDB table name
const tableName = process.env.DB_NAME || 'Contacts';

// Route to add a username
router.post('/add', async (req, res) => {
    const { username } = req.body;
    const id = uuidv4();  // Generate a unique ID for the contact

    const params = {
        TableName: tableName,
        Item: {
            id,         // Unique identifier for each contact
            username,   // Username value from the request body
        },
    };

    try {
        await db.put(params).promise();
        res.redirect('/');
    } catch (err) {
        console.error('Error inserting data:', err.message);
        res.status(500).send('Database error');
    }
});

// Route to get all usernames
router.get('/contacts', async (req, res) => {
    const params = {
        TableName: tableName,
    };

    try {
        const data = await db.scan(params).promise();  // Retrieve all items from the table
        res.json(data.Items);  // Respond with all items in the table
    } catch (err) {
        console.error('Error fetching data:', err.message);
        res.status(500).send('Database error');
    }
});

// Route to delete a contact by ID
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    const params = {
        TableName: tableName,
        Key: {
            id,  // Use the ID as the partition key to identify the item
        },
        ConditionExpression: "attribute_exists(id)" // Ensure the item exists before attempting to delete
    };

    try {
        await db.delete(params).promise();  // Delete the item from the table
        res.json({ success: true });
    } catch (err) {
        if (err.code === 'ConditionalCheckFailedException') {
            res.status(404).send('Item not found');
        } else {
            console.error('Error deleting data:', err.message);
            res.status(500).send('Database error');
        }
    }
});

module.exports = router;
