exports.getDate = function() {
  const options = {weekday: 'long', day: "numeric", month: "long"};
  const today = new Date();
  return today.toLocaleDateString("en-US", options);
}

exports.getDay = function() {
  const today = new Date();
  const options = {weekday: 'long'};
  return today.toLocaleDateString("en-US", options);
}
