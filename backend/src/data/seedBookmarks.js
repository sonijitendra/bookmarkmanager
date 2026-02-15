const { v4: uuidv4 } = require("uuid");

const seedBookmarks = [
  {
    id: uuidv4(),
    url: "https://developer.mozilla.org/en-US/",
    title: "MDN Web Docs",
    description: "Comprehensive web platform documentation and guides.",
    tags: ["docs", "web", "javascript"],
    createdAt: "2026-02-01T09:00:00.000Z"
  },
  {
    id: uuidv4(),
    url: "https://react.dev/",
    title: "React Documentation",
    description: "Official React documentation with examples and best practices.",
    tags: ["react", "frontend", "docs"],
    createdAt: "2026-02-02T11:15:00.000Z"
  },
  {
    id: uuidv4(),
    url: "https://expressjs.com/",
    title: "Express",
    description: "Fast, unopinionated web framework for Node.js.",
    tags: ["node", "backend", "express"],
    createdAt: "2026-02-03T07:30:00.000Z"
  },
  {
    id: uuidv4(),
    url: "https://vercel.com/docs",
    title: "Vercel Docs",
    description: "Documentation for deploying frontend and serverless workloads.",
    tags: ["deployment", "vercel", "docs"],
    createdAt: "2026-02-04T13:45:00.000Z"
  },
  {
    id: uuidv4(),
    url: "https://tailwindcss.com/docs",
    title: "Tailwind CSS",
    description: "Utility-first CSS framework docs and configuration guides.",
    tags: ["css", "tailwind", "frontend"],
    createdAt: "2026-02-05T16:10:00.000Z"
  }
];

module.exports = seedBookmarks;
