"use client";

import { VeyraChat } from "./VeyraChat";

/** Always bundle chat with the client shell  -  no dynamic import (breaks on some tunnels). */
export function VeyraChatLoader() {
  return <VeyraChat />;
}
