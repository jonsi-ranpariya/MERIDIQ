const noDepth = ["white", "black", "transparent"];

function getClass(prop: string, color: string, depth: string | number | undefined, defaultDepth: number) {
  if (noDepth.includes(color)) {
    return `${prop}-${color}`;
  }
  return `${prop}-${color}-${depth || defaultDepth}`;
}

export default function utils(color: string, defaultDepth = 500) {
  return {
    bg: (depth?: string | number) => getClass("bg", color, depth, defaultDepth),
    border: (depth?: string | number) => getClass("border", color, depth, defaultDepth),
    txt: (depth?: string | number) => getClass("text", color, depth, defaultDepth),
    caret: (depth?: string | number) => getClass("caret", color, depth, defaultDepth)
  };
}

export class ClassBuilder {
  defaults: any;
  classes: any;
  constructor(classes: string | Function, defaultClasses: any) {
    this.defaults =
      (typeof classes === "function" ? classes(defaultClasses) : classes) ||
      defaultClasses;

    this.classes = this.defaults;
  }

  flush() {
    this.classes = this.defaults;

    return this;
  }

  extend(...fns: any[]) {
    return this;
  }

  get() {
    return this.classes;
  }

  replace(classes: any, cond = true) {
    if (cond && classes) {
      this.classes = Object.keys(classes).reduce(
        (acc, from) => acc.replace(new RegExp(from, "g"), classes[from]),
        this.classes
      );
    }

    return this;
  }

  remove(classes: string, cond = true) {
    if (cond && classes) {
      this.classes = classes
        .split(" ")
        .reduce(
          (acc: string, cur: string | RegExp) => acc.replace(new RegExp(cur, "g"), ""),
          this.classes
        );
    }

    return this;
  }

  add(className: string | Function | undefined, cond = true, defaultValue?: any) {
    if (!cond || !className) return this;

    switch (typeof className) {
      case "string":
      default:
        this.classes += ` ${className} `;
        return this;
      case "function":
        this.classes += ` ${className(defaultValue || this.classes)} `;
        return this;
    }
  }
}

const defaultReserved = ["class", "add", "remove", "replace", "value"];

export function filterProps(reserved: any, props: { [x: string]: any; }) {
  const r = [...reserved, ...defaultReserved];

  return Object.keys(props).reduce(
    (acc, cur) =>
      cur.includes("$$") || cur.includes("Class") || r.includes(cur)
        ? acc
        : { ...acc, [cur]: props[cur] },
    {}
  );
}