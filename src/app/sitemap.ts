import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://cesafiesportsleague.com',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: 'https://cesafiesportsleague.com/schedule',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
    ]
}