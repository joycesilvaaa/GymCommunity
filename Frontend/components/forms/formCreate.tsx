import { useState } from 'react';
import {
    Input,
    View,
    Button,
    Icon,
    Pressable,
    Text,
    VStack,
    Select,
} from 'native-base';
import { NavigationProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { UserProfile } from '@/enum';
import { ICreateUser } from '@/interfaces/user';
import routes from '@/api/api';
import { LogBox } from 'react-native';
import {  validarCPF } from '@/utils';
interface FormCreateProps {
    type: 'profissional' | 'cliente';
    navigation: NavigationProp<any>;
}

export function FormCreate({ type, navigation }: FormCreateProps) {
    const [selectedProfession, setSelectedProfession] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [show, setShow] = useState<boolean>(false);
    const [showConfirmPassword, setConfirmShowPassword] = useState<boolean>(false);
    const [typeUser, setTypeUser] = useState<UserProfile | null>(
        type === 'profissional' ? null : UserProfile.CLIENT,
    );

    async function handleSubmit() {
        const is_aproved = validation();
        if (!is_aproved) {
            return;
        }
        if (!birthDate) {
            Alert.alert('Erro', 'A data de nascimento é obrigatória.');
            return;
        }
        const formData: ICreateUser = {
            name,
            email,
            password,
            birth_date: birthDate.toISOString().split('T')[0],
            cpf,
            user_profile: typeUser as UserProfile,
        };
        if (type === 'profissional') {
            formData.user_profile = Number(selectedProfession) as UserProfile;
        }
        try {
            await routes.registerUser(formData);
            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        } catch (error) {
            const errorMessage =
                error instanceof Error && error.message
                    ? error.message
                    : 'Ocorreu um erro ao realizar o cadastro. Tente novamente.';
            Alert.alert('Erro ao Realizar Cadastro', errorMessage);
        } finally {
            LogBox.ignoreAllLogs();
        }
    }

    function validation(): boolean {
        if (!name || !email || !birthDate || !password || !confirmPassword || !cpf) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios.');
            return false;
        }
        if (!isValidEmail(email)) {
            Alert.alert('Erro', 'O e-mail informado é inválido.');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Erro', 'As senhas não coincidem.');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
            return false;
        }
        if (type === 'profissional' && !selectedProfession) {
            Alert.alert('Erro', 'Selecione uma profissão.');
            return false;
        }
        if (cpf.length !== 11) {
            Alert.alert('Erro', 'O CPF deve ter 11 dígitos.');
            return false;
        }
        if (!validarCPF(cpf)) {
            Alert.alert('Erro', 'O CPF informado é inválido.');
            return false;
        }
        return true;
    }

    function onDateChange(event: any, selectedDate?: Date) {
        const currentDate = selectedDate || birthDate;
        setShowDatePicker(false);
        setBirthDate(currentDate);
    }

    function showDatePickerDialog() {
        setShowDatePicker(true);
    }
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    return (
        <View>
            <VStack w={'100%'} space={1}>
                <Text color="indigo.600" fontWeight={'bold'} marginTop={10}>
                    Cadastro
                </Text>
                {type === 'profissional' && (
                    <Select
                        selectedValue={selectedProfession}
                        minWidth="200"
                        accessibilityLabel="Selecione uma opção"
                        placeholder="Selecione uma opção"
                        onValueChange={(itemValue: string) => setSelectedProfession(itemValue)}
                    >
                        <Select.Item label="Selecione uma profissão" value="" />
                        <Select.Item label="Personal Trainer" value={String(UserProfile.PROFESSIONAL_PERSONAL)} />
                        <Select.Item label="Nutricionista" value={String(UserProfile.PROFESSIONAL_NUTRITIONIST)} />
                    </Select>
                )}
                <Input variant="outline" placeholder="Nome" value={name} onChangeText={setName} />
                <Input variant="outline" placeholder="Email" value={email} onChangeText={setEmail} />
                <Input
                    variant="outline"
                    placeholder="CPF"
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType="numeric"
                />
                <Input
                    variant="outline"
                    placeholder="Data de Nascimento"
                    value={birthDate ? birthDate.toLocaleDateString() : ''}
                    onFocus={showDatePickerDialog}
                />
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={birthDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onDateChange}
                    />
                )}
                <Input
                    type={show ? 'text' : 'password'}
                    InputRightElement={
                        <Pressable onPress={() => setShow(!show)}>
                            <Icon
                                as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />}
                                size={5}
                                mr="2"
                                color="indigo.600"
                            />
                        </Pressable>
                    }
                    placeholder="Senha"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    InputRightElement={
                        <Pressable onPress={() => setConfirmShowPassword(!showConfirmPassword)}>
                            <Icon
                                as={<MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} />}
                                size={5}
                                mr="2"
                                color="indigo.600"
                            />
                        </Pressable>
                    }
                    placeholder="Confirme a senha"
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                />
                <Button variant={'solid'} colorScheme={'indigo'} onPress={handleSubmit}>
                    Cadastre-se
                </Button>
                <Button
                    variant={'outline'}
                    colorScheme={'indigo'}
                    onPress={() => navigation.navigate('initial')}
                >
                    Voltar
                </Button>
            </VStack>
        </View>
    );
}
