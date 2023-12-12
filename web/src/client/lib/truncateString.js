// Truncate a string if it is longer than the specified number of characters.
// We use a custom made function because libraries like react-dotdotdot require react in version >=15 and we use react 0.13.3.
export function truncateString(str, length, ending) {
  if (length == null) {
    length = 270;
  }
  if (ending == null) {
    ending = '…';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
};