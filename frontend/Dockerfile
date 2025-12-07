
ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION}-alpine as build

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production=false

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/dist/cinema-app/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]