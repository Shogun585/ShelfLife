const bcrypt = require('bcrypt');

const Hashing = {
    createHashedPassword : async (password) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hash(password, salt);

        return hashedPassword;
    },
    verifyHashedPassword : async(hashedPassword, plainPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Hashing;
