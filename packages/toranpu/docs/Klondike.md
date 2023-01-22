## `drawFromStock`

Draws a single card from the stock and places it in the discard pile. If the
stock is empty, the discard pile is restored to the stock.



```ts
import { drawFromStock } from "toranpu";

drawFromStock(state)
```

### Arguments

- `state` (*Interface*): The game state


### Returns

(*Void*) undefined



---
## `getCanMoveFromStock`

Checks if a card can be moved from the stock to the tableau or foundation.



```ts
import { getCanMoveFromStock } from "toranpu";

getCanMoveFromStock(state, destination)
```

### Arguments

- `state` (*Interface*): The game state.
- `destination` (*Union*): The destination to move the card to.


### Returns

(*Boolean*) `true` if the move is valid, `false` otherwise.



---
## `getCanMoveFromTableau`

Checks if cards can be moved from the tableau to the foundation or another
tableau column.



```ts
import { getCanMoveFromTableau } from "toranpu";

getCanMoveFromTableau(state, source, destination)
```

### Arguments

- `state` (*Interface*): The game state
- `source` (*Interface*): The source of the cards
- `destination` (*Union*): The destination of the cards


### Returns

(*Boolean*) `true` if the cards can be moved, `false` otherwise.



---
## `getIsWinningState`

Checks if the game is won.



```ts
import { getIsWinningState } from "toranpu";

getIsWinningState(state)
```

### Arguments

- `state` (*Interface*): The game state.


### Returns

(*Boolean*) true if the game is won, false otherwise.



---
## `getTableauCards`

Gets a list of cards from the tableau. Does not remove the cards from the
tableau.



```ts
import { getTableauCards } from "toranpu";

getTableauCards(state, columnIndex, deckIndex)
```

### Arguments

- `state` (*Interface*): The game state
- `columnIndex` (*Number*): The index of the column to get cards from
- `deckIndex` (*Number*): The starting index of the deck to get cards from


### Returns

(*Type*) A list of cards from the tableau.



---
## `moveFromStock`

Move a card from the stock to the tableau or foundation.



```ts
import { moveFromStock } from "toranpu";

moveFromStock(state, destination)
```

### Arguments

- `state` (*Interface*): The game state.
- `destination` (*Union*): The destination to move the card to.


### Returns

(*Void*) undefined



---
## `moveFromTableau`

Moves a card from the tableau to the foundation or another tableau column.



```ts
import { moveFromTableau } from "toranpu";

moveFromTableau(state, source, destination)
```

### Arguments

- `state` (*Interface*): The game state
- `source` (*Interface*): The source of the card
- `destination` (*Union*): The destination of the card


### Returns

(*Void*) undefined



---
## `setupGame`

Setup a game of Klondike



```ts
import { setupGame } from "toranpu";

setupGame(seed)
```

### Arguments

- `seed` (*String*): The seed to use for shuffling the deck


### Returns

(*Interface*) The game state

