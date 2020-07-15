const buffer = require("safe-buffer").Buffer;
const keygrip = require("keygrip");
const keys = require("../../config/keys");

module.exports = user => { // user is a mongo model
    const sessionObj = {
        passport: {
            user: user._id.toString()
        }
    }
    const sessionString = buffer.from(JSON.stringify(sessionObj)).toString('base64');
    const Keygrip = new keygrip([keys.cookieKey]);
    const sessionSig = Keygrip.sign('session =' + sessionString); //session = is due to keygrip library works so
    return {sessionString, sessionSig};
}
