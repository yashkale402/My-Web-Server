// src/database.js
const AWS = require('aws-sdk');

// Check if AWS credentials are provided via environment variables
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    // Configure AWS with credentials from environment variables (local environment)
    AWS.config.update({
        region: process.env.AWS_REGION || 'your_region',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
} else {
    // Fallback to default AWS SDK configuration (IAM Role on EC2)
    AWS.config.update({
        region: process.env.AWS_REGION || 'your_region'
        // No need to specify accessKeyId or secretAccessKey
    });
}

// Initialize DynamoDB clients
const dynamoDb = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

// Define table name
const tableName = process.env.DB_NAME || 'Contacts';

async function setupDatabase() {
    try {
        // Define the table schema
        const createTableParams = {
            TableName: tableName,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' },  // Primary key
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'N' },  // 'N' for Number type
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        };

        // Check if the table already exists
        const tables = await dynamoDb.listTables().promise();
        if (!tables.TableNames.includes(tableName)) {
            // Create the table if it doesn't exist
            await dynamoDb.createTable(createTableParams).promise();
            console.log(`Table "${tableName}" is created and ready.`);
        } else {
            console.log(`Table "${tableName}" already exists.`);
        }
    } catch (err) {
        console.error('Error during database setup:', err.message);
    }
}

async function addContact(id, username) {
    try {
        const params = {
            TableName: tableName,
            Item: {
                id,
                username,
            },
        };
        await documentClient.put(params).promise();
        console.log(`Contact "${username}" added successfully.`);
    } catch (err) {
        console.error('Error adding contact:', err.message);
    }
}

// Call the setup function
setupDatabase();

module.exports = documentClient;
