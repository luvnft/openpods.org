import { GraphQLClient, gql } from 'graphql-request';

const endpoint = "https://api.taddy.org";
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
  const graphQlClient = new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": "1455",
      "X-API-KEY": "eeec2320e07f826675d98bd8a9e9b66f67fe3b1793087c9e8a3f55489068937d0e094e5d511236d4cdac62312faa04461a"
    }
  });

  try {
    const data: { getTopChartsByCountry: { podcastSeries: Podcast[] } } = await graphQlClient.request(query);
    return data.getTopChartsByCountry.podcastSeries;
  } catch (error) {
    console.error("Error fetching top podcasts:", error);
    throw error;
  }
}
