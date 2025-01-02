import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://cesafiesportsleague.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: 'https://cesafiesports.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1
        },
        {
            url: 'https://cesafiesportsleague.vercel.app/schedule',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: 'https://cesafiesports.vercel.app/schedule',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        }
    ]
}