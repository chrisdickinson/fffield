module.exports = Cursor

function Cursor(el, x, y) {
  this.x = 0 
  this.y = 0
  this.el = this.create_cursor().appendTo(el)

  this.position(x || 0, y || 0)
}

var cons = Cursor
  , proto = cons.prototype

proto.classname = 'cursor'

proto.x_free = 1
proto.y_free = 1

proto.position = function(x, y) {
  this.x = x
  this.y = y

  x = x - this.el.outerWidth() / 2
  y = y - this.el.outerHeight() / 2

  this.el.css({top: (this.y_free * y)+'px', left:(this.x_free * x)+'px'})
}

proto.create_cursor = function() {
  return $('<div />').addClass(this.classname)
}
