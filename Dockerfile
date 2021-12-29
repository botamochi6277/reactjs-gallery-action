FROM node:17
WORKDIR /code
COPY . /code
RUN npm install &&\
    npm cache clean --force
RUN npm run build
ENTRYPOINT [ "node","/code/action.js"]