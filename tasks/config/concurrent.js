
module.exports = function(grunt) {
    return {
        tests: ['connect:test:keepalive', 'open:tests']
    };
};