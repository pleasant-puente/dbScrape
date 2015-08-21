var utility = {
  makeDateStr: function(date) {
    var dateObj = date;
    var year = dateObj.getFullYear(); 
    var month = this.addZeroToDate(dateObj.getMonth() + 1);
    var day = this.addZeroToDate(dateObj.getDate());
     
    return year + '-' + month + '-' + day; 
  },
  addZeroToDate: function(num) {
    return num < 10  ? num = '0' + num : num; 
  }
}

module.exports = utility;
