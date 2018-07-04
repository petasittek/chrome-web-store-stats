# Chrome Web Store Stats

## Run in Docker

### Preparation

Following directories/files are required.

 - Config directory
 
        mkdir -p data/config
        cp examples/config.js data/config/example.js
        
 - Metadata directory
 
        mkdir -p data/metadata
 
 - Crontab file
 
        cp examples/crontab data/crontab


### Build and run

 - Build image
 
        docker-compose -p cws-stats build

 - (Re)create container
 
        docker-compose -p cws-stats up --no-start

 - Start container
 
        docker-compose -p cws-stats start
