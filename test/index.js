var assert = require('assert')
  , field = require('../index')
  , jsdom
  , document
//, window <-- implied global

try {
  jsdom = require('jsdom')
} catch(e) {

}

var tests = [
    test_init_sets_mouse_events
  , test_init_sets_extents
  , test_mousemove_does_not_fire_without_mousedown 
  , test_set_position
  , test_handle_click_emits_event
]

start()

function setup() {

}

// integration tests because science.

function test_init_sets_mouse_events() {
  var el = create_element(100, 100)
    , input = field(el, 0, 0)
    , ev

  ev = create_event('mousedown', 0, 0)
  ev.preventDefault = function() { 
    ev.__preventDefault__ = true
  }
  el.dispatchEvent(ev)
  assert.ok(ev.__preventDefault__)

  // ---

  input.handle_click = input.handle_click.before(function() {
    this._triggered = true    
  })

  ev = create_event('mousemove', 32, 32)
  ev.preventDefault = function() { 
    ev.__preventDefault__ = true
  }
  el.dispatchEvent(ev)

  assert.ok(input.handle_click._triggered) 

  input.handle_click._triggered = false
  ev = create_event('mouseup', 32, 32)
  ev.preventDefault = function() { 
    ev.__preventDefault__ = true
  }
  el.dispatchEvent(ev)
}

function test_init_sets_extents() {
  var w = Math.random() * 0xFF & 0xFF
    , h = Math.random() * 0xFF & 0xFF
    , el = create_element(w, h)
    , input = field(el, 0, 0)

  assert.equal(w, input.x_extent)
  assert.equal(h, input.y_extent)
}

function test_mousemove_does_not_fire_without_mousedown() {
  var el = create_element(100, 100)
    , input = field(el, 0, 0)
    , ev = create_event('mousemove', 32, 32)

  input.handle_click = input.handle_click.before(function() {
    input.handle_click._triggered = true
  })

  el.dispatchEvent(ev)

  assert.ok(!input.handle_click._triggered)
}

function test_set_position() {
  var el = create_element(100, 100)
    , input = field(el, 0, 0)
    , pos = [Math.random(), Math.random()]

  input.set(pos[0], pos[1])

  assert.equal(input.cursor.el.style.left, (pos[0] * 100)+'px')
  assert.equal(input.cursor.el.style.top, ((1 - pos[1]) * 100)+'px')

}

function test_handle_click_emits_event() {
  var el = create_element(100, 100)
    , input = field(el, 0, 0)
    , data = null
    , ev

  input.once('data', function(datum) {
    data = datum
  })

  ev = create_event('mousedown', 0, 0)
  el.dispatchEvent(ev)

  // ---

  ev = create_event('mousemove', 32, 32)
  el.dispatchEvent(ev)

  assert.ok(data !== null)
}

// utils

function create_element(w, h) {
  var element = document.createElement('div')

  document.body.appendChild(element)

  element.style.width = w+'px'
  element.style.height = h+'px'

  return element
}

function create_event(event_name, x, y) {
  var event = document.createEvent('MouseEvents')

  event.initMouseEvent(event_name, true, true, 0, 0, x, y, false, false, false, false, 0, null)

  return event
}

function out(what) {
  process.stdout.write(what)
}

// test runner

function start() {
  Function.prototype.before = function(fn) {
    var self = this
    return function ret() {
      var args = [].slice.call(arguments)

      fn.call(ret, args)

      return self.apply(this, args)
    }
  }

  if(typeof window === 'undefined') {
    return jsdom.env('<body></body>', function(err, win) {
      window = win
      document = win.document
      run()
    })
  }
  out = function(s) {
    out.buf = (out.buf || '') + s
    if(!!~s.indexOf('\n')) {
      console.log(out.buf)
      out.buf = ''
    }
  }
  document = window.document
  run()
}

function run() {
  if(!tests.length)
    return out('\n')

  var test = tests.shift()
    , now = Date.now()

  setup()

  out(test.name+' - ')
  test.length ? test(done) : (test(), done())

  function done() {
    out(''+(Date.now() - now)+'ms\n')
    run()
  }
}

