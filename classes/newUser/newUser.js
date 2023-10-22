const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

class NewUser {
  constructor(FirstName, LastName, Email) {
    this._key =
      "a4e27f15bb12d99897a30b35ead719a81ad6a37ade8b0f0251453b2ebc03a600";
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.Email = Email;
  }
  _otpCode() {
    const code = Math.floor(Math.random() * 10000);
    const formattedCode = code.toString().padStart(4, "0");
    this._otp = formattedCode;
  }
  _sendMail() {
    const transporter = nodemailer.createTransport({
      host: 'server303.web-hosting.com', // Namecheap SMTP server for your domain
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

  getPublicToken() {
    this._otpCode();
    this._sendMail();
    const jwtToken = jwt.sign(
      { Email: this.Email, Code: this._otp },
      this._key,
      { expiresIn: "1h" }
    );
    return jwtToken;
  }

  verifyOTP(token, OTP) {
    try {
      const payload = jwt.verify(token, this._key);
      if (payload.Code === OTP) {
        const jwtToken = jwt.sign(
          {
            Email: this.Email,
            FirstName: this.FirstName,
            LastName: this.LastName,
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
}

module.exports = NewUser;
