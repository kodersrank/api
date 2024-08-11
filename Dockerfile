# Use the official Bun image as the base image
FROM oven/bun:1.1.22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and bun.lockb files to the container
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that your app runs on
EXPOSE 3333

# Command to run the application
CMD ["bun", "start"]
