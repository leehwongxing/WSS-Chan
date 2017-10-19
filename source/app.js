class app {

    constructor() {

        const express = require('express');
        const bodyParser = require('body-parser');

        this.context = express();
        this.context.use(bodyParser);

        this.port = 5000;

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

            console.log(data);
            if(data.object === 'page') {

                for (let request of data.entry) {

                    var pageId = request.id;
                    var eventTime = request.time;
                    for (let event of request.messaging) {

                        if (event.message) {
                            this.proceedEvents(event);
                        } else {
                            console.log("Message not found in event: ", event);
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

    // Xử lí tất cả các loại message ở tại đây
    proceedEvents(event) {

        console.log("Proceeding event: ", event);
        if (event.postback) {

            let payload = event.postback.payload;

            // xử lí sự kiện postback
            return;
        } else {

            if (event.message && event.message.text) {

                let message = {
                    recipient: {
                        id: event.recipient.id
                    },
                    message: {
                        text: event.message.text
                    }
                };
                this.sendToMessenger(message);
                return;
            }
        }
    };

    sendToMessenger(message) {
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
        this.context.listen((process.env.PORT || this.port), '0.0.0.0');
    };
}

module.exports = app;