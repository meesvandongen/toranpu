import { FunctionProp, PropKind } from "@structured-types/api";

export function validateFunctionProp(functionItem: FunctionProp) {
  if (!functionItem.parameters) {
    return `Item ${functionItem.name} has no parameters`;
  }
  if (!functionItem.parameters.some((param) => param.description)) {
    return `Item ${functionItem.name} has no parameter description`;
  }
  if (!functionItem.returns) {
    return `Item ${functionItem.name} has no return type`;
  }

  if (
    functionItem.returns.kind !== PropKind.Void &&
    !functionItem.returns.description
  ) {
    return `Item ${functionItem.name} has no return description`;
  }

  if (!functionItem.tags) {
    return `Item ${functionItem.name} has no tags`;
  }
  if (!functionItem.tags.some((tag) => tag.tag === "category")) {
    return `Item ${functionItem.name} has no category`;
  }
}

export function validateFunctionProps(functionProps: FunctionProp[]) {
  const validationProps = functionProps.filter(validateFunctionProp);

  validationProps.forEach((props) => {
    console.error(validateFunctionProp(props));
    console.dir(props, { depth: null });
  });

  if (validationProps.length) {
    process.exit(1);
  }
}
