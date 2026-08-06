import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: "https://www.kassetventures.com", lastModified, changeFrequency: "monthly", priority: 1 },
    { url: "https://www.kassetventures.com/ms", lastModified, changeFrequency: "monthly", priority: 0.9 },
  ];
}
