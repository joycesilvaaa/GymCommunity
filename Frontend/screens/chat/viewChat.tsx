import { Layout } from "@/components/layout";
import { NavigationProps } from "@/interfaces/navigation";
import { Text, View } from "react-native";

function ViewChat({navigation}: NavigationProps) {
  return (
    <Layout navigation={navigation}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chat View</Text>
      </View>
    </Layout>
  );
}

export default ViewChat;