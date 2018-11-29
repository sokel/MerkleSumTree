require('babel-register');
require('babel-polyfill');
require('dotenv').config();

let mochaConfig = {};
if (process.env.BUILD_TYPE === 'CI') {
    mochaConfig = {
        reporter: 'mocha-junit-reporter',
        reporterOptions: {
            mochaFile: 'result.xml',
        },
    };
}

module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8535,
            network_id: '*', // eslint-disable-line camelcase
        },
        coverage: {
            host: 'localhost',
            network_id: '*', // eslint-disable-line camelcase
            port: 8555,
            gas: 0xfffffffffff,
            gasPrice: 0x01,
        },
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200,
        },
    },
    mocha: mochaConfig,
    // eslint-disable-next-line camelcase
    contracts_directory: './contracts',
};
