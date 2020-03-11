import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import TodoItem from "./TodoItem";
import { GET_TODOS } from "../data/queries";

const TodoList = () => {
    const { loading, error, data } = useQuery(GET_TODOS);

    if (error) return <Text>`Error! ${error.message}`</Text>;

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={data.todos}
                    renderItem={({ item }) => <TodoItem item={item} />}
                    keyExtractor={ item => item.id.toString()}
                />
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        height: 500,
        width: 300
    }
});

export default TodoList;