import { JaccardDistance } from "../src/JaccardDistance";
const _ = require('lodash');

describe('JaccardDistance',()=>{
    const commands = ['getUser','getFirstName','getUsers','getAll','assignUserToGroup','box','unbox']; 
    it('should order commands correctly',()=>{
        var jaro = new JaccardDistance();
        var sorted = _.sortBy(commands,(e)=>{
            return jaro.apply('geU',e);
        });
        expect(sorted[0]).toEqual('getUser');
    }); 
});