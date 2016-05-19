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
