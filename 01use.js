const outer=()=>{
    let counter=0;

    const inner=()=>{
        counter++;
        console.log(counter)
    }
    return inner
}




// var a=10;
// let b=20;

// console.log(a)
// console.log(b)


const balance1=outer();
balance1();
balance1();
balance1();
balance1();

const balance2=outer();
balance2();
balance2();
balance2();



// let input = "hello";

// function reverseString(x){

//     let news= x.split('')
//     console.log(news.length)
//     let i = 0
//     let j =news.length - 1
//     while(i<=j){
//         let temp;
//         temp=news[i];
//         news[i]=news[j]
//         news[j]=temp;

//         i++;
//         j--

//     }
//     console.log(news)
//     console.log(news.join(''))

// }

// reverseString(input)



// const checkPalindrome=(x)=>{
//     let i=0;
//     let j=x.length - 1;
//     while(i<=j){
//         if(x[i]!=x[j]){
//             return false
//         }
//     }
//     return true


// }



// const count=(x)=>{
//     let obj={}

//     for(let c of x){
//         obj[c]=(obj[c]||0)+1;
//     }

//     console.log(obj)
// }

// let string='hello';
// count(string)

// const largest=(x)=>{
//     let s=0;
//     let l=0;
//     for(let i in x){
//         if(l<i){
//             s=l;
//             l=i
//         }
//     }
// }


// const rep=(x)=>{
//     let obj={};
//     let a=[]
//     for(let ch of x){
//         obj[ch]=(obj[ch]||0)+1
//         }

//     for(let key of Object.keys(obj)){
//         if(obj[key]>=1){
//             a.push(key)
//         }
//     }


//         console.log(a)
//     }


// const obj={
//     name:'hello',
//     age:20,
//     city:'delhi'
// }


// const {name,age,city}=obj

// console.log(age,city)