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
    const sdc = new statsdClient(config.statsd);

    Object.keys(data).forEach(id => {
        const extension = data[id];
        const slug = slugify(config.extensions[id]).toLowerCase();

        push(sdc, slug, 'install-count', extension.installCount);
        push(sdc, slug, 'rating-count', extension.ratingCount);
        push(sdc, slug, 'rating-value', extension.ratingValue);
        push(sdc, slug, 'review-count', extension.reviewCount);
        push(sdc, slug, 'support-count', extension.supportCount);
    });
};

module.exports = {
    send,
};
