# ---- Build Stage ----
	FROM node:22-alpine 

	# Set working directory
	WORKDIR /app
	
	# Install dependencies
	COPY package*.json ./
	RUN npm ci --frozen-lockfile
	
	# Copy the rest of the project files
	COPY . .
	
	# Build the Next.js app
	
	# RUN npm run build 
	
	# ---- Production Stage ----
	# FROM node:22-alpine
	
	# # Set working directory
	# WORKDIR /app
	
	# # Copy only necessary files from the builder stage
	# COPY --from=builder /app/package.json ./ 
	# COPY --from=builder /app/.next .next
	# COPY --from=builder /app/node_modules node_modules
	# COPY --from=builder /app/public public
	
	# Expose the Next.js default port
	EXPOSE 3000
	
	# Start the Next.js application
	CMD ["npm", "run", "start"]