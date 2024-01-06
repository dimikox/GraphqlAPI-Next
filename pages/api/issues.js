import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export default async function handler(req, res) {
  const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
  });

  const authLink = setContext(() => {
    return {
      headers: {
        authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const { cursor } = req.query; // Get the cursor from the query params

  try {
    const { data } = await client.query({
      query: gql`
        {
          repository(owner: "reactjs", name: "reactjs.org") {
            issues(first: 40, after: ${cursor ? `"${cursor}"` : null}) {
              edges {
                node {
                  title
                  number
                  createdAt
                  author {
                    login
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      `
    });
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
