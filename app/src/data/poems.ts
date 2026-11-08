export type Poem = {
  id: string;
  title: string;
  text: string;
};

export const poems: Poem[] = [
  {
    id: "moon",
    title: "Night Window",
    text: `The moon leans on the glass
and waits for me to sleep.

Somewhere a clock forgets
the number that comes next.`,
  },
  {
    id: "sea",
    title: "Low Tide",
    text: `The sea pulls back its hands
and shows what it has kept.

A shell, a coin, a name
written small in sand.`,
  },
];
