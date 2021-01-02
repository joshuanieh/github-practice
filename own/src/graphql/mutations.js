import { gql } from 'apollo-boost'

export const mutations = {
  createMessageMutation: gql`
    mutation($input: CreateMessageMutationInput!) {
      createMessage(input: $input){
        _id
        user
        receiver
        body
      }
    }
  `,
  deleteMyMessagesMutation: gql`
    mutation($input: DeleteMyMessagesMutationInput!) {
      deleteMyMessages(input: $input){
        _id
        user
        receiver
        body
      }
    }
  `
}
