// Javascript inheritance by John Resig
// Inspired by base2 and Prototype
(function(){
  var initializing = false;
  var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init ) {
        this.init.apply(this, arguments);
      }
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

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
};


function $A(a)
{
  var r = [];
  for (var i = 0, len = a.length; i < len; ++i)
    r.push(a[i]);
  return r;
}

Function.prototype.bind = function()
{
  var
    __method = this,
    args = $A(arguments),
    object = args.shift();

  return function() {
    return __method.apply(object, args.concat($A(arguments)))
  };
}
