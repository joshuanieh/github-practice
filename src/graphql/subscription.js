import { gql } from 'apollo-boost'

export const MESSAGES_SUBSCRIPTION = gql`
  subscription($collector: String!) {
    message(collector: $collector) {
      data {
      	emitter
        collector
        body
      }
    }
  }`