import gql from "graphql-tag";

export const INSERT_USERS = gql`
    mutation($id: String, $name: String) {
        insert_users(objects: [{ id: $id, name: $name }]) {
            affected_rows
        }
    }
`;

export const INSERT_TODO = gql`
    mutation($text: String!) {
        insert_todos(objects: { text: $text }) {
            affected_rows
            returning {
                id
                text
                completed
            }
        }
    }
`;

export const UPDATE_TODO = gql`
    mutation($id: Int, $completed: Boolean) {
        update_todos(
            where: { id: { _eq: $id } }
            _set: { completed: $completed }
        ) {
            affected_rows
            returning {
                id
                completed
            }
        }
    }
`;

export const DELETE_TODO = gql`
    mutation($id: Int) {
        delete_todos(
            where: { id: { _eq: $id } }
        ) {
            affected_rows
        }
    }
`;