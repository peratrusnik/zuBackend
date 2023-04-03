const express = require("express")
const NewsletterModel = require("../models/newsletter.model")
const sendMail = require("../services/mail.service")
const newsLetterRoute = express.Router()


newsLetterRoute.post("/addToList", async(req, res) => {
    const reqBody = req.body
    
    NewsletterModel.findOne(reqBody, async(error, result) => {
        if (error) {
            const errMsg = "Error on subscribe newsletter, " + error
            res.send(errMsg)
            return
        }
        if (result) {
            res.send(`You are already register ${result.email } for newsletter! `)
        } else {

            let newmail = new NewsletterModel(reqBody)
            let mailSaved = await newmail.save()
                
            if (mailSaved) {
                sendMail(
                reqBody.email,
                'Zurea Newsletter',
                `
                <p>You are successfully subscribed for newletter!</p>
                <h2>Thanks for subscribe!</h2>
                <p>If you like to remove your mail from subscribe list click on next link:</p>
                <a href="${req.protocol}/${req.hostname}/unsubscribe/${mailSaved._id.toString()}">Remove from subscribe list</a>
                `
            )
                .then(() => res.send('Successfully subscribe to newsletter'))
                .catch(error => res.status(415).send(error))
            }
        }
    })
})

newsLetterRoute.post('/unsubscribe', (req, res) => {
    const idOfMail = req.body.mailId
    // console.log(idOfMail);
    
    NewsletterModel.deleteOne({ _id: idOfMail }, (error) => {
        if (error) {
            res.send({ isRemove: false, msg: error })
            return
        }
        res.send({ isRemove: true, msg: "You are now remove from subscribe list" })
    })
})

// newsLetterRoute.post("/", async (req, res) => {
//     const email = req.body;
//     try {

//         // Create a new subscriber in MongoDB
//         const subscriber = new NewsletterModel({ email });
//         await subscriber.save();

//         res.status(200).json({ message: "Subscription saved successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// });



module.exports = newsLetterRoute