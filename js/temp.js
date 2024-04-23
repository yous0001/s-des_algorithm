let textfield=document.getElementById("text")
let keyfield=document.getElementById("key")
let result=document.getElementById("result")


const IP = [2, 6, 3, 1, 4, 8, 5, 7];

// Final permutation
const FP = [4, 1, 3, 5, 7, 2, 8, 6];

// Expansion permutation
const EP = [4, 1, 2, 3, 2, 3, 4, 1];

// P4 permutation
const P4 = [2, 4, 3, 1];

// P10 permutation
const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];

// Key left shift
const LS1 = [2, 3, 4, 5, 1];

// S-Boxes
const S0 = [
  [1, 0, 3, 2],
  [3, 2, 1, 0],
  [0, 2, 1, 3],
  [3, 1, 3, 2]
];

const S1 = [
  [0, 1, 2, 3],
  [2, 0, 1, 3],
  [3, 0, 1, 0],
  [2, 1, 0, 3]
];


function permute(inputBlock, permutationTable) {
  return permutationTable.map(index => inputBlock[index - 1]);
}

function splitIntoHalf(block) {
  const mid = block.length / 2;
  return [block.slice(0, mid), block.slice(mid)];
}

function expand(inputHalf) {
  return permute(inputHalf, EP);
}

function xor(bin1, bin2) {
  return bin1.map((bit, index) => bit ^ bin2[index]);
}

function substitute(inputHalf, sBox) {
  const row = parseInt(inputHalf[0].toString() + inputHalf[3].toString(), 2);
  const col = parseInt(inputHalf.slice(1, 3).join(''), 2);
  const value = sBox[row][col];
  return value.toString(2).padStart(2, '0').split('').map(Number);
}

function f(inputHalf, subkey) {
  const expandedHalf = expand(inputHalf);
  const xoredHalf = xor(expandedHalf, subkey);
  const substitutedHalf0 = substitute(xoredHalf.slice(0, 4), S0);
  const substitutedHalf1 = substitute(xoredHalf.slice(4), S1);
  return permute(substitutedHalf0.concat(substitutedHalf1), P4);
}

function generateSubkeys(key) {
  const keyPermuted = permute(key, P10);
  const [leftHalf, rightHalf] = splitIntoHalf(keyPermuted);
  const leftShifted1 = leftHalf.slice(1).concat(leftHalf[0]);
  const leftShifted2 = leftShifted1.slice(2).concat(leftShifted1.slice(0, 2));
  const subkey1 = permute(leftShifted1.concat(rightHalf), LS1);
  const subkey2 = permute(leftShifted2.concat(rightHalf), LS1);
  return [subkey1, subkey2];
}

function encrypt() {
let plaintext=textfield.value;
let key=keyfield.value;
plaintext=plaintext.split(',')
key=key.split(',')
console.log({plaintext,key});
  const [subkey1, subkey2] = generateSubkeys(key);

  let permutedPlaintext = permute(plaintext, IP);

  let [leftHalf, rightHalf] = splitIntoHalf(permutedPlaintext);

  let fOutput = f(rightHalf, subkey1);
  let newRightHalf = xor(leftHalf, fOutput);

  fOutput = f(newRightHalf, subkey2);
  let newLeftHalf = xor(rightHalf, fOutput);

  const ciphertext = permute(newLeftHalf.concat(newRightHalf), FP);
  result.innerHTML="Encrypted Text is: "+ciphertext
}

function decrypt() {
    let ciphertext=textfield.value;
    let key=parseInt(keyfield.value);
    ciphertext=ciphertext.split(',')
    key=key.split(',')
  const [subkey1, subkey2] = generateSubkeys(key);

  let permutedCiphertext = permute(ciphertext, IP);

  let [leftHalf, rightHalf] = splitIntoHalf(permutedCiphertext);

  let fOutput = f(rightHalf, subkey2);
  let newRightHalf = xor(leftHalf, fOutput);

  fOutput = f(newRightHalf, subkey1);
  let newLeftHalf = xor(rightHalf, fOutput);

  const plaintext = permute(newLeftHalf.concat(newRightHalf), FP);
  result.innerHTML="plain Text is: "+plaintext
}

// Example usage
const plaintext = [1, 0, 1, 0, 0, 0, 1, 1]; // 8-bit plaintext
const key = [0, 0, 0, 1, 0, 0, 0, 1, 1, 0]; // 10-bit key


