import { Modal } from 'native-base';
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
import {  validateCpf } from '@/utils';
import { useAuth } from '@/hooks/auth';
import { navigate } from 'expo-router/build/global-state/routing';

type InitialProps = {
  navigation: NavigationProp<any>;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export function ModalCreateUser({ navigation, modalVisible, setModalVisible }: InitialProps) {
  const typeUser = UserProfile.CLIENT
  const context = useAuth()
  const userId = context.user?.id;
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [cpf, setCpf] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState<boolean>(false);

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
        professional_id: userId
    };
    try {
        await routes.registerUser(formData);
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
            { text: 'OK', },
        ]);
        cleanFields();
        setModalVisible(false); // Ensure this updates the modalVisible state
        navigation.navigate('Home'); // Navigate to the Login screen after successful registration
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
function cleanFields() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCpf('');
    setBirthDate(undefined);
    setShowDatePicker(false);
    setShow(false);
    setConfirmShowPassword(false);
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
    if (cpf.length !== 11) {
        Alert.alert('Erro', 'O CPF deve ter 11 dígitos.');
        return false;
    }
    if (!validateCpf(cpf)) {
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
    <>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header _text={{ color: 'indigo.600' }}>Criar Novo Cliente</Modal.Header>
          <Modal.Body>
            <View style={{ flex: 1, margin: 2, padding: 1, justifyContent: 'center' }}>
              <Input
                variant="outline"
                placeholder="Nome"
                value={name}
                onChangeText={setName}
                mb={2}
              />
              <Input
                variant="outline"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                mb={2}
              />
              <Input
                variant="outline"
                placeholder="CPF"
                value={cpf}
                onChangeText={setCpf}
                keyboardType="numeric"
                mb={2}
              />
              <Input
                variant="outline"
                placeholder="Data de Nascimento"
                value={birthDate ? birthDate.toLocaleDateString() : ''}
                onFocus={showDatePickerDialog}
                mb={2}
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
                onChangeText={setPassword}
                mb={3}
              />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                InputRightElement={
                  <Pressable onPress={() => setConfirmShowPassword(!showConfirmPassword)}>
                    <Icon
                      as={
                        <MaterialIcons
                          name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                        />
                      }
                      size={5}
                      mr="2"
                      color="indigo.600"
                    />
                  </Pressable>
                }
                placeholder="Confirme a senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mb={3}
              />
            </View>
          </Modal.Body>
          <Modal.Footer>
            <View style={{ marginRight: 10 }}>
              <Button onPress={handleSubmit} colorScheme="indigo">
                Salvar
              </Button>
            </View>
            <Button
              variant={'outline'}
              colorScheme={'indigo'}
              onPress={() => setModalVisible(false)}
            >
              Voltar
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
