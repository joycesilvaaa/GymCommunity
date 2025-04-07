import { ExpiringDietCard } from "@/components/card/customExpiringDiet";
import { Layout } from "@/components/layout";
import { Text, View } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { CustomNavigationProp } from "@/interfaces/navigation";
import routes from "@/api/api";
import { IExpiringDiet } from "@/interfaces/diet";
import { useState, useEffect } from "react";

export function ExpiringDiet({ navigation }: CustomNavigationProp) {  
    const [dietList, setDietList] = useState<IExpiringDiet[]>([]);

    useEffect(() => {
        getExpiringDiet();
    }, []);
    async function getExpiringDiet() {
        try {
            const response = await routes.expiringDiet();
            setDietList(response.data.data);
        }
        catch (error) {
            console.error('Error fetching diets:', error);
        }
    }

    return (
        <Layout navigation={navigation}>  
            <View style={{ flex: 1, margin: 5, padding: 1 }}> 
                {dietList.map((diet, index) => (
                    <ExpiringDietCard
                        key={index}
                        title={diet.title}
                        description={diet.description}
                        navigation={navigation}
                        dietId={diet.diet_id.toString()}
                        iconName="restaurant"
                        userId={diet.user_id.toString()}
                    />
                ))}
            </View>
        </Layout>
    );
}