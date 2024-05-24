FROM node:latest

RUN mkdir /app
WORKDIR /app

# Install dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your React app runs on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
