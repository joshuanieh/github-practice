import { gql } from 'apollo-boost'

export const subscriptions = {
  messageSubscription: gql`
    subscription($input: MessageSubscriptionInput!) {
      message(input: $input) {
        mutation
        data {
          _id
          user
          receiver
          body
        }
      }
    }
  `
}
