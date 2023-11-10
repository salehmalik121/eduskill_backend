const jwt = require("jsonwebtoken");
const userModel = require("../../Schema/Users");
const nodemailer = require("nodemailer");

class User {
  constructor(userToken) {
    this._key =
      "a4e27f15bb12d99897a30b35ead719a81ad6a37ade8b0f0251453b2ebc03a600";
    this.userToken = userToken;
    if (userToken != undefined) this._decodeJwt();
  }

  _otpCode() {
    const code = Math.floor(Math.random() * 10000);
    const formattedCode = code.toString().padStart(4, "0");
    this._otp = formattedCode;
  }

  _sendMail() {
    const transporter = nodemailer.createTransport({
      host: "server303.web-hosting.com", // Namecheap SMTP server for your domain
      port: 587, // Port number (usually 465 for secure SSL/TLS)
      secure: false,
      auth: {
        user: "no-reply@eduskill.ai",
        pass: "noreplyeduskill",
      },
    });

    const mailOptions = {
      from: "no-reply@eduskill.ai",
      to: this.Email,
      subject: "OTP",
      text: "Your OTP is : " + this._otp + "\nThis code will expire in 1 hour",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  }

  _decodeJwt() {
    const payload = jwt.verify(this.userToken, this._key);
    this.UserData = payload;
  }

  async saveUser(password) {
    const DataToBeSaved = { ...this.UserData, Password: password };
    await userModel.create(DataToBeSaved);
  }

  async forgotPassword(email) {
    this.Email = email;
    console.log(this.Email)
    const found = await userModel.findOne({"Email" : {$regex: new RegExp('^' + this.Email + '$' , 'i')}});
    if (found != null) {
      this._otpCode();
      this._sendMail();
      const jwtToken = jwt.sign(
        { Email: this.Email, Code: this._otp },
        this._key,
        { expiresIn: "1h" }
      );
      return { jwtToken: jwtToken, Status: "Succ" };
    } else {
      return { type: "err", message : "No User With This Email" };
    }
  }

  verifyOTP(token, OTP , email) {
    try {
      const payload = jwt.verify(token, this._key);
      if (payload.Code === OTP) {
        const jwtToken = jwt.sign(
          {
            Email: email,
          },
          this._key
        );

        return {
          type: "Suc",
          message: "Valid OTP",
          token: jwtToken,
        };
      } else {
        return {
          type: "err",
          message: "Invalid OTP",
        };
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          type: "Err",
          message: "JWT has expired",
        };
      } else {
        console.error(error);
        return {
          type: "Err",
          message: "An unexpected error occurred",
        };
      }
    }
  }



  async updatePassword(password){
    console.log(password);

    await userModel.findOneAndUpdate({"Email" : this.UserData.Email} , {"Password" : password}).then(res=>{
      console.log(res);
    });
  }
}

module.exports = User;
