export type Stanza = {
  lines: string[];
  art: string;
};

export type Poem = {
  id: string;
  title: string;
  stanzas: Stanza[];
};

export const poems: Poem[] = [
  {
    id: "moon",
    title: "Night Window",
    stanzas: [
      {
        lines: ["The moon leans on the glass", "and waits for me to sleep."],
        art: String.raw`
      _..._
    .::::::.
   :::::::::
   '::::::'
     '""'`,
      },
      {
        lines: ["Somewhere a clock forgets", "the number that comes next."],
        art: String.raw`
     .-"""""-.
    /  12     \
   | 9   o  3 |
    \    6    /
     '-.....-'`,
      },
    ],
  },
  {
    id: "sea",
    title: "Low Tide",
    stanzas: [
      {
        lines: ["The sea pulls back its hands", "and shows what it has kept."],
        art: String.raw`
   ~  ~~   ~   ~~  ~
 ~~   ~  ~~~  ~   ~~
   ~~    ~~     ~  ~
 ~    ~~    ~~~   ~~`,
      },
      {
        lines: ["A shell, a coin, a name", "written small in sand."],
        art: String.raw`
       ___
     .'   '.
    /  .-.  \
   |  (   )  |
    \  '-'  /
     '-...-'`,
      },
    ],
  },
];
