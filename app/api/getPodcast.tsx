import { GraphQLClient } from 'graphql-request';

interface Episode {
    uuid: string;
    name: string;
    description: string;
    audioUrl: string;
    videoUrl: string;
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
    const endpoint = "https://api.taddy.org";
    const graphQlClient = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": "1455",
          "X-API-KEY": "eeec2320e07f826675d98bd8a9e9b66f67fe3b1793087c9e8a3f55489068937d0e094e5d511236d4cdac62312faa04461a"
        },
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
