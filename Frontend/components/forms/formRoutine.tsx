import { Button, Center, Input, Row, Stack, Text, View, VStack, Flex } from 'native-base';
import React from 'react';
import { useState } from 'react';
import { ItemInput } from '@/components/item/itemInput';
import { MaterialIcons } from '@expo/vector-icons';

interface FormProps {
    type: "training" | "menu";
  }

interface Item {
    name: string;
    quantity?: string;
    repetitions?: string;
    restTime?: string;
  }

export function FormRoutine({ type }: FormProps): JSX.Element {
   const [items, setItems] = useState<Item[]>([]);

  function handleAddItem(newItem: Item) {
    setItems([...items, newItem]);
  }

  return (
    <View p={4}>
      <Center>
        <Stack space={2} w="100%" alignItems="center">
          <Text fontSize="xl" color="indigo.600" fontWeight="bold">
            {type === "training" ? "CRIAR TREINO" : "CRIAR MENU"}
          </Text>
          <ItemInput type={type} onAdd={handleAddItem} />          
          <VStack space={1} w="90%">
            {items.map((item, index) => (
              <Flex key={index} p={2} borderWidth={1} borderColor="gray.300" borderRadius="md" direction="row" align="center" justify="space-between">
                <VStack>
                  <Text fontWeight="bold">{item.name}</Text>
                  {type === "training" ? (
                    <>
                      <Text>Repetições: {item.repetitions}</Text>
                      <Text>Descanso: {item.restTime}s</Text>
                    </>
                  ) : (
                    <Text>Quantidade: {item.quantity}</Text>
                  )}
                </VStack>
                <Button colorScheme="red" onPress={() => {
                    const newItems = items.filter((_, i) => i !== index);
                    setItems(newItems);
                }} leftIcon={<MaterialIcons name="delete" color="white" />}>
                </Button>
              </Flex>
            ))}
          </VStack>
            {
                items.length === 0 ?(
                <Button colorScheme="indigo" size={"sm"} variant={"outline"} w="90%">
                    Voltar
                </Button>
                ) :(
                <Button colorScheme="indigo" variant={"solid"} w="90%" size={"sm"}>
                    Salvar
                </Button>
                )
            }
        </Stack>
      </Center>
    </View>
  );
}