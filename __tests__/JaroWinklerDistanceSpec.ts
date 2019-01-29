import { JaroWinklerDistance } from "../src/JaroWinklerDistance";
const _ = require('lodash'); 

describe('JaroWinklerDistanceSpec',()=>{
    const commands = ['getUser','getFirstName','getUsers','getAll','assignUserToGroup','box','unbox']; 
    it('should order commands correctly',()=>{
        var jaro = new JaroWinklerDistance();
        var sorted = _.sortBy(commands,(e)=>{
            return -jaro.apply('geU',e);
        });
        expect(sorted[0]).toEqual('getUser');
    }); 
});