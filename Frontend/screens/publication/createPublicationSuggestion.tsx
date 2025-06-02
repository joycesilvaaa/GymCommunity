import { Layout } from "@/components/layout";
import { NavigationProps } from "@/interfaces/navigation";
import { Text } from "native-base";

function CreatePublicationSuggestion({navigation}: NavigationProps){
    return(
        <Layout navigation={navigation}>
            <Text fontSize="3xl" fontWeight="extrabold" textAlign="center" color="indigo.500" mb={6}>
                Progresso de Criação de Publicações
            </Text>
            <Text fontSize="md" textAlign="center" color="gray.600">
                Esta funcionalidade está em desenvolvimento e será lançada em breve!
            </Text>
        </Layout>
    )
}

export default CreatePublicationSuggestion;