FROM node:17
WORKDIR /code
COPY . /code
RUN npm install &&\
    npm cache clean --force
# Remove sample directory
RUN rm -rf /code/public/imgs/A &&\
    rm -rf /code/public/imgs/B
RUN npm run build
ENTRYPOINT [ "node","/code/action.js"]