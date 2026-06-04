function getRandomUrl(type: string) {
  const randomNumber = Math.round(Math.random() * 10000);

  return `https://picsum.photos/seed/${type}-${randomNumber}/1920/1080`;
}

const projects = [
  {
    id: 0,
    slug: "digital-ocean",
    title: "Digital Ocean",
    description: "A virtual diving exprerience through digital oceans.",
    images: Array(4)
      .fill(null)
      .map((_) => getRandomUrl("ocean")),
  },
  {
    id: 1,
    slug: "cosmic-visualizer",
    title: "Cosmic Visualizer",
    description: "Interactive visualization of astronomical data.",
    images: Array(4)
      .fill(null)
      .map((_) => getRandomUrl("cosmic")),
  },
  {
    id: 2,
    slug: "smart-controller",
    title: "Smart Controller",
    description: "Centralized system for managing smart home devices.",
    images: Array(4)
      .fill(null)
      .map((_) => getRandomUrl("home-devices")),
  },
];

console.log(projects);

export type Project = (typeof projects)[number];

export default projects;
