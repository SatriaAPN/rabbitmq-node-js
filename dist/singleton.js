class Singleton{
    constructor(){
        if(typeof Singleton.INSTANCE == 'object'){
            return Singleton.INSTANCE;
        }

        this.logs = [];
        Singleton.INSTANCE = this;
    }

    addLog(log){
        this.logs.push(log);
    }

    async searchLog(logId){
        return await this.logs.find(object => object.id === logId);
    }


}

module.exports = Singleton;