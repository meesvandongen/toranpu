import satori from "satori";
import sharp from "sharp";
import fs from "fs/promises";

const svg = await satori(<div style={{ color: "black" }}>hello, world</div>, {
  width: 600,
  height: 400,
  fonts: [
    {
      name: "Roboto",
      // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
      data: await fs.readFile(
        "./node_modules/@fontsource/roboto/files/roboto-all-500-normal.woff",
      ),
      weight: 400,
      style: "normal",
    },
  ],
});

const svgBuffer = Buffer.from(svg);

const png = await sharp(svgBuffer, { density: 300 }).png().toBuffer();

await fs.writeFile("card.png", png);
