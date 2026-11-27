/*
 Fully Associative
 Supports LRU and MRU
 Supports Load Through and Non-Load Through
*/
class cache {
    constructor(numCacheBlocks, sizeCacheBlocks, algorithm, readPolicy, cacheTime, memoryTime){
        if(!Number.isInteger(sizeCacheBlocks) || sizeCacheBlocks < 2 || !Number.isInteger(Math.log2(sizeCacheBlocks))){
            throw new Error("Invalid Block Size!");
        }
        if(!Number.isInteger(numCacheBlocks) || numCacheBlocks < 4 || !Number.isInteger(Math.log2(numCacheBlocks))){
            throw new Error("Invalid Number of Cache Blocks!");
        }
        if(algorithm !== "LRU" && algorithm !== "MRU"){
            throw new Error("Invalid Algorithm!");
        }
        if(readPolicy !== "load-through" && readPolicy !== "non-load-through"){
            throw new Error("Invalid Read Policy!");
        }

        this.numCacheBlocks = numCacheBlocks;
        this.sizeCacheBlocks = sizeCacheBlocks;
        this.algorithm = algorithm;
        this.readPolicy = readPolicy;
        this.cacheTime = cacheTime;
        this.memoryTime = memoryTime;
        this.memorySize = 1024;
        this.hit = 0;
        this.hitrate = 0.0;
        this.miss = 0;
        this.missrate = 0.0;
        this.clock = 0;
        this.lastUsed = [];
    
        this.cache = [];
        for(let i = 0; i < numCacheBlocks; i++){
            this.cache[i] = -1; // -1 represents an empty cache block
            this.lastUsed[i] = 0;
        }
    }
    //finds the block in cache
    findBlock(block){
        for(let i = 0; i < this.numCacheBlocks; i++) {
            if(this.cache[i] === block){
                return i;
            }
        }
        return -1;
    }

    //finds an empty block in cache
    findEmpty(){
        for(let i = 0; i < this.numCacheBlocks; i++) {
            if(this.cache[i] === -1){
                return i;
            }
        }
        return -1;
    }

    //access the memory block
    accessData(block){
        if(!Number.isInteger(block) || block < 0 || block >= this.memorySize){
            throw new Error("Invalid block!")
        }
        let index = this.findBlock(block);
        let result;
        this.clock++;
        
        if(index !== -1){
            this.hit++;
            result = "HIT!"
        }
        else{
            index = this.findEmpty();

            if(index !== -1){
                this.cache[index] = block;
            }
            else{
                if(this.algorithm === "LRU"){
                    index = this.LRU();
                }
                else if(this.algorithm === "MRU"){
                    index = this.MRU();
                }
                this.cache[index] = block;
            }
            this.miss++;
            result = "MISS!"
        }
        this.lastUsed[index] = this.clock;
        return result;
    }
    //finds the least recently used block
    LRU(){
        let smallest = 0;
        for(let i = 1; i < this.numCacheBlocks; i++){
            if(this.lastUsed[i] < this.lastUsed[smallest]){
                smallest = i;
            }
        }
        return smallest;
    }

    //finds the recently used block
    MRU(){
        let biggest = 0;
        for(let i = 1; i < this.numCacheBlocks; i++){
            if(this.lastUsed[i] > this.lastUsed[biggest]){
                biggest = i;
            }
        }
        return biggest;
    }

    computeHitMissRate(){
        let total = this.hit + this.miss;
        if(total === 0){
            this.hitrate = 0.0;
            this.missrate = 0.0;
        }
        else {
            this.hitrate = this.hit / total;
            this.missrate = this.miss / total;
        }
    }

    computeAccessTime(){
        let penalty = this.memoryTime;
        if(this.readPolicy === "non-load-through"){
            penalty += this.cacheTime;
        }
        let access = this.sizeCacheBlocks * this.hit * this.cacheTime + this.sizeCacheBlocks * this.miss * penalty + this.miss * this.cacheTime;
        return access;
    }

    computeAverageAccessTime(){
        this.computeHitMissRate();
        let penalty = this.cacheTime + this.memoryTime * this.sizeCacheBlocks;
        if(this.readPolicy === "non-load-through"){
            penalty += this.cacheTime;
        }
        let average = this.hitrate * this.cacheTime + this.missrate * penalty;
        return average;
    }

    //return statistics needed for display
    getStats(){
        this.computeHitMissRate();

        return {
            total: this.hit + this.miss,
            hit: this.hit,
            miss: this.miss,
            hitRate: this.hitrate,
            missRate: this.missrate,
            accessTime: this.computeAccessTime(),
            averageAccessTime: this.computeAverageAccessTime()
        };
    }

    
    getCacheState(){
        return [...this.cache];
    }
    getLastUsed(){
        return [...this.lastUsed];
    }

}

export { cache };