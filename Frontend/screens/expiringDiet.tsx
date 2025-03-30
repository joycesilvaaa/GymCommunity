import { ExpiringDietCard } from "@/components/card/customExpiringDiet";
import { Layout } from "@/components/layout";
import { Text, View } from "react-native";
import { NavigationProp } from '@react-navigation/native';

type ExiringDietsProps = {
  navigation: NavigationProp<any>;
};

export function ExpiringDiet({ navigation }: ExiringDietsProps) {  
    const dietList = [
        {
            title: "Keto Diet",
            description: "Low carb, high fat diet",
            screen: "KetoScreen",
            dietId: "1",
            userId: "1",
        },
        {
            title: "Vegan Diet",
            description: "Plant-based diet",
            screen: "VeganScreen",
            dietId: "diet002",
            userId: "user002",
        },
        {
            title: "Mediterranean Diet",
            description: "Rich in fruits, vegetables, and healthy fats",
            screen: "MediterraneanScreen",
            dietId: "diet003",
            userId: "user003",
        },
    ];

    return (
        <Layout navigation={navigation}>  
            <View style={{ flex: 1, margin: 5, padding: 1 }}> 
                {dietList.map((diet, index) => (
                    <ExpiringDietCard
                        key={index}
                        title={diet.title}
                        description={diet.description}
                        navigation={navigation}
                        screen={diet.screen}
                        dietId={diet.dietId.toString()}
                        iconName="restaurant"
                        userId={diet.userId.toString()}
                    />
                ))}
            </View>
        </Layout>
    );
}