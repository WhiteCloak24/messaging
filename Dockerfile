FROM node:latest

# Set working directory
WORKDIR /projects/messaging

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


# Start the React app
CMD ["npm", "start"]

RUN node -v

# Expose port 3000 (assuming your React app runs on this port)
EXPOSE 3000