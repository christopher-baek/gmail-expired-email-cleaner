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
var EXPIRATION_LABEL_PREFIX = 'expires';
var EXPIRATION_LABEL_DATE_START_INDEX = EXPIRATION_LABEL_PREFIX.length + 1;
var DELETE_LABEL_NAME = 'DELETE';




/**
 * MAIN
 */
function main() {

  
  var gmailLabels = GmailApp.getUserLabels();

  var expirationLabels = gmailLabels.filter(isExpirationLabel);

  if (expirationLabels.length > 0) {    
    var expirationDateMatchLabels = expirationLabels.filter(isExpirationDateMatch);
    
    if (expirationDateMatchLabels.length == 1) {
      var expirationDateMatchLabel = expirationDateMatchLabels[0];
      markThreadsForDeletion(expirationDateMatchLabel);
    }
    
    deleteEmptyExpirationLabels(expirationLabels);
    deleteEmptyDeleteLabel();
  }
}


/**
 * Returns true if the parameter label should be evaluated as having threads
 * that should be deleted
 */
function isExpirationLabel(gmailLabel) {
  return gmailLabel.getName().toLowerCase().startsWith(EXPIRATION_LABEL_PREFIX);
}


/**
 * Returns true if the date on the parameter label matches the run date
 */
function isExpirationDateMatch(gmailLabel) {
  var expirationDate = gmailLabel.getName().substring(EXPIRATION_LABEL_DATE_START_INDEX);
  return expirationDate == RUN_DATE;
}


/**
 * Marks all threads attached to the parameter label with the deletion label
 */
function markThreadsForDeletion(gmailLabel) {
  var deleteLabel = retrieveDeleteLabel();
  
  gmailLabel.getThreads().forEach(function(gmailThread) {
    gmailThread.addLabel(deleteLabel);
    gmailThread.moveToInbox();
  });
}


/**
 * Returns the delete label. Creates the label if it doesn't exist.
 */
function retrieveDeleteLabel() {
  var deleteLabel = GmailApp.getUserLabelByName(DELETE_LABEL_NAME);
  
  if (!deleteLabel) {
    deleteLabel = GmailApp.createLabel(DELETE_LABEL_NAME);
  }
  
  return deleteLabel;
}


/**
 * Deletes any of the parameter labels that don't have attached threads
 */
function deleteEmptyExpirationLabels(gmailLabels) {
  gmailLabels.forEach(function(gmailLabel) {
    if (gmailLabel.getThreads().length == 0) {
      gmailLabel.deleteLabel();
    }
  });
}


/**
 * Deletes the delete label if 
 */
function deleteEmptyDeleteLabel() {
  var deleteLabel = GmailApp.getUserLabelByName(DELETE_LABEL_NAME);
  
  if (deleteLabel && deleteLabel.getThreads().length == 0) {
    deleteLabel.deleteLabel();
  }
}
