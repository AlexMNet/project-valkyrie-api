"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obscureEmail = void 0;
const obscureEmail = (userEmail) => {
    const email = userEmail.split('@')[0];
    const provider = userEmail.split('@')[1];
    let result = '';
    for (let i = 0; i < email.length; i++) {
        if (i === 0 || i === email.length - 1) {
            result += email[i];
        }
        else {
            result += '*';
        }
    }
    return result + '@' + provider;
};
exports.obscureEmail = obscureEmail;
