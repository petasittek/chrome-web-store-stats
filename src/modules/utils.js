'use strict';

const argv = require('minimist')(process.argv.slice(2));
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.dirname(require.main.filename);
const CONFIG_DIR = path.join(BASE_DIR, 'config');
const METADATA_DIR = path.join(BASE_DIR, 'metadata');

/**
 * Return metadata path.
 *
 * @return {string} Metadata path.
 */
function getMetadataFilePath() {
    const configFilePath = getConfigFilePath();

    // Keep only filename without extension
    const filename = path.basename(configFilePath, path.extname(configFilePath));
    const fileMd5 = md5(configFilePath).substr(0, 8);

    return path.join(METADATA_DIR, `${filename}-${fileMd5}.json`);
}

/**
 * Return metadata file content.
 *
 * @param  {string} filePath - Filepath of the config file, absolute or relative.
 *
 * @return {Object} Metadata file contents.
 */
function loadMetadata(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        return {};
    }
}

/**
 * Return config file content.
 *
 * @return {Object} Config file contents.
 */
function loadConfig() {
    return require(path.resolve(CONFIG_DIR, argv.c));
}

/**
 * Return config file path.
 *
 * @return {string} Config file path.
 */
function getConfigFilePath() {
    return argv.c;
}

/**
 * Calculate the MD5 hash of a string.
 *
 * @param  {string} string - String (or buffer) to be hashed.
 *
 * @return {string} MD5 hash.
 */
function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

/**
 * Check required parameters and exit if not satisfied
 */
function checkParameters() {
    // Check if required config file was passed in
    const configFilename = getConfigFilePath();

    if (!configFilename || argv.h || argv.help) {
        console.error('Usage: node index.json -c ./path/to/config.js [--email] [--statsd]');
        return false;
    }

    // Check if anything meaningful is about to happen
    if (!argv.email && !argv.statsd) {
        console.log('No action specified, add --email or --statsd');
        return false;
    }

    return true;
}

module.exports = {
    getMetadataFilePath,
    loadMetadata,
    md5,
    checkParameters,
    loadConfig,
    getConfigFilePath,
};
