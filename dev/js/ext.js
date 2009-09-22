/* 
 * Global built-in extensions
 */

/* add swap to array */
Array.prototype.swap = function (a, b) {
    var tmp = this[a];
    this[a] = this[b];
    this[b] = tmp;
};

String.prototype.contains = function (str) {
    return this.indexOf(str, 0) != -1;
}
