import { gql } from 'apollo-boost'

export const CREATE_MESSAGE_MUTATION = gql`
  mutation createMessage(
    $emitter: String!
    $collector: String!
    $body: String!
  ) {
    createMessage(input: {emitter: $emitter, collector: $collector, body: $body}) {
      emitter
      collector
      body
    }
  }`