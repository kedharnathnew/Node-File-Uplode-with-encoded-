var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var mailer = require("nodemailer");

var fs = require('fs');
var app = Express();
app.use(bodyParser.json());


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        console.log(req)
        callback(null, "./Images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});


var upload = multer({
    storage: Storage
}).array("imgUploader", 3); //Field name and max count

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "kedharnath22@gmail.com",
        pass: "xxxxxxxxxxxx"
    }
   });

   const mailOptions = {
    from: 'kedharnath22@gmail.com', // sender address
    to: 'kedharnathnew@gmail.com', // list of receivers
    subject: 'Subject of your email', // Subject line
    html: '<p>Your html here</p>'// plain text body
  };

 

 

app.get("/", function(req, res) {
   
    res.sendFile(__dirname + "/index.html");
});
app.post("/api/Upload", function(req, res) {
 
    upload(req, res, function(err) {
        var fileInfo = [];
        for(var i = 0; i < req.files.length; i++) {
            fileInfo.push({
                "originalName": req.files[i].originalName,
                "size": req.files[i].size,
                "b64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
            });
            fs.unlink(req.files[i].path);
        }
        // Save Oject into DB
        res.send(fileInfo);
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
});

app.get('/api/mail',function(req,res){

/* 
    console.log(req);
    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
            return res.end(error)
        }else{
            return res.end("Message sent: " + response.message);
            //console.log("Message sent: " + response.message);
        }
    
        smtpTransport.close();
    }); */

    transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
     });
})

function base64Encode(file) {
    var body = fs.readFileSync(file);
    return body.toString('base64');
}



app.listen(2000, function(a) {
    console.log("Listening to port 2000");
});