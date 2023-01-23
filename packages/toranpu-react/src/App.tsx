import clsx from "clsx";
import { ComponentProps, useEffect } from "react";
import {
  Card,
  Destination,
  drawFromStock,
  getCanMoveFromSource,
  getCard,
  getColor,
  getRank,
  getSourceCards,
  getSuit,
  moveFromSource,
} from "toranpu";
import { subscribe } from "valtio";
import { suitUnicode } from "./cardToUnicode";
import { gameStateProxy, useGameState, useHand } from "./state";

function OpenCard({
  card,
  ...props
}: ComponentProps<"button"> & { card: Card }) {
  const disabled = props.disabled;
  const rank = getRank(card);
  const suit = getSuit(card);
  const color = getColor(card);

  const rankStr = rank === "T" ? "10" : rank;

  return (
    <button
      {...props}
      className={clsx(
        "flex aspect-[62/88] w-32 transform flex-col rounded-xl border border-gray-300 bg-gray-50 shadow transition-transform duration-100",
        color === "black" && "text-black",
        color === "red" && "text-red-500",
        disabled ? "" : "hover:scale-110 hover:shadow-2xl active:scale-105",
      )}
    >
      {/* top-section */}
      <div className={"flex w-full items-center px-2 py-0.5"}>
        <span className="text-xl font-bold">{rankStr}</span>
        <span className="grow"></span>
        <span className="text-2xl">{suitUnicode[suit]}</span>
      </div>
      {/* middle-section */}
      <div className="flex w-full grow items-center justify-center text-4xl">
        <span>{suitUnicode[suit]}</span>
      </div>
      {/* bottom-section */}
      <div className={"flex w-full items-center px-2 py-0.5"}>
        <span className="text-2xl">{suitUnicode[suit]}</span>
        <span className="grow"></span>
        <span className="text-xl font-bold">{rankStr}</span>
      </div>
    </button>
  );
}

function EmptySpot({ ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={clsx(
        "aspect-[62/88] w-32 rounded-xl border-2 border-green-700",
        props.disabled
          ? ""
          : "transition-colors duration-100 hover:border-green-500",
      )}
    />
  );
}

export function ClosedCard({ ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={clsx(
        "flex aspect-[62/88] w-32 content-center items-center justify-center rounded-xl border border-slate-700 shadow transition-[transform,shadow] duration-100",
        "bg-gradient-to-br from-slate-700 to-slate-800",
        props.disabled
          ? ""
          : "hover:scale-110 hover:shadow-2xl active:scale-105",
      )}
    ></button>
  );
}

function Stock() {
  const gameState = useGameState();
  const stock = gameState.stock;

  const card = getCard(stock);

  if (!card) {
    return (
      <EmptySpot
        disabled={stock.length === 0}
        onClick={() => {
          drawFromStock(gameState);
        }}
      />
    );
  }

  return (
    <ClosedCard
      onClick={() => {
        drawFromStock(gameState);
      }}
    />
  );
}

function Discard() {
  const gameState = useGameState();
  const hand = useHand();
  const discard = gameState.discard;

  const card = getCard(discard);

  if (!card) {
    return <EmptySpot disabled />;
  }

  return (
    <OpenCard
      card={card}
      onClick={() => {
        hand.source = {
          type: "discard",
        };
      }}
    />
  );
}

interface FoundationsProps {}
function Foundations({}: FoundationsProps) {
  const gameState = useGameState();

  const foundations = gameState.foundations;

  return (
    <>
      {foundations.map((_, i) => (
        <Foundation key={i} index={i}></Foundation>
      ))}
    </>
  );
}
interface FoundationProps {
  index: number;
}
function Foundation({ index }: FoundationProps) {
  const gameState = useGameState();
  const hand = useHand();

  const cards = gameState.foundations[index];

  function onClick() {
    if (!hand.source) {
      return;
    }
    moveFromSource(gameState, hand.source, {
      type: "foundation",
      column: index,
    });
  }

  const canMove =
    !!hand.source &&
    getCanMoveFromSource(gameState, hand.source, {
      type: "foundation",
      column: index,
    });

  const card = getCard(cards);

  if (!card) {
    return <EmptySpot onClick={onClick} disabled={!canMove} />;
  }

  return <OpenCard card={card} onClick={onClick} disabled={!canMove} />;
}

interface StacksProps {
  children: React.ReactNode;
  horizontal?: boolean;
}
function Stack({ children, horizontal = false }: StacksProps) {
  return (
    <div
      className={clsx(
        "flex transition-none",
        horizontal ? "-space-x-[6.3rem] " : "flex-col -space-y-[9.5rem]",
      )}
    >
      {children}
    </div>
  );
}

interface TableauColumnProps {
  index: number;
}
function TableauColumn({ index }: TableauColumnProps) {
  const gameState = useGameState();
  const hand = useHand();

  const column = gameState.tableau[index];

  const destination: Destination = {
    type: "tableau",
    column: index,
  };

  if (column.open.length === 0 && column.closed.length === 0) {
    return (
      <EmptySpot
        disabled={
          !(
            hand.source &&
            getCanMoveFromSource(gameState, hand.source, destination)
          )
        }
        onClick={() => {
          if (
            hand.source &&
            getCanMoveFromSource(gameState, hand.source, destination)
          ) {
            return moveFromSource(gameState, hand.source, destination);
          }
        }}
      />
    );
  }

  return (
    <Stack>
      {column.closed.map((card, i) => (
        <ClosedCard disabled key={card} />
      ))}
      {column.open.map((card, i) => (
        <OpenCard
          card={card}
          key={card}
          onClick={() => {
            if (
              hand.source &&
              getCanMoveFromSource(gameState, hand.source, destination)
            ) {
              return moveFromSource(gameState, hand.source, destination);
            }
            hand.source = {
              type: "tableau",
              column: index,
              index: i,
            };
          }}
        />
      ))}
    </Stack>
  );
}

function Tableau() {
  const gameState = useGameState();

  const tableau = gameState.tableau;

  return (
    <>
      {tableau.map((_, i) => (
        <TableauColumn key={i} index={i} />
      ))}
    </>
  );
}

function Hand() {
  const gameState = useGameState();
  const hand = useHand();

  useEffect(
    () =>
      subscribe(gameStateProxy, () => {
        hand.source = null;
      }),
    [],
  );

  if (!hand.source) {
    return null;
  }

  const cards = getSourceCards(gameState, hand.source);

  return (
    <div className="absolute bottom-0 overflow-hidden">
      <div className="relative -bottom-36">
        <Stack>
          {cards.map((card, i) => (
            <OpenCard card={card} key={card} disabled />
          ))}
        </Stack>
      </div>
    </div>
  );
}

// function UndoRedo() {
//   const { undo, canUndo } = useUndoState();

//   return (
//     <button
//       disabled={!canUndo()}
//       className="absolute right-0 bottom-0 m-8 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-5xl"
//       onClick={() => {
//         undo();
//       }}
//     >
//       ⎌
//     </button>
//   );
// }

function App() {
  return (
    <div className="flex h-screen items-start justify-center">
      <div className="grid grid-cols-7 grid-rows-[auto,auto] items-start gap-4 gap-y-16 p-4">
        <Stock />
        <Discard />
        <div />
        <Foundations />
        <Tableau />
      </div>
      <Hand />
      {/* <UndoRedo /> */}
    </div>
  );
}

export default App;
