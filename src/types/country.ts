export interface Country {
  name: { common: string };
  idd: { root: string; suffixes: string[] };
  cca2: string;
  flags: { svg: string };
}
