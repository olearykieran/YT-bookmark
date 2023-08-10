/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getBookmark = /* GraphQL */ `
  query GetBookmark($id: ID!) {
    getBookmark(id: $id) {
      id
      url
      timestamp
      title
      note
      version
      lastChangedAt
      isDeleted
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listBookmarks = /* GraphQL */ `
  query ListBookmarks(
    $filter: ModelBookmarkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listBookmarks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        url
        timestamp
        title
        note
        version
        lastChangedAt
        isDeleted
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
