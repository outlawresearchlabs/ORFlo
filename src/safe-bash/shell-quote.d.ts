declare module 'shell-quote' {
  interface ParsedEntry {
    op: string;
  }

  export function parse(input: string): (string | ParsedEntry)[];
}