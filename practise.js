const nums = [5, 12, 8, 3, 20, 15];


const mapExm=nums.map(n=>n*2);
console.log(mapExm);

const filt=nums.filter(n=>n>10);
console.log(filt);


const red= nums.reduce((acc,c)=>acc+c,0);
console.log(red);


const findexm=nums.find(n => n<=10);
console.log(findexm);

const filterexm=nums.filter(n => n<=10);
console.log(filterexm);

const someexm=nums.some(n => n>10);
console.log(someexm);


const date= new Date();
console.log(date.getTime());
console.log(date.getHours(),":",date.getMinutes(),":",date.getSeconds());

const obj={
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds()
}

setInterval(()=>{
    const date= new Date();
    obj.hour=date.getHours();
    obj.minute=date.getMinutes();
    obj.second=date.getSeconds();
    console.log(obj.hour,":",obj.minute,":",obj.second);
}, 1000);


const obj1={
    name: "John",
    age: 30,
    city: "New York",
    compareAge: function(otherAge){
        if(this.age>otherAge){
            return "Older";
        }else if(this.age<otherAge){
            return "Younger";
        }else{
            return "Same age";
        }

}
}