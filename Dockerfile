FROM node:9-alpine

WORKDIR /app

COPY src .

RUN yarn install

# Apply crontab, run crond and wait
CMD crontab /app/crontab && crond -l 0 -L /var/log/cron && tail -f /dev/null
