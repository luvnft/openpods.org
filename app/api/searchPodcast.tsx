import { GraphQLClient, gql } from 'graphql-request';

export default async function searchPodcasts(term: string) {
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
