import {
  FunctionProp,
  PropKind,
  PropType,
  PropTypes,
} from "@structured-types/api";
import { exists } from "./utils";

export function getAllProps(docObject: PropTypes): PropType[] {
  const { __helpers, __diagnostics, ...propTypes } = docObject;

  const allProps = Object.values(propTypes);
  return allProps;
}

export function sortProps(a: PropType, b: PropType) {
  const nameA = a.name ?? "";
  const nameB = b.name ?? "";

  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
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
