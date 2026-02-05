export interface Memory {
  id: number;
  date?: string;
  title: string;
  intro: string;
  images: string[];
  caption?: string;
}
function generateImageUrl(id: number) {
  return `https://picsum.photos/200/300?random=${id}`;
}

/**
 * A 10-page short story: "The Garden at the Edge of Town"
 * Each memory is one page in the book, with dates spanning spring to autumn.
 */
export const memories: Memory[] = [
  {
    id: 1,
    date: "2024-03-15",
    title: "The Fence",
    intro:
      "I first noticed the garden on a damp March morning. A low wooden fence, weathered and leaning, marked the boundary between the lane and something wilder. Beyond it, the grass was already greening.",
    images: [generateImageUrl(1)],
  },
  {
    id: 2,
    date: "2024-04-22",
    title: "Daffodils",
    intro:
      "By April the daffodils had come up in clumps—bright yellow against the old stone wall. I started walking past the garden on purpose, just to see what would bloom next.",
    images: [generateImageUrl(2)],
  },
  {
    id: 3,
    date: "2024-05-08",
    title: "The Gate",
    intro:
      "One evening the gate was ajar. I pushed it open and stepped inside. No one shouted; no dog ran out. Only the hum of bees and the smell of lilac.",
    images: [generateImageUrl(3)],
  },
  {
    id: 4,
    date: "2024-06-12",
    title: "The Bench",
    intro:
      "I found a bench under the apple tree, paint flaking, slats warm in the sun. I sat there with a book I never opened and watched the light move across the roses.",
    images: [generateImageUrl(4)],
  },
  {
    id: 5,
    date: "2024-07-03",
    title: "First Rain",
    intro:
      "Summer rain caught me in the garden. I sheltered under the old shed roof and listened to it drum on the leaves. When it stopped, everything smelled of earth and lavender.",
    images: [generateImageUrl(5)],
  },
  {
    id: 6,
    date: "2024-08-19",
    title: "The Note",
    intro:
      'Tucked under a flowerpot was a note: "If you’re reading this, you’re welcome here. The garden has missed company." No name, no date. I folded it and kept it in my pocket.',
    images: [generateImageUrl(6)],
  },
  {
    id: 7,
    date: "2024-09-01",
    title: "Harvest",
    intro:
      "I picked the last of the tomatoes and left a basket by the bench. Next day it was gone, replaced by a jar of honey and a sprig of rosemary. I understood then: the garden had a keeper.",
    images: [generateImageUrl(7)],
  },
  {
    id: 8,
    date: "2024-09-28",
    title: "Meeting",
    intro:
      'I finally met her—white hair, dirt under her nails, kneeling by the asters. "So you’re the one who’s been sitting on my bench," she said. She smiled. "I’m glad."',
    images: [generateImageUrl(8)],
  },
  {
    id: 9,
    date: "2024-10-15",
    title: "Seeds",
    intro:
      'She gave me a brown paper envelope full of seeds. "For next spring," she said. "Plant them wherever you like. The garden doesn’t end at the fence."',
    images: [generateImageUrl(9)],
  },
  {
    id: 10,
    date: "2024-11-02",
    title: "The Garden at the Edge of Town",
    intro:
      "Winter is coming. The bench is empty now, the gate closed. But I have the seeds, and I know the way back. Some places wait for you. This one did.",
    images: [generateImageUrl(10)],
  },
];

export const PAGE_THICKNESS_UNIT = 0.5;
