/**-----------------------------------------------------------------------------
 * A Google Apps Script that sends notifications of emails marked for
 * expiration. This is intended to be run via a time-driven event.
 *-----------------------------------------------------------------------------/


/**
 * Add startsWith() functionality to String
 * See https://goo.gl/MguDtL
 */
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position){
    position = position || 0;
    return this.substr(position, searchString.length) === searchString;
  };
}


/**
 * Add yyyymmdd() functionality to Date to return date in yyyymmdd format
 * See http://goo.gl/HALc22
 */
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd  = this.getDate().toString();
  return yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};


/**
 * CONSTANTS
 */
var RUN_DATE = new Date().yyyymmdd();
var EMAIL_RECIPIENT = Session.getActiveUser().getEmail();
var EMAIL_SUBJECT = 'Found emails marked for expiration on ' + RUN_DATE;




/**
 * MAIN
 */
function main() {
  Logger.log('Running...');

  sendEmail('test');

  Logger.log('Complete!');
}


/**
 * Sends parameter body as email
 */
function sendEmail(body) {
  MailApp.sendEmail(EMAIL_RECIPIENT, EMAIL_SUBJECT, body);
}
