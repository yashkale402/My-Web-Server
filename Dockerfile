# Use a Node.js base image
FROM node

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies, including AWS SDK if not already present
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variables for DynamoDB connection
ENV AWS_REGION=your-region                
ENV AWS_ACCESS_KEY_ID=your-access-key    
ENV AWS_SECRET_ACCESS_KEY=your-secret-key 

# Start the application
CMD ["node", "src/app.js"]
