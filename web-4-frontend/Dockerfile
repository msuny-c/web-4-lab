FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

EXPOSE 3000

# Serve the app on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"] 