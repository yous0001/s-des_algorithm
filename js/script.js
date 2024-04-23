let textfield=document.getElementById("text")
let keyfield=document.getElementById("key")
let result=document.getElementById("result")


//do p10
function perm10(key){
    const P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6];
    let keyAfterP10=P10.map(num => key[num-1])
    return keyAfterP10

}

//do p8
function perm8(key){
    const P8 = [6,3,7,4,8,5,10,9];
    let keyAfterP8=P8.map(num => key[num-1])
    return keyAfterP8

}
function sl_l(left,right){
    //from index 0 remove one bit
    let temp=left.slice(0,1)
    //remove bit from left and put it in the end
    const Lsl1 = left.slice(1).concat(temp);
    temp=right.slice(0,1)
    const Rsl1 = right.slice(1).concat(temp);
    const key = Lsl1.concat(Rsl1)
    return key
}

function sl_2(left,right){
    //from index 0 remove 2 bit
    let temp=left.slice(0,2)
    //remove bit from left and put it in the end
    const Lsl2 = left.slice(2).concat(temp);
    temp=right.slice(0,2)
    const Rsl2 = right.slice(2).concat(temp);
    const key = Lsl2.concat(Rsl2)
    return key
}
function generateKeys(key){
    //p10
    key=perm10(key)
    //splice key
    let left = key.slice(0, 5);
    let right = key.slice(5);
    //console.log({left,right})
    key=sl_l(left,right)
    firstkey=perm8(key)
    left = key.slice(0, 5);
    right = key.slice(5);
    key=sl_2(left,right)
    secondkey=perm8(key)
    //console.log({firstkey,secondkey,key});
    return [firstkey,secondkey]
}







function IPerm(key){
    const IP = [2, 6, 3, 1, 4, 8, 5, 7];
    let keyAfterIP=IP.map(num => key[num-1])
    return keyAfterIP

}

function FIPerm(key){
    const IP = [4, 1, 3, 5, 7, 2, 8, 6];
    let keyAfterIP=IP.map(num => key[num-1])
    return keyAfterIP

}


function EPerm(key){
    const EP = [4, 1, 2, 3, 2, 3, 4, 1];
    let keyAfterEP=EP.map(num => key[num-1])
    return keyAfterEP

}

function Perm4(key){
    const P4 = [2, 4, 3, 1];
    let keyAfterP4=P4.map(num => key[num-1])
    return keyAfterP4

}

function xor(num1,num2){
    return num1.map((num1,index)=>(num1^num2[index]))
}
function sbox0(num){
    const S0 = [
        [1, 0, 3, 2],
        [3, 2, 1, 0],
        [0, 2, 1, 3],
        [3, 1, 3, 2]
    ];
    const row=num[0]*2+num[3]
    const column=num[1]*2+num[2]
    let x=S0[row][column]
    num=[Math.floor(x/2),x%2]
    return num
}

function sbox1(num){
    const S1 = [
        [0, 1, 2, 3],
        [2, 0, 1, 3],
        [3, 0, 1, 0],
        [2, 1, 0, 3]
    ];
    const row=num[0]*2+num[3]
    const column=num[1]*2+num[2]
    let x=S1[row][column]
    num=[Math.floor(x/2),x%2]
    return num
}
function encrypt(){
    let plaintext=textfield.value;
    let key=keyfield.value;
    plaintext=plaintext.split(',')
    key=key.split(',')
    keys=generateKeys(key)

    let IP= IPerm(plaintext)
    //first round
    let left0 = IP.slice(0, 4);
    let right = IP.slice(4);
    let EP =EPerm(right)
    let x=xor(keys[0],EP)
    let left = x.slice(0, 4);
    right = x.slice(4);
    let s0=sbox0(left)
    let s1=sbox1(right)
    text=s0.concat(s1)
    text=Perm4(text)
    x=xor(text,left0)
    left =IP.slice(4);
    right=x;
    

    //second round
    EP =EPerm(right)
    x=xor(keys[1],EP)
    left0 = x.slice(0, 4);
    right0 = x.slice(4);
    s0=sbox0(left0)
    s1=sbox1(right0)
    text=s0.concat(s1)

    text=Perm4(text)
    // console.log(text);
    x=xor(text,IP.slice(4))
    // console.log(x);
    left=x
    right=right
    text=left.concat(right)
    let encryptedText=FIPerm(text)
    result.innerHTML="Encrypted Text is: "+encryptedText
}

function decrypt(){
    let plaintext=textfield.value;
    let key=keyfield.value;
    plaintext=plaintext.split(',')
    key=key.split(',')
    keys=generateKeys(key)

    let IP= IPerm(plaintext)
    //first round
    let left0 = IP.slice(0, 4);
    let right = IP.slice(4);
    let EP =EPerm(right)
    let x=xor(keys[1],EP)
    let left = x.slice(0, 4);
    right = x.slice(4);
    let s0=sbox0(left)
    let s1=sbox1(right)
    text=s0.concat(s1)
    text=Perm4(text)
    x=xor(text,left0)
    left =IP.slice(4);
    right=x;
    

    //second round
    EP =EPerm(right)
    x=xor(keys[0],EP)
    left0 = x.slice(0, 4);
    right0 = x.slice(4);
    s0=sbox0(left0)
    s1=sbox1(right0)
    text=s0.concat(s1)

    text=Perm4(text)
    // console.log(text);
    x=xor(text,IP.slice(4))
    // console.log(x);
    left=x
    right=right
    text=left.concat(right)
    let encryptedText=FIPerm(text)
    result.innerHTML="Plain Text is: "+encryptedText
}