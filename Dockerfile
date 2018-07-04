FROM node:9-alpine

WORKDIR /app

COPY src .

RUN yarn install

# Just wait
CMD ["tail", "-f", "/dev/null"]
