type Value<T> = (()=>T)|T;
export function createArray<T>(length:number,defValue:Value<T>):T[]{
    var a = []; 
    for(var i=0;i<length;i++){
        a.push(typeof defValue === "function"?(defValue as ()=>T)():defValue);
    }
    return a; 
}