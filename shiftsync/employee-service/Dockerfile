# Use official Node.js image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the entire service source
COPY . .

# Copy frontend files into container
COPY ../frontend-service/public ./frontend-service/public

# Expose the service port
EXPOSE 3000

# Start the backend
CMD [ "node", "employee.js" ]