const { text } = require('body-parser');
var nodemailer = require('nodemailer');
var mail = 'prernagarg0509@gmail.com'
var company = 'Hookah'
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: mail,
    pass: '9650199842p'
  }
});
function mailpromo(to2,name,promocode) {
  var mailOptions = {
    from: mail,
    to: to2,
    subject: company,
    html:"<H1>Welcome To Hookah Club</H1><P>CONGO! "+name+" </P><h4>Now you Become a HOOKIE MEMBER<h4><p>YOUR PROMOCODE IS HERE</P><h3>PromoCode- "+promocode+"<h3><P>now Make Money by just sharing Your PromoCode to get them a Discount</P>"
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return (error);
    } else {
      return ('Email sent: ' + info.response);
    };
  });
};
// mail("rishabhgargts@gmail.com","RISHABH GARG","RISHABHGARG2020")