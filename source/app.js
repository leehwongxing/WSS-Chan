class app {

    constructor() {

        const express = require('express');

        this.context = express();
        this.port = 5000;

        this.context.set('port', (process.env.PORT || this.port));

        this.context.get('/webhook', function(req, res) {

            if (req.query['hub.mode'] === 'subscribe' &&
                req.query['hub.verify_token'] === process.env.VERIFYTOKEN) {

                res.status(200).send(req.query['hub.challenge']);
            } else {

                console.error("Failed validation. Token mismatched");
                res.sendStatus(403);
            }
        });

        this.context.post('/webhook', function (req, res) {

            var data = req.body;
            if(data.object === 'page') {

                for (let request of data.entry) {

                    var pageId = request.id;
                    var eventTime = request.time;
                    for (let event of request.messaging) {

                        console.log(event);

                        if (event.message) {
                            // sự kiện nhận biết được
                        } else {
                            // Sự kiện không nhận biết được
                        }
                    }
                }
            }
            res.sendStatus(200);
        });

        this.context.get('*', function (req, res){
            res.status(200).send({"message":"it's running but wrong way dude!"});
        });

        console.log("Environment port is %d", process.env.PORT);
    };

    sendToMesseger(message) {
        request({
            uri: this.graphApi(),
            qs:{ access_token: process.env.PAGEACCESSTOKEN },
            method: 'POST',
            json: message

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                let recipient = body.recipient_id;
                let messageId = body.message_id;

                console.log("Message %s is successfully sent to %s", messageId, recipient);
            } else {
                console.log("Unable to delivery message");
                console.log(response);
                console.log(error);
            }
        })
    };

    graphVersion() {
        return '2.10';
    };

    graphApi() {
        return ['https:','','graph.facebook.com', this.graphVersion(), 'me', 'messages'].join('/');
    };

    start() {
        this.context.listen(this.port);
    };
}

module.exports = app;