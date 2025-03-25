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
    RUN npm run build --no-cache
    
    # Export the Next.js app as static files
    RUN npm run export
    
    # ---- Production Stage ----
    FROM nginx:alpine
    
    # Set working directory
    WORKDIR /app
    
    # Copy only the static export files from the builder stage
    COPY --from=builder /app/out /usr/share/nginx/html
    
    # Expose the default HTTP port
    EXPOSE 80
    
    # Start Nginx to serve the static files
    CMD ["nginx", "-g", "daemon off;"]
    