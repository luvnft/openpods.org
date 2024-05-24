import { GraphQLClient, gql } from 'graphql-request';

export default async function searchPodcasts(term: string) {
  const endpoint = "https://api.taddy.org";
  const graphQlClient = new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
      "X-USER-ID": "1455",
      "X-API-KEY": "eeec2320e07f826675d98bd8a9e9b66f67fe3b1793087c9e8a3f55489068937d0e094e5d511236d4cdac62312faa04461a"
    },
  });

  const query = gql`
    query SearchForTerm($term: String!) {
      searchForTerm(term: $term, filterForTypes: PODCASTSERIES, includeSearchOperator: EXACT_PHRASE) {
        searchId
        podcastSeries {
          uuid
          name
          imageUrl
          rssUrl
          description
        }
      }
    }
  `;

  interface Data {
    searchForTerm: {
      searchId: string;
      podcastSeries: {
        uuid: string;
        name: string;
        rssUrl: string;
      }[];
    };
  }

  try {
    const data = await graphQlClient.request<Data>(query, {
      term: term
    });
    console.log("Data:");
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error searching for term:", error);
    throw error;
  }
}
