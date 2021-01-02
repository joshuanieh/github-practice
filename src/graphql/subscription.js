import { gql } from 'apollo-boost'

export const MESSAGES_SUBSCRIPTION = gql`
  subscription($collector: String!) {
    messages(collector: $collector) {
      mutation
      data {
      	emitter
        collector
        body
      }
    }
  }`