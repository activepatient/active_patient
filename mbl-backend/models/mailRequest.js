// models/mailRequest.js
export class MailRequest {
  constructor(email, subject, emailbody) {
    this.Email = email;
    this.Subject = subject;
    this.Emailbody = emailbody;
  }
}
