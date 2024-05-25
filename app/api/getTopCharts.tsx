import { GraphQLClient, gql } from 'graphql-request';

const query = gql`
  query getTopChartsByCountry {
    getTopChartsByCountry(taddyType:PODCASTSERIES, country:UNITED_STATES_OF_AMERICA){
      topChartsId
      podcastSeries{
        uuid
        name
        imageUrl
        description
      }
      podcastEpisodes{
        uuid
        name
        podcastSeries{
          uuid
          name
        }
      }
    }
  }
`;

interface Podcast {
  uuid: string;
  name: string;
  imageUrl: string;
  rssUrl: string;
  description: string;
}

export default async function getTopCharts(): Promise<Podcast[]> {
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
  
  

  try {
    const data: { getTopChartsByCountry: { podcastSeries: Podcast[] } } = await graphQlClient.request(query);
    return data.getTopChartsByCountry.podcastSeries;
  } catch (error) {
    console.error("Error fetching top podcasts:", error);
    throw error;
  }
}
