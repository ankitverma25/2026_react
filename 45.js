let a=[2,1,2,0,1,0,1,0,2,0,1,2,0,1]


let l =0
let m =0
let h =a.length-1


while(m<=h){
    if(a[m]===0){
        [a[m],a[l]]=[a[l],a[m]];
        l++
        m++
    }
    else if(a[m]==1){
        m++
    }
    else{
        [a[h],a[m]]=[a[m],a[h]];
        h--
    }
}


console.log(a)