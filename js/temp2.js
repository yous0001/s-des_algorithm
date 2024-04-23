
// SDES Key generation
function generateKeys(key) {
    // 10-bit key permutation
    const keyPermutation = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
    let permutedKey = '';
    
    // Apply permutation
    for (let i = 0; i < keyPermutation.length; i++) {
        permutedKey += key[keyPermutation[i] - 1];
    }

    // Split the 10-bit key into two 5-bit halves
    const leftHalf = permutedKey.slice(0, 5);
    const rightHalf = permutedKey.slice(5);

    // Generate round keys
    const roundKeys = [];
    for (let i = 1; i <= 2; i++) {
        // Circular left shift
        const shiftedLeftHalf = leftHalf.substring(i) + leftHalf.substring(0, i);
        const shiftedRightHalf = rightHalf.substring(i) + rightHalf.substring(0, i);

        // Merge the halves
        const mergedKey = shiftedLeftHalf + shiftedRightHalf;

        // Permute the merged key to get the round key
        const roundKeyPermutation = [6, 3, 7, 4, 8, 5, 10, 9];
        let roundKey = '';
        for (let j = 0; j < roundKeyPermutation.length; j++) {
            roundKey += mergedKey[roundKeyPermutation[j] - 1];
        }

        // Add the round key to the list
        roundKeys.push(roundKey);
    }

    return roundKeys;
}

// SDES Encryption
function sdesEncrypt(plaintext, key) {
    // Initial permutation
    const initialPermutation = [2, 6, 3, 1, 4, 8, 5, 7];
    let permutedPlaintext = '';
    
    // Apply initial permutation
    for (let i = 0; i < initialPermutation.length; i++) {
        permutedPlaintext += plaintext[initialPermutation[i] - 1];
    }

    // Generate round keys
    const roundKeys = generateKeys(key);

    // Initial round
    let leftHalf = permutedPlaintext.slice(0, 4);
    let rightHalf = permutedPlaintext.slice(4);

    // First round
    let temp = rightHalf;
    rightHalf = xor(leftHalf, applyRoundFunction(rightHalf, roundKeys[0]));
    leftHalf = temp;

    // Swap
    const tempHalf = leftHalf;
    leftHalf = rightHalf;
    rightHalf = tempHalf;

    // Second round
    rightHalf = xor(leftHalf, applyRoundFunction(rightHalf, roundKeys[1]));

    // Final permutation
    const finalPermutation = [4, 1, 3, 5, 7, 2, 8, 6];
    let ciphertext = '';
    const mergedHalves = rightHalf + leftHalf;
    for (let i = 0; i < finalPermutation.length; i++) {
        ciphertext += mergedHalves[finalPermutation[i] - 1];
    }

    return ciphertext;
}

// SDES Decryption
function sdesDecrypt(ciphertext, key) {
    // Reverse the key generation process to obtain round keys
    const roundKeys = generateKeys(key).reverse();

    // Perform encryption using the reversed keys
    return sdesEncrypt(ciphertext, roundKeys);
}

// Utility function for XOR operation
function xor(a, b) {
    let result = '';
    for (let i = 0; i < a.length; i++) {
        result += a[i] === b[i] ? '0' : '1';
    }
    return result;
}

// Apply round function (Expansion-Permutation and XOR with Key)
function applyRoundFunction(rightHalf, roundKey) {
    const expansionPermutation = [4, 1, 2, 3, 2, 3, 4, 1];
    let expandedRightHalf = '';
    for (let i = 0; i < expansionPermutation.length; i++) {
        expandedRightHalf += rightHalf[expansionPermutation[i] - 1];
    }
    return xor(expandedRightHalf, roundKey);
}

// Example usage
const plaintext = '10101010'; // 8-bit plaintext
const key = '1010000010'; // 10-bit key
console.log("Plaintext:", plaintext);
console.log("Key:", key);

const ciphertext = sdesEncrypt(plaintext, key);
console.log("Encrypted:", ciphertext);

const decryptedPlaintext = sdesDecrypt(ciphertext, key);
console.log("Decrypted:", decryptedPlaintext);