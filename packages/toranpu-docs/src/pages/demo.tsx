import React from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";

export default function Index() {
  return (
    <Layout title="Demo" description="Toranpu Demo">
      <div style={{ background: "#166534" }}>
        <BrowserOnly fallback={<div>Loading...</div>}>
          {() => {
            const { Toranpu } = require("toranpu-react");
            require("!style-loader!css-loader!toranpu-react/dist/index.css");
            return (
              <Toranpu
                onWin={() => {
                  setTimeout(() => {
                    alert("You win!");
                  }, 1);
                }}
              />
            );
          }}
        </BrowserOnly>
      </div>
    </Layout>
  );
}
