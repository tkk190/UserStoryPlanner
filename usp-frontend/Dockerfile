FROM node:latest AS build
WORKDIR /usp-frontend
COPY ./usp-frontend .
RUN npm install
RUN npm run build


FROM httpd:alpine
WORKDIR /usr/local/apache2/htdocs
COPY --from=build ./usp-frontend/build/ /usr/local/apache2/htdocs/
COPY  ./usp-frontend/vhost.conf /usr/local/apache2/conf/vhost.conf
RUN echo 'Include conf/vhost.conf' >> /usr/local/apache2/conf/httpd.conf
