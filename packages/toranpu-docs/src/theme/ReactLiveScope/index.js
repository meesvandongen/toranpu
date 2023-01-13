import React from "react";
import {
  drawFromStock,
  getCanMoveFromStock,
  getCanMoveFromTableau,
  getColor,
  getIsWinningState,
  getRank,
  getSuit,
  getTableauCards,
  moveFromStock,
  moveFromTableau,
  setupGame,
} from "toranpu";

// Add react-live imports you need here
const ReactLiveScope = {
  React,
  ...React,
  drawFromStock,
  getCanMoveFromStock,
  getCanMoveFromTableau,
  getColor,
  getIsWinningState,
  getRank,
  getSuit,
  getTableauCards,
  moveFromStock,
  moveFromTableau,
  setupGame,
};
export default ReactLiveScope;
