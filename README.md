# fffield

Turn any dom element into an X/Y input with a cursor.

```javascript

var field = require('fffield')

var target = $('#my-target')

field(target, 0, 0)
  .on('data', function(position) {
    console.log(position.x, position.y) // bounded from 0.0 to 1.0
  })

```

## API

### field = require('fffield')

### field(jquery element, initial x, initial y[, optional cursor constructor]) -> Field instance

## Events

### 'data' -> `{x, y}`

Data events are emitted whenever the cursor changes positions. 
