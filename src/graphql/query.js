import { gql } from 'apollo-boost'

export const MESSAGES_QUERY = gql`
  query($name: String!) {
    message(name: $name) {
      emitter
      collector
      body
    }
  }`