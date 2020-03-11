import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_TODO, UPDATE_TODO } from "../data/mutations";
import { GET_TODOS } from "../data/queries";

const TodoItem = ({ item }) => {
    const { id, text, completed } = item;
    const [
        updateTodo,
        { loading: updateLoading, error: updateError }
    ] = useMutation(UPDATE_TODO);
    const [
        deleteTodo,
        { loading: deleteLoading, error: deleteError }
    ] = useMutation(DELETE_TODO);

    if (updateError) return <Text>`Error! ${updateError.message}`</Text>;
    if (deleteError) return <Text>`Error! ${deleteError.message}`</Text>;

    return (
        <View style={styles.container}>
            <Text
                style={[styles.icon, completed ? styles.completed : {}]}
                onPress={() => {
                    if (!updateLoading) {
                        updateTodo({
                            variables: { id, completed: !completed }
                        });
                    }
                }}
            >
                {completed ? "✅" : "❌"}
            </Text>
            <Text style={[styles.item, completed ? styles.completed : {}]}>
                {text}
            </Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    if (!deleteLoading) {
                        deleteTodo({
                            variables: { id },
                            refetchQueries: [{ query: GET_TODOS }]
                        });
                    }
                }}
            >
                <Text style={styles.buttonText}>🗑</Text>
            </TouchableOpacity>    
        </View>
    );
};

TodoItem.propTypes = {
    item: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center"
    },
    icon: {
        fontSize: 30
    },
    item: {
        padding: 10,
        fontSize: 24
    },
    completed: {
        color: "lightgray"
    }
});

export default TodoItem;