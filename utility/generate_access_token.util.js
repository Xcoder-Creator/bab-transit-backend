const jwt = require('jsonwebtoken'); // Import jsonwebtoken module

// Generate new access token
let generate_access_token = (user_id, status, exp_time) => {
    if (exp_time !== null){
        if (status === 'verification_code'){
            return jwt.sign({ user_id: user_id, status: status }, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS512', expiresIn: exp_time });
        } else if (status === 'user_account'){
            return jwt.sign({ user_id: user_id, status: status }, process.env.AUTH_TOKEN_SECRET, { algorithm: 'HS512', expiresIn: exp_time });
        }
    } else {
        if (status === 'verification_code'){
            return jwt.sign({ user_id: user_id, status: status }, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS512' });
        } else if (status === 'user_account'){
            return jwt.sign({ user_id: user_id, status: status }, process.env.AUTH_TOKEN_SECRET, { algorithm: 'HS512' });
        }
    }
}
//------------------------------

module.exports = generate_access_token;