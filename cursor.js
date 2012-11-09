module.exports = Cursor

function Cursor(el, x, y) {
  this.x = 0 
  this.y = 0
  this.el = this.create_cursor(el)

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

  if(this.el.clientWidth && this.el.clientHeight) {
    x = x - this.el.clientWidth / 2
    y = y - this.el.clientHeight / 2
  }

  this.el.style.top = (this.y_free * y)+'px'
  this.el.style.left = (this.x_free * x)+'px'
}

proto.create_cursor = function(el) {
  var new_element = el.ownerDocument.createElement('div')
  new_element.setAttribute('class', this.classname)
  el.appendChild(new_element)
  return new_element
}
