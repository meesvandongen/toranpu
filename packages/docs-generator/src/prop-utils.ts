import { FunctionProp, PropType, PropTypes } from "@structured-types/api";
import { exists } from "./utils";

export function getAllProps(docObject: PropTypes): PropType[] {
  const { __helpers, __diagnostics, ...propTypes } = docObject;

  const allProps = Object.values(propTypes);
  return allProps;
}

export function sortProps(a: PropType, b: PropType) {
  const nameA = a.name ?? "";
  const nameB = b.name ?? "";

  if (nameA ?? "" < nameB ?? "") {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

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
  if (!functionItem.returns.description) {
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
  const validationErrors = functionProps
    .map(validateFunctionProp)
    .filter(Boolean);

  if (validationErrors.length) {
    console.error(validationErrors);
    process.exit(1);
  }
}

export function findAllCategories(props: PropType[]) {
  return props
    .flatMap((item) => item.tags)
    .filter(exists)
    .filter((tag) => tag.tag === "category")
    .map((tag) => tag.content)
    .filter(exists)
    .reduce((acc, cur) => {
      if (!acc.includes(cur)) {
        acc.push(cur);
      }
      return acc;
    }, [] as string[]);
}

export function hasCategory(category: string, propType: PropType): boolean {
  if (!propType.tags) {
    return false;
  }

  return propType.tags.some(
    (tag) => tag.tag === "category" && tag.content === category,
  );
}
