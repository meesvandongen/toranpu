import clsx from "clsx";
import { ComponentProps } from "react";
import { Card } from "toranpu";
import {
  useDiscard,
  useFoundation,
  useFoundations,
  useHand,
  useStock,
  useTableau,
  useTableauColumn,
  useUndo,
} from "./hooks";
import { ToranpuProvider } from "./state";
import { getCardInfo } from "./utils";

function OpenCard({
  card,
  ...props
}: ComponentProps<"button"> & { card: Card }) {
  const disabled = props.disabled;
  const { color, rankFull, symbol } = getCardInfo(card);

  return (
    <button
      type="button"
      {...props}
      className={clsx(
        "flex aspect-[62/88] w-32 transform flex-col rounded-xl border border-gray-300 bg-gray-50 shadow ",
        color === "black" && "text-black",
        color === "red" && "text-red-500",
        disabled
          ? ""
          : "transition-transform duration-100 hover:scale-110 hover:shadow-2xl active:scale-105",
      )}
    >
      {/* top-section */}
      <div className={"flex w-full items-center px-2 py-0.5"}>
        <span className="text-xl font-bold">{rankFull}</span>
        <span className="grow"></span>
        <span className="text-2xl">{symbol}</span>
      </div>
      {/* middle-section */}
      <div className="flex w-full grow items-center justify-center text-4xl">
        <span>{symbol}</span>
      </div>
      {/* bottom-section */}
      <div className={"flex w-full items-center px-2 py-0.5"}>
        <span className="text-2xl">{symbol}</span>
        <span className="grow"></span>
        <span className="text-xl font-bold">{rankFull}</span>
      </div>
    </button>
  );
}

function EmptySpot({ ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
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

function ClosedCard({ ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
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
  const { card, discardHasCards, draw } = useStock();

  if (!card) {
    return <EmptySpot disabled={!discardHasCards} onClick={draw} />;
  }

  return <ClosedCard onClick={draw} />;
}

function Discard() {
  const { card, select } = useDiscard();

  if (!card) {
    return <EmptySpot disabled />;
  }

  return <OpenCard card={card} onClick={select} />;
}

function Foundations() {
  const { foundations } = useFoundations();

  return (
    <>
      {foundations.map((i) => (
        <Foundation key={i} index={i}></Foundation>
      ))}
    </>
  );
}
interface FoundationProps {
  index: number;
}
function Foundation({ index }: FoundationProps) {
  const { card, move, canMove } = useFoundation(index);

  if (!card) {
    return <EmptySpot onClick={move} disabled={!canMove} />;
  }

  return <OpenCard card={card} onClick={move} disabled={!canMove} />;
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
  const { hasCards, canMoveToEmpty, moveToEmpty, closedCards, openCards } =
    useTableauColumn(index);

  if (!hasCards) {
    return <EmptySpot disabled={!canMoveToEmpty} onClick={moveToEmpty} />;
  }

  return (
    <Stack>
      {closedCards.map((card) => (
        <ClosedCard disabled key={card} />
      ))}
      {openCards.map(({ card, moveOrSelect }) => (
        <OpenCard card={card} key={card} onClick={moveOrSelect} />
      ))}
    </Stack>
  );
}

function Tableau() {
  const { tableau } = useTableau();

  return (
    <>
      {tableau.map((i) => (
        <TableauColumn key={i} index={i} />
      ))}
    </>
  );
}

function Hand() {
  const { cards } = useHand();

  return (
    <div className="absolute bottom-0 overflow-hidden">
      <div className="relative -bottom-36">
        <Stack>
          {cards.map((card) => (
            <OpenCard card={card} key={card} disabled />
          ))}
        </Stack>
      </div>
    </div>
  );
}

function Undo() {
  const { canUndo, undo } = useUndo();

  return (
    <button
      type="button"
      disabled={!canUndo}
      className={clsx(
        "w-full rounded border border-gray-600 bg-gray-700 p-1 text-xl text-gray-100",
        canUndo
          ? "transition-transform duration-100 hover:scale-110 hover:shadow-2xl active:scale-105"
          : "opacity-50",
      )}
      onClick={undo}
    >
      <span className="-ml-2">◀</span>
    </button>
  );
}

/**
 *
 */
interface ToranpuProps {
  seed?: string;
  onWin?: () => void;
}

/**
 * The main Toranpu component. Renders the full game. This must be used as a
 * standalone component (it should not be wrapped in a ToranpuProvider).
 *
 * @category Components
 *
 * @param toranpuProps The props for the Toranpu component
 * @returns
 */
export function Toranpu({ seed, onWin }: ToranpuProps): JSX.Element {
  return (
    <ToranpuProvider seed={seed} onWin={onWin}>
      <div className="toranpu-react flex h-screen items-start justify-center">
        <div className="grid grid-cols-7 grid-rows-[auto,auto] items-start gap-4 gap-y-16 p-4">
          <Stock />
          <Discard />
          <div className="p-1">
            <Undo />
          </div>
          <Foundations />
          <Tableau />
        </div>
        <Hand />
      </div>
    </ToranpuProvider>
  );
}
