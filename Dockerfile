# ---- Build Stage ----
    FROM node:18-alpine AS builder

    # Set working directory
    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm install --frozen-lockfile
    
    # Copy the rest of the project files
    COPY . .
    
    # Build the Next.js app
    COPY .env .env  
    RUN npm run build --no-cache
    
    # ---- Production Stage ----
    FROM node:18-alpine
    
    # Set working directory
    WORKDIR /app
    
    # Copy only necessary files from the builder stage
    COPY --from=builder /app/package.json ./ 
    COPY --from=builder /app/.next .next
    COPY --from=builder /app/node_modules node_modules
    COPY --from=builder /app/public public
    
    # Expose the Next.js default port
    EXPOSE 3000
    
    # Start the Next.js application
    CMD ["npm", "run", "start"]