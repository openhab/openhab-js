/// <reference path="../src/globals.d.ts" />

// Manually written type definitions to avoid problems with lazy loading in index.js
export const log: typeof import("./log");
export const rules: typeof import("./rules");
export const items: typeof import("./items/items");
export const things: typeof import("./things");
export const triggers: typeof import("./triggers");
export const actions: typeof import("./actions/actions");
export const utils: typeof import("./utils");
export const osgi: typeof import("./osgi");
export const cache: typeof import("./cache");
export const time: typeof import("./time");
export const Quantity: typeof import("./quantity").getQuantity;
export const QuantityClass: typeof import("./quantity").Quantity;
export const environment: typeof import("./environment");
export {};
