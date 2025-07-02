// utils/passwordGenerator.ts
export const generatePassword = (length = 8): string => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
    let password = "";

    // Ensure at least one character from each required set
    password += charset.charAt(Math.floor(Math.random() * 26)); // uppercase
    password += charset.charAt(26 + Math.floor(Math.random() * 26)); // lowercase
    password += charset.charAt(52 + Math.floor(Math.random() * 10)); // number
    password += charset.charAt(62 + Math.floor(Math.random() * 15)); // special char

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password to mix the required characters
    return password.split('').sort(() => 0.5 - Math.random()).join('');
};