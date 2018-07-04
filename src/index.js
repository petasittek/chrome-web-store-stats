const fs = require('fs');

const argv = require('minimist')(process.argv.slice(2));

const utils = require('./modules/utils');
const fetcher = require('./modules/fetcher');
const htmlBuilder = require('./modules/html-builder');
const email = require('./modules/email');
const statsd = require('./modules/statsd');

// Check required params
if (!utils.checkParameters()) {
    return;
}

// Load config
const config = utils.loadConfig();

// Load metadata saved in previous run
const metadataFilePath = utils.getMetadataFilePath();
let metadataSaved = utils.loadMetadata(metadataFilePath);

let metadataCurrent = {};
let promises = [];

// Build new metadata file
for (const extensionId of config.ids) {
    metadataCurrent[extensionId] = metadataCurrent[extensionId] || {};
    metadataSaved[extensionId] = metadataSaved[extensionId] || {};

    promises.push(fetcher.getDataBase(extensionId, metadataCurrent[extensionId], metadataSaved[extensionId]));
    promises.push(fetcher.getDataReview(extensionId, metadataCurrent[extensionId], metadataSaved[extensionId]));
    promises.push(fetcher.getDataSupport(extensionId, metadataCurrent[extensionId], metadataSaved[extensionId]));
}

// When all data available
Promise.all(promises)
    .then(() => {
        // Send email
        if (argv.email) {
            fs.writeFileSync(metadataFilePath, JSON.stringify(metadataCurrent, null, 2));

            const html = htmlBuilder.build(config.ids, metadataCurrent);
            const data = {...config.email.headers, ...{ text: html, html: html }};

            email.send(config.email.smtp, data);
        }

        // Sent to statsd
        if (argv.statsd) {
            statsd.send(config.statsd, metadataCurrent);
        }
    });
