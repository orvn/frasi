export interface Segment {
  text: string;
  match?: string;
}

const MARKUP = /\{(\d)([^}]*)\}|([^{]+)/g;

// Splits "{1How}'s it {2going}?" into plain text and numbered match segments
export function segment(text: string): Segment[] {
  const out: Segment[] = [];
  for (const m of text.matchAll(MARKUP)) {
    if (m[3] != null) out.push({ text: m[3] });
    else out.push({ text: m[2]!, match: m[1] });
  }
  return out;
}
