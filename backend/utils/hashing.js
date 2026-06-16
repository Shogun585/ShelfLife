const bcrypt = require('bcrypt');

const Hashing = {
    createHashedPassword : async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        return hashedPassword;
    },
    verifyHashedPassword : (hashedPassword, plainPassword) => {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Hashing;
