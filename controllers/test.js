const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()

const nodemailer = require("nodemailer");

const { getEmailContent } = require('./welcomeEmailTemplate')


const port = 3003

app.use(express.json());
app.use(cors())



const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});



const brevo = require('@getbrevo/brevo');
const apiInstance = new brevo.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;



app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


app.post('/register', async (req, res) => {

    await transporter.sendMail({
        from: '"Daniel" <danielherrerohernando@gmail.com>',
        to: req.body.email,
        subject: "Hola desde Brevo",
        text: "Este es un correo usando SMTP",
        html: getEmailContent(req.body.name, req.body.company)
    });


    res.send({ "msg": "Email sent successfully" })
})



app.post('/send-email-brevo', (req, res) => {

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Hola desde Brevo";
    sendSmtpEmail.htmlContent = getEmailContent(req.body.name, req.body.company);
    sendSmtpEmail.sender = { "name": "Toomaj", "email": "tbandad@gmail.com" };
    sendSmtpEmail.to = [
        { "email": "tbandad@gmail.com", "name": "Toomaj" },
    ];
    sendSmtpEmail.replyTo = { "name": "Toomaj", "email": "tbandad@gmail.com" };


    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        res.send('Email sent successfully via Brevo API');
    }, function (error) {
        console.error(error);
        res.status(500).send('Error sending email');
    });

})