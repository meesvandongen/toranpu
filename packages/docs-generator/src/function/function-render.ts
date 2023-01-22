import { FunctionProp, PropKind } from "@structured-types/api";

function functionPropToMd(functionProp: FunctionProp) {
  return `## \`${functionProp.name}\`

${functionProp.description}

${remarks(functionProp)}

${generalExample(functionProp)}

${parameters(functionProp)}

${returns(functionProp)}

${examples(functionProp)}`;
}

function generalExample(funtionProp: FunctionProp) {
  return `\`\`\`ts
import { ${funtionProp.name} } from "${globalThis.packageName}";

${funtionProp.name}(${funtionProp
    .parameters!.map((param) => param.name)
    .join(", ")})
\`\`\``;
}

function parameters(functionProp: FunctionProp) {
  const params = functionProp.parameters!;
  if (!params.length) {
    return "";
  }
  return `### Arguments

${params
  .map(
    (param) =>
      `- \`${param.name}\` (*${PropKind[param.kind!]}*): ${param.description}`,
  )
  .join("\n")}
`;
}

function returns(functionProp: FunctionProp) {
  const returns = functionProp["returns"];
  if (!returns) {
    return "";
  }
  return `### Returns

(*${PropKind[returns.kind!]}*) ${returns.description}`;
}

function remarks(functionProp: FunctionProp) {
  const remarkTags =
    functionProp.tags?.filter((tag) => tag.tag === "remarks") ?? [];
  if (!remarkTags.length) {
    return "";
  }
  return `<details><summary>More Info</summary>
<p>

${remarkTags.map((tag) => tag.content).join("\n\n")}

</p>
</details>
`;
}

function examples(functionProp: FunctionProp) {
  const exampleTags = functionProp.examples ?? [];
  if (!exampleTags.length) {
    return "";
  }
  return `### Examples

${exampleTags.map((tag) => tag.content).join("\n\n")}`;
}

export function combineFunctionProps(functionProps: FunctionProp[]) {
  return functionProps.map(functionPropToMd).join("\n\n---\n");
}
