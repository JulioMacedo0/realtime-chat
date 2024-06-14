import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  View,
  Alert,
  TouchableOpacity,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/supabase/supabase";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from<Todo>("todos")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setTodos(data || []);
  };

  const addTodo = async () => {
    if (editingTodoId !== null) {
      await updateTodo();
    } else {
      const { error } = await supabase.from("todos").insert([
        {
          title: newTodo,
        },
      ]);

      if (error) {
        console.error(error);
        return;
      }
    }

    setNewTodo("");
    fetchTodos();
  };

  const updateTodo = async () => {
    const { error } = await supabase
      .from("todos")
      .update({ title: newTodo })
      .eq("id", editingTodoId);

    if (error) {
      console.error(error);
      return;
    }

    setEditingTodoId(null);
    setNewTodo("");
    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchTodos();
  };

  const toggleTodoCompletion = async (id: number, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchTodos();
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <ThemedView style={styles.todoContainer}>
      <TouchableOpacity
        onPress={() => toggleTodoCompletion(item.id, item.completed)}
      >
        <ThemedText style={{ color: item.completed ? "#aaa" : "#000" }}>
          {item.title}
        </ThemedText>
      </TouchableOpacity>
      <Button title="Edit" onPress={() => editTodo(item)} />
      <Button title="Delete" onPress={() => deleteTodo(item.id)} />
    </ThemedView>
  );

  const editTodo = (todo: Todo) => {
    setNewTodo(todo.title);
    setEditingTodoId(todo.id);
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.todoList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="New Todo"
        />
        <Button
          title={editingTodoId !== null ? "Update" : "Add"}
          onPress={addTodo}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  todoList: {
    flex: 1,
    marginBottom: 16,
  },
  todoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
});
