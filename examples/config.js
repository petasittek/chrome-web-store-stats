const config = {
    email: {
        headers: {
            from: 'sender@example.com',
            to: 'recipient@example.com',
            subject: `Chrome Web Store Stats: ${(new Date()).toISOString().substr(0, 10)}`,
        },
        smtp: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            user: '',
            password: '',
        },
    },
    statsd: {
        host: 'example.com',
        port: '8125',
        prefix: 'chrome-web-store',
    },
    ids: [
        'mgijmajocgfcbeboacabfgobmjgjcoja', // Google Dictionary (by Google)
        'aapbdbdomjkkjkaonfhkkikfgjllcleb', // Google Translate
    ],
};

module.exports = config;
