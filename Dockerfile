# Step 1: Use a Node.js base image
FROM node:16

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the application code into the container
COPY . .

# Step 6: Expose the development server port
EXPOSE 3000

# Step 7: Start the React development server
CMD ["npm", "start"]