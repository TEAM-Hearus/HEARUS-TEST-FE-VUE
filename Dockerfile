# Build Stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN yarn build

# Production Stage
FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Substitute Environment Variables
COPY ./substitute_environment_variables.sh .
# RUN sudo chmod +x /substitute_environment_variables.sh