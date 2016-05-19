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
