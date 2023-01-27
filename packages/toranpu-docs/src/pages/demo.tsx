import React from "react";
import { Toranpu } from "toranpu-react";
import "!style-loader!css-loader!toranpu-react/dist/index.css";
import Layout from "@theme/Layout";

export default function Index() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <div style={{ background: "#166534" }}>
        <Toranpu />
      </div>
    </Layout>
  );
}
