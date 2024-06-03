# Use an official Node runtime as a parent image
FROM node:20.13.1

# Set the working directory
WORKDIR /app/messaging

# Copy the backend code
COPY . .

# Install dependencies
RUN npm install

RUN npm build

# Make port 3000 available to the world outside this container
EXPOSE 4000

# Define the command to run the app
CMD ["npm", "start"]
