
# Callforth :running:

[![npm version](https://badge.fury.io/js/callforth.svg)](https://badge.fury.io/js/callforth)
![minzipped size](https://badgen.net/bundlephobia/minzip/callforth)

A tiny utility library to replace callbacks with Promises where possible.
**Don't callback, callforth!**

It simply includes two functions I see myself re-implementing in nearly every project.
So I might as well put them in a package.

Do things like:

```js
await timeout(3000)
```
```js
await eventOn(videoElement, "loadeddata")
```
```js
const message = await eventOn(webWorker, "message")
```

## Install :package:

```sh
npm install callforth
```

Now you can:

```js
import { eventOn, timeout } from "callforth"

// ...
```

Alternatively, include [this script](https://unpkg.com/callforth/dist/callforth.umd.js) and:

```html
<script src="./path/to/callforth.umd.js"></script>
<script>
  const { eventOn, timeout } = window.callforth
  
  // ...
</script>
```

## API :eyes:

### `eventOn`

```js
const payload = await eventOn(target, successEvent, errorEvent)
```

#### Parameters

 * `target`: any object you can call `addEventListener` on.
 * `successEvent`: name of the event you want to await.
 * `errorEvent` (optional): if this event fires, the promise is rejected.

#### Return Value

 * `payload`: what would usually be the first argument of the callback.

### `timeout`

```js
await timeout(delay)
```

#### Parameters

 * `delay`: delay in milliseconds after which the Promise should resolves.

#### Return Value

 * undefined

## More Examples

```js
async function loadScript(url) {
  let script = document.createElement("script")

  script.src = url

  await eventOn(script, "loaded")
}
```
```js
async function primesLessThen(number) {
  primeWorker.postMessage(number)

  const result = await eventOn(primeWorker, "message")

  return result
}
```
