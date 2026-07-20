export type MathChallenge = { a: number; b: number; answer: number };

/** Simple human check — random addends refresh on each load / failed attempt. */
export function newMathChallenge(): MathChallenge {
  const a = 2 + Math.floor(Math.random() * 10); // 2–11
  const b = 2 + Math.floor(Math.random() * 10); // 2–11
  return { a, b, answer: a + b };
}

export function checkMathAnswer(input: string, challenge: MathChallenge): boolean {
  const parsed = Number.parseInt(input.trim(), 10);
  return Number.isFinite(parsed) && parsed === challenge.answer;
}

export function mathChallengeLabel(challenge: MathChallenge): string {
  return `Verification — what is ${challenge.a} + ${challenge.b}?`;
}
