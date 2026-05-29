FROM node:18-alpine

WORKDIR /app

# Install dependencies first for better cache utilization
COPY package.json package-lock.json ./
RUN npm install --production

# Copy source files
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
