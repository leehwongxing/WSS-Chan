class post{

    constructor() {
        this.find = "";
        this.at = "";
        this.page = 0;
        this.sort = "";
    };

    parseMessage(message) {

        let parsed = message.split(',');

        // tách chuỗi
        if (parsed.length > 4) {
            console.log("Informal query: %s", message);
        }

        // dọn dẹp string và lựa dữ liệu
        for (let i = parsed.length; i--; i>=0) {
            parsed[i] = parsed[i].trim().replace(/\s+/g, ' ');
            this.importValue(parsed[i]);
        }

        return this;
    };

    importValue(part) {
        if (part.search(/^Tìm/ig) != -1 && part.length > 3) {
            this.find = part.substring(3, part.length).trim();
            return;
        }

        if (part.search(/^Tại/ig) != -1 && part.length > 3) {
            this.at = part.substring(3, part.length).trim();
            return;
        }

        if (part.search(/^Theo/ig) != -1 && part.length > 4) {
            this.sort = part.substring(4, part.length).trim();
            return;
        }

        if (part.search(/^Trang/ig) != -1 && part.length > 5) {
            this.page = part.substring(5, part.length).trim()*1;
            if (isNaN(this.page)) {
                this.page = 0;
            }
            return;
        }
    };

    execute(){
        const request = require('request');



        let req = new request({
            url: '',


        });
        console.log(request.jar());



    };
}

module.exports = post;