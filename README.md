# generate-playing-cards.js

## About

With this package you can create a deck of playing cards and play a game of patience (the easy version/draws 1 card at a time)

**Huge thanks for downloading my package, we already have _510_ downloads in the first 3 days! While it was still in BETA, If you'd like a discord server for help and talking with the community etc. Pls open an issue on [GitHub](https://github.com/MaestroDagan/generate-playing-cards.js/issues).**

## Installation

**Node.js is required.**

```
npm i generate-playing-cards.js
```

## Example

### **Deck**

After installing the package you can finally write some code! First you'll have to require the package and destructure the Deck class.

```js
const { Deck } = require("generate-playing-cards.js");
```

Then just put the `new` keyword before it and it will generate a simple deck of playing cards for you!
Use the `cards` variable to get all the cards.
To demonstrate that it works you could log it.

**Tip: Store your new deck in a variable.**

```js
console.log(new Deck().cards);
```

Now you have a basic deck, but it's not shuffled.
To shuffle your deck of cards call the `shuffle()`.
Log it so you can see that it works.

**Tip: If you have a variable containing a deck, the value of that variable automatically changes to the shuffled deck if you call the method on it.**

```js
console.log(new Deck().shuffle().cards);
```

Now you have a shuffled deck, but you can't do anything with it.
To draw a card call the `draw()` method.
Log it to see your drawn card.

**Tip: Like you can see in the example below you can chain some methods.**

**Tip 2: If you have a variable containing a deck, the card that you draw will automatically be deleted from the deck.**

**Attention: You can't put a method _behind_ the `draw()` method.**

```js
console.log(new Deck().shuffle().draw());
```

To reset a deck call the `reset()` method on the deck you'd like to reset.
Log it so you can see that the deck resets.

Final code will look something like this:

```js
const { Deck } = require("generate-playing-cards.js"); // Import the Deck class
const deck = new Deck(); // Create a basic deck of cards and stored it in a variable called: deck

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

### **Patience**

First you'll have to require the package and destructure the Patience class.

```js
const { Patience } = require("generate-playing-cards.js");
```

Then just put the `new` keyword before it and pass a `Deck` as first param, it will generate a basic patience game in initial state!
To demonstrate that it works you could log it.

**Tip: Store your game of patience in a variable.**

```js
console.log(new Patience(new Deck().shuffle()));
```

Now you have a game of patience in initial state, but you can't do anything with it.
To draw a card from the stock and place it on the talon call the `draw()` method.
Log it so you can see that the card is transferred to the talon.

**Tip: When you try to draw a card from the stock while it's empty it'll transfer all the cards from the talon back to the stock.**

**Attention: This package uses the easy way of playing patience (draws 1 card at a time).**

```js
console.log(new Patience(new Deck().shuffle()).draw());
```

So now you know how to draw cards from the stock, but what does it matter when you can't do anything with the cards?
To transfer a card from his current location to a new location use the `move()` method.
Log it so you can see that the card is transferred to the new location.

**Attention: Like you can see in the example below you'll have to give the current location and new location of the card as a string!**

```js
console.log(
  new Patience(new Deck().shuffle()).draw().move("talon", "8C", "tableau[0]")
);
```

Final code will look something like this:

```js
const { Deck, Patience } = require("generate-playing-cards.js"); // Import the Deck and Patience class
const game = new Patience(new Deck().shuffle()); // Create a game of patience using a new shuffled deck.

console.log("Transferred a card from the stock to the talon", game.draw());
console.log(
  "Transferred a the card '8C' from the talon to the first column on the tableau",
  game.move("talon", "8C", "tableau[0]")
);
```

Final output will look something like this:

```js
Transferred a card from the stock to the talon Patience {
  deck: Deck {
    cards: [
      '9D', '9S',  'JC',  '8H',
      '1H', '10S', '9C',  '10H',
      '2D', '4S',  '7H',  '7D',
      'QH', '6C',  '6D',  '5H',
      'JH', '3C',  '10D', '3S',
      '6S', '8S',  '2C'
    ],
    id: 'iq34cmzm-apqe-l8w7-9jin-8zp11q6zz8xi'
  },
  tableau: [
    { open: [Array], closed: [] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] }
  ],
  stock: [
    '9D', '9S',  'JC',  '8H',
    '1H', '10S', '9C',  '10H',
    '2D', '4S',  '7H',  '7D',
    'QH', '6C',  '6D',  '5H',
    'JH', '3C',  '10D', '3S',
    '6S', '8S',  '2C'
  ],
  talon: [ '4C' ],
  foundations: [ [], [], [], [] ],
  id: 'kc74gwdp-9746-adg4-tl03-ola0dax1m0l5'
}
Transferred a the card '8C' from the talon to the first column on the tableau Patience {
  deck: Deck {
    cards: [
      '9D', '9S',  'JC',  '8H',
      '1H', '10S', '9C',  '10H',
      '2D', '4S',  '7H',  '7D',
      'QH', '6C',  '6D',  '5H',
      'JH', '3C',  '10D', '3S',
      '6S', '8S',  '2C'
    ],
    id: 'iq34cmzm-apqe-l8w7-9jin-8zp11q6zz8xi'
  },
  tableau: [
    { open: [Array], closed: [] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] },
    { open: [Array], closed: [Array] }
  ],
  stock: [
    '9D', '9S',  'JC',  '8H',
    '1H', '10S', '9C',  '10H',
    '2D', '4S',  '7H',  '7D',
    'QH', '6C',  '6D',  '5H',
    'JH', '3C',  '10D', '3S',
    '6S', '8S',  '2C'
  ],
  talon: [],
  foundations: [ [], [], [], [] ],
  id: 'kc74gwdp-9746-adg4-tl03-ola0dax1m0l5'
}
```

There you go, it's as easy as that!

## Idea's

### **My**

- Adding the official version of patience (drawing 3 cards at a time)? **(optional)**
- Adding more games like uno? **(optional)**

### **Your**

If you have an idea pls create an issue on [GitHub](https://github.com/MaestroDagan/generate-playing-cards.js/issues)

## Packages

This package uses the following packages:

- [generate-uuid.js@2.0.0](https://www.npmjs.com/package/generate-uuid.js/v/2.0.0)

## Links

- [generate-uuid.js](https://www.npmjs.com/package/generate-uuid.js)
- [GitHub](https://github.com/MaestroDagan/generate-playing-cards.js)
- [npm](https://www.npmjs.com/package/generate-playing-cards.js)

## Help

If you need help or you've found a bug feel free to create an issue on [GitHub](https://github.com/MaestroDagan/generate-playing-cards.js/issues)
