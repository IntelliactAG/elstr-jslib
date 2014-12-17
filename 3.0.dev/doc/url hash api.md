
# Proposal for the UrlHash API

---

## add and addValue

The add() method changes several state values at once.The new state is merged into the existing state: new values will override any existing values with the same names, while unchanged values will remain the same.

```js
// Current state: {kittens: 'fuzzy', puppies: 'cute'}
.add({
  kittens: 'cute',
  ferrets: 'sneaky'
});
// New state: {kittens: 'cute', puppies: 'cute', ferrets: 'sneaky'}
```

---

## set

To override the default merge behavior and discard the previous state entirely when setting a new state, use set().

```js
// Current state: {kittens: 'soft', puppies: 'cute', ferrets: 'sneaky'}
.set({
  kittens: 'cute',
  ferrets: 'sneaky'
});
// New state: {sloths: 'slow'}
```

---

## replace

The replace() methods work just like add(), except that they replace the current browser history entry instead of adding a new entry.

```js
// Current state: {sloths: 'slow'}
.replace({
  turtles: 'slower',
  snails : 'slowest'
});
// Current (not new) state: {sloths: 'slow', turtles: 'slower', snails: 'slowest'}
```

---

## get

Use the get() method to get the current state, or the value of a single item in the current state.

```js
.get();          // => {sloths: 'slow', turtles: 'slower', snails: 'slowest'}
.get('sloths');  // => 'slow'
.get('monkeys'); // => undefined

.getPrevious();
```

---

## getHash

Use the getHash() method to get hash string

```js
.getHash();          // => #sloths=slow&turtles=slower&snails=slowest

.getHashPrevious();
```