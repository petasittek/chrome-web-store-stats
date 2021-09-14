const rp = require('request-promise-native');

const URL_HOMEPAGE_PREFIX = 'https://chrome.google.com/webstore/detail/';
const URL_USER_GENERATED_DATA = 'https://chrome.google.com/reviews/components';

const REGEX_NAME = '<meta itemprop="name" content="([^"]*)"/>';
const REGEX_INSTALL_COUNT = '<Attribute name="user_count">([0-9]*)</Attribute>';
const REGEX_RATING_COUNT = new RegExp('">\\(([0-9]*)\\)</span>');
const REGEX_RATING_VALUE = new RegExp(': ([0-9.]*) \\(');
const REGEX_REVIEW_COUNT = '"numAnnotations":([0-9]*),';
const REGEX_SUPPORT_COUNT = '"numAnnotations":([0-9]*),';

const ERROR_LOADING_BASE = 0;
const ERROR_LOADING_REVIEW = 1;
const ERROR_LOADING_SUPPORT = 2;

// Mobile user agent to avoid consent screen
const USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/92.0.4515.159 Mobile/15E148 Safari/604.1';

/**
 * Get install count, rating count and rating value and their diffs
 *
 * @param {string} extensionId
 * @param {Object} metadataCurrent
 * @param {Object} metadataSaved
 *
 * @returns {Promise.<TResult>}
 */
const getDataBase = (extensionId, metadataCurrent, metadataSaved) => {
    const url = `${URL_HOMEPAGE_PREFIX}${extensionId}`;
    const options = {
        method: 'GET',
        uri: url,
        headers: {
            'User-Agent': USER_AGENT,
        },
    };

    // Constant values
    metadataCurrent.url = url;
    metadataCurrent.urlReviews = `${url}/reviews`;
    metadataCurrent.urlSupport = `${url}/support`;

    return rp(options)
        .then((data) => {
            const name = data.match(REGEX_NAME)[1] || 'No name';
            const installCount = parseInt(data.match(REGEX_INSTALL_COUNT)[1]) || 0;
            const ratingCount = parseInt(data.match(REGEX_RATING_COUNT)[1]) || 0;
            const ratingValue = parseFloat(data.match(REGEX_RATING_VALUE)[1]) || 0;

            metadataCurrent.name = name;

            metadataCurrent.installCount = installCount;
            metadataCurrent.installCountDiff = installCount - (metadataSaved.installCount || 0);

            metadataCurrent.ratingCount = ratingCount;
            metadataCurrent.ratingCountDiff = ratingCount - (metadataSaved.ratingCount || 0);

            metadataCurrent.ratingValue = ratingValue;
            metadataCurrent.ratingValueDiff = ratingValue - (metadataSaved.ratingValue || 0);
        })
        .catch(() => {
            metadataCurrent.name = extensionId;

            metadataCurrent.installCount = 0;
            metadataCurrent.installCountDiff = 0;

            metadataCurrent.ratingCount = 0;
            metadataCurrent.ratingCountDiff = 0;

            metadataCurrent.ratingValue = 0;
            metadataCurrent.ratingValueDiff = 0;

            metadataCurrent.errorOccured = true;
            metadataCurrent.errorType = ERROR_LOADING_BASE;
        })
};

/**
 * Get review count and its diff
 *
 * @param {string} extensionId
 * @param {Object} metadataCurrent
 * @param {Object} metadataSaved
 *
 * @returns {Promise.<TResult>}
 */
const getDataReview = (extensionId, metadataCurrent, metadataSaved) => {
    const jsonBody = {
        appId: 94,
        specs: [{
            groups: 'chrome_webstore',
            url: `http://chrome.google.com/extensions/permalink?id=${extensionId}`,
            type: 'CommentThread',
          	sortby: 'cws_qscore',
            numresults: '1',
            id: '1'
        }]
    };

    const options = {
        method: 'POST',
        uri: `${URL_USER_GENERATED_DATA}`,
        body: `req=${JSON.stringify(jsonBody)}`,
        headers: {
            'User-Agent': USER_AGENT,
        },
    };

    return rp(options)
        .then((data) => {
            const reviewCount = parseInt(data.match(REGEX_REVIEW_COUNT)[1]) || 0;

            metadataCurrent.reviewCount = reviewCount;
            metadataCurrent.reviewCountDiff = reviewCount - (metadataSaved.reviewCount || 0);
        })
        .catch(() => {
            metadataCurrent.reviewCount = 0;
            metadataCurrent.reviewCountDiff = 0;

            metadataCurrent.errorOccured = true;
            metadataCurrent.errorType = ERROR_LOADING_REVIEW;
        });
};

/**
 * Get support issue count and its diff
 *
 * @param {string} extensionId
 * @param {Object} metadataCurrent
 * @param {Object} metadataSaved
 *
 * @returns {Promise.<TResult>}
 */
const getDataSupport = (extensionId, metadataCurrent, metadataSaved) => {
    const jsonBody = {
        appId: 94,
        specs: [{
            groups: 'chrome_webstore_support',
            url: `http://chrome.google.com/extensions/permalink?id=${extensionId}`,
            type: 'CommentThread',
            numresults: '1',
            id: '1'
        }]
    };

    const options = {
        method: 'POST',
        uri: `${URL_USER_GENERATED_DATA}`,
        body: `req=${JSON.stringify(jsonBody)}`,
        headers: {
            'User-Agent': USER_AGENT,
        },
    };

    return rp(options)
        .then((data) => {
            const supportCount = parseInt(data.match(REGEX_SUPPORT_COUNT)[1]) || 0;

            metadataCurrent.supportCount = supportCount;
            metadataCurrent.supportCountDiff = supportCount - (metadataSaved.supportCount || 0);
        })
        .catch(() => {
            metadataCurrent.supportCount = 0;
            metadataCurrent.supportCountDiff = 0;

            metadataCurrent.errorOccured = true;
            metadataCurrent.errorType = ERROR_LOADING_SUPPORT;
        });
};

module.exports = {
    getDataBase,
    getDataReview,
    getDataSupport,
};
