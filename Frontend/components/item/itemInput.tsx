import { MaterialIcons } from "@expo/vector-icons";
import { Button, Center, Input, Stack, Text, View, VStack, IconButton, Icon } from "native-base";
import React, { useState } from "react";

interface ItemInputProps {
    type: "training" | "menu";
    onAdd: (item: { name: string; quantity?: string; repetitions?: string; restTime?: string }) => void;
  }
  
export function ItemInput({ type, onAdd }: ItemInputProps) {
    const [item, setItem] = useState({ name: "", quantity: "", repetitions: "", restTime: "" });
  
    const handleAddItem = () => {
      if (!item.name) return;
      onAdd(item);
      setItem({ name: "", quantity: "", repetitions: "", restTime: "" });
    };
  
    return (
      <VStack space={3} w="90%">
        <Input
          placeholder={type === "training" ? "Nome do Exercício" : "Nome do Alimento"}
          value={item.name}
          onChangeText={(text) => setItem({ ...item, name: text })}
        />
  
        {type === "training" ? (
          <>
            <Input
              placeholder="Repetições"
              value={item.repetitions}
              onChangeText={(text) => setItem({ ...item, repetitions: text })}
            />
            <Input
              placeholder="Tempo de Descanso (s)"
              value={item.restTime}
              onChangeText={(text) => setItem({ ...item, restTime: text })}
            />
          </>
        ) : (
          <Input
            placeholder="Quantidade"
            value={item.quantity}
            onChangeText={(text) => setItem({ ...item, quantity: text })}
          />
        )}
  
        <Button colorScheme="indigo" variant={"solid"} size={"sm"} onPress={handleAddItem}>
            Adicionar          
        </Button>
      </VStack>
    );
  }