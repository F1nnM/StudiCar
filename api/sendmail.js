const nodemailer = require('nodemailer'),
    mailCreds = require('./mailAuth')


var transport = nodemailer.createTransport({
    host: 'bernd.one',
    port: 25,
    auth: {
        user: mailCreds.USER,
        pass: mailCreds.PASS
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});

module.exports = async (text, recipients, subject, isHTML) => {
    return new Promise((res, rej) => {

        if (!text) rej('No message given')

        const message = {
            from: 'noreply@studicar.de', // Sender address
            to: recipients || 'studicar-dev@bernd.one', // when null, make default
            subject: subject || 'StudiCar Information',
            text: text
        };
        if (isHTML == true || text.startsWith('<br')) { // when text starts with '<br', HTML will automatically be enabled
            message.html = message.text
            delete message.text // just to keep object clean
            message.html += `<style>table{ border-collapse: collapse; } .pr{padding-right: 4px; } td{white-space: pre-line;} tr{border-bottom: 1px solid black; }</style>`
        }

        transport.sendMail(message, function (err, info) {
            if (err) console.log(err)
            res(info)
        });
    })
}