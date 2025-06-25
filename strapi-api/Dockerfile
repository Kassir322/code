# Dockerfile for production mode

#
# ---------------------------------------------------------
#
FROM node:20-alpine AS base

ENV BACKEND_DIR=/home/backend

#
# ---------------------------------------------------------
#
FROM base AS builder

WORKDIR $BACKEND_DIR

COPY package.json package-lock.json* ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 5555

CMD ["npm", "run", "strapi", "start"]
