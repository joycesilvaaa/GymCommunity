import { VStack, Spinner, Text } from "native-base";

function Loading() {
  return (
    <VStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" color="indigo.600" />
          <Text mt={4} color="coolGray.600">
            Carregando...
          </Text>
        </VStack>
  );
}
export default Loading;