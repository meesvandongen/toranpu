import { useEffect } from "react";
import {
  Card,
  Deck,
  Destination,
  drawFromStock,
  getCanMoveFromSource,
  getCard,
  getSourceCards,
  moveFromSource,
} from "toranpu";
import { subscribe } from "valtio";
import { useGameState, useGameStateContext, useHandState } from "./state";

/**
 * Allows the component to access the stock. The stock is the deck of cards from
 * which cards are drawn and moved to the discard pile. When the stock is empty,
 * the discard pile is flipped over and becomes the new stock.
 *
 * @category Hooks
 *
 * @returns An object containing properties related to the stock.
 */
export function useStock(): {
  /**
   * The card that is on top of the stock. If the stock is empty, this will be
   * `null`.
   */
  card: Card | null;
  /**
   * Whether or not the discard pile has any cards. If the `card` is null (thus
   * the stock is empty), this prop can be used to inform the UI that the
   * discard pile cannot be flipped over anymore.
   */
  discardHasCards: boolean;
  /**
   * Draws a card from the stock and moves it to the discard pile. If the stock
   * is empty, the discard pile is flipped over and becomes the new stock.
   */
  draw: () => void;
} {
  const gameState = useGameState();
  const stock = gameState.value.stock;
  const discard = gameState.value.discard;

  const card = getCard(stock);
  const discardHasCards = discard.length > 0;

  function draw() {
    drawFromStock(gameState.value);
  }

  return { card, discardHasCards, draw };
}

/**
 * Allows the component to access the discard pile. The discard pile is the
 * deck of cards to which cards are moved when they are removed from the
 * stock.
 *
 * @category Hooks
 *
 * @returns An object containing properties related to the discard pile.
 */
export function useDiscard(): {
  /**
   * The card that is on top of the discard pile. If the discard pile is empty,
   * this will be `null`.
   */
  card: Card | null;
  /**
   * Puts the card at the top of the discard pile into the hand.
   */
  select: () => void;
} {
  const gameState = useGameState();
  const hand = useHandState();
  const discard = gameState.value.discard;

  const card = getCard(discard);

  function select() {
    hand.source = {
      type: "discard",
    };
  }

  return { card, select };
}

/**
 * Allows the component to access the foundations. The foundations are the four
 * piles at the top of the screen. Use the `useFoundation` hook to access the
 * individual foundations.
 *
 * @category Hooks
 *
 * @returns An object containing properties related to the foundations.
 */
export function useFoundations(): {
  /**
   * A list of foundation indexes.
   */
  foundations: number[];
} {
  const gameState = useGameState();

  const foundations = gameState.value.foundations.map(
    (_foundation, index) => index,
  );

  return { foundations };
}

/**
 * Allows the component to access and manage the foundation.
 *
 * @category Hooks
 *
 * @param index The index of the foundation.
 * @returns An object containing properties related to the foundation.
 */
export function useFoundation(index: number): {
  /**
   * The card that is on top of the foundation. If the foundation is empty, this
   * will be `null`.
   */
  card: Card | null;
  /**
   * Moves the current hand to the foundation, if possible.
   */
  move: () => void;
  /**
   * Whether or not the current hand can be moved to the foundation.
   */
  canMove: boolean;
} {
  const gameState = useGameState();
  const hand = useHandState();

  const cards = gameState.value.foundations[index];

  function move() {
    if (!hand.source) {
      return;
    }
    moveFromSource(gameState.value, hand.source, {
      type: "foundation",
      column: index,
    });
  }

  const canMove =
    !!hand.source &&
    getCanMoveFromSource(gameState.value, hand.source, {
      type: "foundation",
      column: index,
    });

  const card = getCard(cards);

  return { card, move, canMove };
}

/**
 * Allows the component to access a column in the tableau.
 *
 * @category Hooks
 *
 * @param index The index of the column.
 * @returns An object containing properties related to the column.
 */
export function useTableauColumn(index: number): {
  /**
   * Whether or not the column has any cards.
   */
  hasCards: boolean;
  /**
   * If the column is empty, whether the current hand can be moved to the
   * column.
   */
  canMoveToEmpty: boolean;
  /**
   * If the column is empty, moves the current hand to the column.
   */
  moveToEmpty: () => void;
  /**
   * The cards that are face down in the column.
   */
  closedCards: Deck;
  /**
   * The cards that are face up in the column.
   */
  openCards: Array<{
    /**
     * The card.
     */
    card: Card;
    /**
     * If there is a selection in the hand, this function will check if that
     * selection can be moved to the column.
     *
     * If there is no selection in the hand, or the selection cannot be moved,
     * this function will select the card.
     */
    moveOrSelect: () => void;
    /**
     * Whether or not the hand can be moved to the column.
     */
    canMove: boolean;
  }>;
} {
  const gameState = useGameState();
  const hand = useHandState();

  const column = gameState.value.tableau[index];

  const destination: Destination = {
    type: "tableau",
    column: index,
  };

  const hasCards = column.open.length > 0;

  const canMove =
    !!hand.source &&
    getCanMoveFromSource(gameState.value, hand.source, destination);

  function select(cardIndex: number) {
    hand.source = {
      type: "tableau",
      column: index,
      index: cardIndex,
    };
  }

  function moveToEmpty() {
    if (canMove) {
      moveFromSource(gameState.value, hand.source!, destination);
    }
  }

  const openCards = column.open.map((card, cardIndex) => ({
    card,
    moveOrSelect: () => {
      if (canMove) {
        return moveFromSource(gameState.value, hand.source!, destination);
      }
      select(cardIndex);
    },
    canMove,
  }));

  return {
    hasCards,
    canMoveToEmpty: canMove,
    moveToEmpty,
    closedCards: column.closed,
    openCards,
  };
}

/**
 * Allows the component to access the tableau root. The tableau is the main
 * playing area of the game. It consists of 7 columns of cards. Use the
 * `useTableauColumn` hook to access the cards in each column.
 *
 * @category Hooks
 *
 * @returns An object containing properties related to the tableau.
 */
export function useTableau(): {
  /**
   * A list of columns in the tableau. Each column is represented by an index.
   */
  tableau: number[];
} {
  const gameState = useGameState();

  const tableau = gameState.value.tableau.map((_column, index) => index);

  return { tableau };
}

/**
 * Allows the component to access the hand state. The hand shows what is currently
 * selected by the user.
 *
 * @category Hooks
 *
 * @returns An object containing properties related to the hand.
 */
export function useHand(): {
  /**
   * A list of cards that are currently selected.
   */
  cards: Deck;
} {
  const gameState = useGameState();
  const hand = useHandState();
  const gameStateProxy = useGameStateContext();

  useEffect(
    () =>
      subscribe(
        gameStateProxy,
        () => {
          hand.source = null;
        },
        true,
      ),
    [],
  );

  const cards = hand.source ? getSourceCards(gameState.value, hand.source) : [];

  return { cards };
}

/**
 * Allows the component to access and manage the undo state.
 *
 * @category Hooks
 *
 * @returns An object containing properties related to `undo` functionality.
 */
export function useUndo(): {
  /**
   * Whether or not the game state can be undone.
   */
  canUndo: boolean;
  /**
   * Undoes the last action.
   * @returns
   */
  undo: () => void;
} {
  const gameState = useGameState();

  // hack to trigger rerender.
  gameState.value;

  const canUndo = gameState.canUndo();

  function undo() {
    gameState.undo();
  }

  return { canUndo, undo };
}
