import clsx from "clsx";
import { ComponentProps } from "react";
import {
  Card,
  drawFromStock,
  getCard,
  getColor,
  getRank,
  getSuit,
} from "toranpu";
import { suitUnicode } from "./cardToUnicode";
import { useGameState } from "./state";

function CardButton({
  card,
  ...props
}: ComponentProps<"button"> & { card: Card }) {
  const rank = getRank(card);
  const suit = getSuit(card);
  const color = getColor(card);

  return (
    <button
      {...props}
      className={clsx(
        "flex aspect-[62/88] w-32 flex-col rounded-xl duration-100 bg-gray-50 border border-gray-300 shadow hover:scale-110 hover:shadow-2xl transform transition-all",
        color === "black" && "text-black",
        color === "red" && "text-red-500",
      )}
    >
      {/* top-section */}
      <div className={"flex w-full items-center px-2 py-0.5"}>
        <span className="text-xl font-bold">{rank}</span>
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
        <span className="text-xl font-bold">{rank}</span>
      </div>
    </button>
  );
}

function EmptySpot() {
  return (
    <div className="aspect-[62/88] w-32 rounded-xl border-2 border-green-700" />
  );
}

function Stock() {
  const gameState = useGameState();
  const stock = gameState.stock;

  const card = getCard(stock);

  if (!card) {
    return (
      <button
        onClick={() => {
          drawFromStock(gameState);
        }}
      >
        <EmptySpot />
      </button>
    );
  }

  return (
    <CardButton
      card={card}
      onClick={() => {
        drawFromStock(gameState);
      }}
    />
  );
}

function Discard() {
  const gameState = useGameState();
  const discard = gameState.discard;

  const card = getCard(discard);

  if (!card) {
    return <EmptySpot />;
  }

  return <CardButton card={card} />;
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

  const cards = gameState.foundations[index];

  if (cards.length === 0) {
    return <EmptySpot />;
  }

  return (
    <Stack>
      <CardButtons cards={cards} />
    </Stack>
  );
}

function CardButtons({ cards }: { cards: Card[] }) {
  return (
    <>
      {cards.map((card, i) => (
        <CardButton card={card} key={i} />
      ))}
    </>
  );
}

interface StacksProps {
  children: React.ReactNode;
  horizontal?: boolean;
}
function Stack({ children, horizontal = false }: StacksProps) {
  return (
    <div
      className={clsx(
        "flex",
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

  const column = gameState.tableau[index];

  return (
    <Stack>
      <CardButtons cards={column.closed} />
      <CardButtons cards={column.open} />
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

function App() {
  return (
    <div className="flex justify-center h-screen items-center">
      <div className="grid grid-cols-7 grid-rows-[auto,auto] gap-4 gap-y-16 p-4 items-start">
        <Stock />
        <Discard />
        <div />
        <Foundations />
        <Tableau />
      </div>
    </div>
  );
}

export default App;
