FROM node:20-alpine

RUN apk update && apk add --no-cache g++

WORKDIR /app

# Copy package files for dependency caching
COPY compiler/package*.json ./

RUN npm ci --omit=dev

# Copy compiler source code
COPY compiler/ .

# Copy shared folder from backend (including all subfolders)
COPY backend/shared ./shared

EXPOSE 8000
ENV NODE_ENV=production

CMD ["node", "index.js"]

# command to build the image: docker build -f compiler/Dockerfile -t oj-backend .
