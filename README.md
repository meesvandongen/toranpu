# generate-playing-cards.js

## About

With this package you can create a deck of playing cards.

## Installation

**Node.js and npm are required.**

```
npm i generate-playing-cards.js
```

## Example

After installing the package you can finally write some code! First you'll have to require the package and destructure the class Deck.

```js
const { Deck } = require("generate-playing-cards.js");
```

Then just put the new keyword before it and it will generate a simple deck of playing cards for you!

```js
new Deck();
```

Now to demonstrate that it works you can log it.

```js
console.log(new Deck());
```

Final code will look something like this:

```js
const { Deck } = require("generate-playing-cards.js");
console.log(new Deck());
```

Output will look like this:

```js
Deck {
  cards: [
    '1C',  '2C',  '3C',  '4C', '5C', '6C', '7C',
    '8C',  '9C',  '10C', 'JC', 'QC', 'KC', '1S',
    '2S',  '3S',  '4S',  '5S', '6S', '7S', '8S',
    '9S',  '10S', 'JS',  'QS', 'KS', '1D', '2D',
    '3D',  '4D',  '5D',  '6D', '7D', '8D', '9D',
    '10D', 'JD',  'QD',  'KD', '1H', '2H', '3H',
    '4H',  '5H',  '6H',  '7H', '8H', '9H', '10H',
    'JH',  'QH',  'KH'
  ]
}
```

There you go, it's as easy as that!

## Help

If you need help or you've found a bug feel free to create an issue on [GitHub](https://github.com/MaestroDagan/generate-playing-cards.js/issues)
