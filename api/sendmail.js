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
            message.html += `<style>   
            table {  font-family: Arial, Helvetica, sans-serif;   border-collapse: collapse;  width: 100%; } 
            table td, table th {   border: 1px solid #ddd;   padding: 8px; } 
            table tr:nth-child(even){ background-color: #e0ebeb; } 
            table th {  padding-top: 12px;  padding-bottom: 12px;   text-align: left;   background-color: #02a200;  color: white; text-transform: uppercase; }
                </style>`
            message.html = '<html> ' + message.html + ' </html>'
        }

        transport.sendMail(message, function (err, info) {
            if (err) console.log(err)
            res(info)
        });
    })
}