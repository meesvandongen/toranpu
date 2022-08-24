# generate-playing-cards.js

## About

With this package you can create a deck of playing cards.

## Installation

**Node.js is required.**

```
npm i generate-playing-cards.js
```

## Example

After installing the package you can finally write some code! First you'll have to require the package and destructure the class Deck.

```js
const { Deck } = require("generate-playing-cards.js");
```

Then just put the `new` keyword before it and it will generate a simple deck of playing cards for you!
Use the `cards` variable to get all the cards.
To demonstrate that it works you could log it.

**Tip: store your new deck in a variable.**

```js
console.log(new Deck().cards);
```

Now you have a basic deck, but it's not shuffled.
To shuffle your deck of cards call the `shuffle()` method on the deck you'd like to shuffle.
Log it so you can see that it works.

**Tip: if you have a variable containing a deck, the value of that variable automatically changes to the shuffled deck if you call the method on it.**

```js
console.log(new Deck().shuffle().cards);
```

Now you have a shuffled deck, but you can't do anything with it.
To draw a card call the `draw()` method on the deck you'd like to draw a card from.
Log it to see your drawn card.

**Tip: Like you can see in the example below you can chain some methods**

**Tip 2: if you have a variable containing a deck, the card that you draw will automatically be deleted from the deck.**

**Attention: You can't put a method _behind_ the `draw()` method**

```js
console.log(new Deck().shuffle().draw());
```

To reset a deck call the `reset()` method on the deck you'd like to reset.
Log it so you can see that the deck resets.

Final code will look something like this:

```js
const { Deck } = require("generate-playing-cards.js"); // Imported the Deck class
const deck = new Deck(); // Created a basic deck of cards and stored it in a variable called: deck

console.log("A basic deck of cards:", deck.cards);
console.log("A shuffled deck of cards:", deck.shuffle().cards);
console.log("The drawn card:", deck.draw());
console.log("The deck after drawing a card:", deck.cards);
console.log("A resetted deck of cards:", deck.reset().cards);
```

Output will look something like this:

```js
A basic deck of cards: [
  '1C',  '2C',  '3C',  '4C', '5C', '6C', '7C',
  '8C',  '9C',  '10C', 'JC', 'QC', 'KC', '1S',
  '2S',  '3S',  '4S',  '5S', '6S', '7S', '8S',
  '9S',  '10S', 'JS',  'QS', 'KS', '1D', '2D',
  '3D',  '4D',  '5D',  '6D', '7D', '8D', '9D',
  '10D', 'JD',  'QD',  'KD', '1H', '2H', '3H',
  '4H',  '5H',  '6H',  '7H', '8H', '9H', '10H',
  'JH',  'QH',  'KH'
]
A shuffled deck of cards: [
  '6S',  'JD',  'JH',  '5C', 'JS', '3C',  '4H',
  'QH',  '7H',  '9C',  'KH', '8H', '2D',  'KD',
  '2C',  '9S',  '4S',  '5D', '8S', '10S', '1D',
  '10H', '10D', '1C',  '4D', 'KS', '9D',  '8D',
  '4C',  '7C',  'QC',  '2H', '9H', 'QD',  '8C',
  '7D',  'KC',  '1S',  'QS', '6H', '5H',  '6D',
  'JC',  '7S',  '5S',  '3S', '1H', '3H',  '3D',
  '6C',  '2S',  '10C'
]
The drawn card: 6S
The deck after drawing a card: [
  'JD',  'JH', '5C',  'JS',  '3C', '4H',
  'QH',  '7H', '9C',  'KH',  '8H', '2D',
  'KD',  '2C', '9S',  '4S',  '5D', '8S',
  '10S', '1D', '10H', '10D', '1C', '4D',
  'KS',  '9D', '8D',  '4C',  '7C', 'QC',
  '2H',  '9H', 'QD',  '8C',  '7D', 'KC',
  '1S',  'QS', '6H',  '5H',  '6D', 'JC',
  '7S',  '5S', '3S',  '1H',  '3H', '3D',
  '6C',  '2S', '10C'
]
A resetted deck of cards: [
  '1C',  '2C',  '3C',  '4C', '5C', '6C', '7C',
  '8C',  '9C',  '10C', 'JC', 'QC', 'KC', '1S',
  '2S',  '3S',  '4S',  '5S', '6S', '7S', '8S',
  '9S',  '10S', 'JS',  'QS', 'KS', '1D', '2D',
  '3D',  '4D',  '5D',  '6D', '7D', '8D', '9D',
  '10D', 'JD',  'QD',  'KD', '1H', '2H', '3H',
  '4H',  '5H',  '6H',  '7H', '8H', '9H', '10H',
  'JH',  'QH',  'KH'
]
```

There you go, it's as easy as that!

## Packages

This package uses the following packages:

- [generate-uuid.js@1.0.2](https://www.npmjs.com/package/generate-uuid.js/v/1.0.2)

## Links

- [generate-uuid.js](https://www.npmjs.com/package/generate-uuid.js)
- [GitHub](https://github.com/MaestroDagan/generate-playing-cards.js)
- [npm](https://www.npmjs.com/package/generate-playing-cards.js)

## Help

If you need help or you've found a bug feel free to create an issue on [GitHub](https://github.com/MaestroDagan/generate-playing-cards.js/issues)
