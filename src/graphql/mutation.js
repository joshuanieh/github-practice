import { gql } from 'apollo-boost'

export const CREATE_MESSAGE_MUTATION = gql`
  mutation($input: CreateMessageInput!){
    createMessage(input: $input) {
      emitter
      collector
      body
    }
  }`