import { GraphQLClient } from 'graphql-request';

interface Episode {
    uuid: string;
    name: string;
    description: string;
    audioUrl: string;
    videoUrl: string;
    datePublished: string;

}

interface Podcast {
    uuid: string;
    name: string;
    description: string;
    imageUrl: string;
    itunesId: string;
    itunesInfo: {
        uuid: string;
        publisherName: string;
        baseArtworkUrlOf: string;
    };
    episodes: Episode[];
}

export default async function getPodcast(name: string): Promise<Podcast | null> {
    const podName = decodeURIComponent(name);
    const endpoint = process.env.NEXT_PUBLIC_TADDY_URL;
    if (!endpoint) {
      throw new Error("TADDY_URL environment variable is not set");
    }
    const headers: Record<string, string | undefined> = {
      "Content-Type": "application/json",
      "X-USER-ID": process.env.NEXT_PUBLIC_TADDY_USER_ID,
      "X-API-KEY": process.env.NEXT_PUBLIC_TADDY_API_KEY
    };
    
    const graphQlClient = new GraphQLClient(endpoint, {
      headers: headers as HeadersInit, // Explicitly cast headers to HeadersInit
    });
    
    const query = `
    query GetPodcastSeries($podName: String!) {
        getPodcastSeries(name: $podName) {
            uuid
            name
            description
            imageUrl
            itunesId
            itunesInfo {
                uuid
                publisherName
                baseArtworkUrlOf(size: 640)
            }
            episodes {
                uuid
                name
                description
                audioUrl
                videoUrl
                datePublished
            }
        }
    }
    `;
    try {
        const data = await graphQlClient.request<{ getPodcastSeries: Podcast }>(query, { podName });
        return data.getPodcastSeries;
    } catch (error) {
        console.error('Error fetching podcast series:', error);
        return null;
    }
}
