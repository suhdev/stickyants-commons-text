import { fuzzyScore } from "../src/FuzzyScore";
const _ = require('lodash');

describe('Fuzzy score',()=>{
    const commands = ['getUser','getFirstName','getUsers','getAll','assignUserToGroup','box','unbox']; 
    it('should order commands correctly',()=>{
        var sorted = _.sortBy(commands,(e)=>{
            return -fuzzyScore('geU',e);
        });
        expect(sorted[0]).toEqual('getUser');
    }); 
});