let s1='ankit'
let s2='tnkia';

let obj1={};
let obj2={};

// if(s1.length==s2.length){
//     return false;
// }

for(let ch of s1){
    obj1[ch]=(obj1[ch]||0)+1;

}
for(let ch of s2){
    obj2[ch]=(obj2[ch]||0)+1;
    
}

console.log(obj1,obj2)

for(let key in obj1){
    console.log(key)
    
}