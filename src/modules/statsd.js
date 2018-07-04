const statsdClient = require('statsd-client');
const slugify = require('slug');

/**
 * Send given stat to StatsD
 *
 * @param {StatsDClient} sdc
 * @param {string}       name
 * @param {string}       metric
 * @param {number}       value
 */
const push = (sdc, name, metric, value) => {
    const key = [name, metric].join('.');
    sdc.gauge(key, value);
};

/**
 * Send all stats to StatsD
 *
 * @param {Object} config
 * @param {Object} data
 */
const send = (config, data) => {
    const sdc = new statsdClient(config);

    Object.keys(data).forEach(id => {
        const extension = data[id];

        if (! extension.errorOccured) {
            const name = slugify(extension.name.toLowerCase());

            push(sdc, name, 'install-count', extension.installCount);
            push(sdc, name, 'rating-count', extension.ratingCount);
            push(sdc, name, 'rating-value', extension.ratingValue);
            push(sdc, name, 'review-count', extension.reviewCount);
            push(sdc, name, 'support-count', extension.supportCount);
        }
    });
};

module.exports = {
    send,
};
