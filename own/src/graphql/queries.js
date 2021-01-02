import { gql } from 'apollo-boost'

export const queries = {
  messageQuery: gql`
    query($input: MessageQueryInput!){
      message(input: $input) {
        _id
        user
        receiver
        body
      }
    }
  `
}
