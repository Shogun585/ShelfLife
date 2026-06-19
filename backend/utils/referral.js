const crypto = require('crypto');

const generateReferralCode = () =>{

    // TODO : add Redis to generate unique referral codes

    return crypto.randomUUID().slice(0, 6).toUpperCase();
}

module.exports = {
    generateReferralCode
}