module.exports = field

var EE = require('events').EventEmitter
  , Cursor = require('./cursor')

field.constructor = Field
field.cursor_class = Cursor

function field(el, x, y, cursor_class) {
  var input = new Field(el, x, y)
  input.cursor_class = cursor_class || field.cursor_class

  input.init()
  return input 
}

function Field(el, x, y) {
  this.el = el
  this.cursor = null
  this.initial_x = x || 0
  this.initial_y = y || 0

  this.el.css('position', 'relative')

  this.x_extent = 
  this.y_extent = null

  EE.call(this)
}

var cons = Field
  , proto = cons.prototype = new EE

proto.constructor = cons

proto.cursor_class = Cursor

proto.init = function() {
  var self = this
    , move_listener 
    , listening = false

  self.x_extent = self.el.outerWidth()
  self.y_extent = self.el.outerHeight()

  self.cursor = new self.cursor_class(self.el, 0, 0)
  self.set(self.initial_x, self.initial_y)

  self.el.mousedown(function(ev) {
    listening = true 
    ev.preventDefault()
  })

  self.el.mouseup(function(ev) {
    self.handle_click(ev)
  })

  $('body').mouseup(function(ev) {
    listening = false
  })

  self.el.mousemove(function(ev) {
    if(listening) {
      self.handle_click(ev)
    }
  })
}

proto.set = function(x, y) {
  this.cursor.position(x * this.x_extent, (1.0 - y) * this.y_extent)
}

proto.handle_click = function(ev) {
  this.cursor.position(ev.offsetX, ev.offsetY) 

  this.emit('data', this.position_from_event(ev))
}

proto.handle_move = function(ev) {
  this.emit('move', this.position_from_event(ev)) 
}

proto.position_from_event = function(ev) {
  return {
      x: ev.offsetX / this.x_extent
    , y: (this.y_extent - ev.offsetY) / this.y_extent
  }
}
