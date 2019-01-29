import { LevenshteinDistance } from "../src/LevenshteinDistance";
const _ = require('lodash');

describe('LevenshteinDistance',()=>{
    const commands = ['getUser','getFirstName','getUsers','getAll','assignUserToGroup','box','unbox']; 
    it('should order commands correctly',()=>{
        var jaro = new LevenshteinDistance();
        var sorted = _.sortBy(commands,(e)=>{
            var z = jaro.apply('geU',e);
            return z; 
        });
        expect(sorted[0]).toEqual('box');
    });
});