# Use an official Node runtime as a parent image
FROM node:20.13.1

# Set the working directory
WORKDIR /app/messaging

# Copy the frontend code
COPY . .

# Install dependencies
RUN npm install

# Build the app
RUN npm build

# # Use Nginx to serve the static files
# FROM nginx:alpine

# # Copy the build output to Nginx
# COPY --from=build /app/messaging/build /usr/share/nginx/html

# Expose port 8000
EXPOSE 8000

# Start Nginx
CMD ["npm", "start"]
