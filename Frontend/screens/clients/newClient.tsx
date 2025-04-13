import { Layout } from '@/components/layout';
import { useAuth } from '@/hooks/auth';
import routes from '@/api/api';
import { UserProfile } from '@/enum';
import { ICreateUser, User } from '@/interfaces/user';
import { validateCpf } from '@/utils';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NavigationProps } from '@/interfaces/navigation';
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Heading,
  Icon,
  Input,
  Pressable,
  ScrollView,
  Text,
  VStack,
  HStack,
  useToast,
  Image,
  Avatar,
  Divider,
  IconButton,
  WarningOutlineIcon,
} from 'native-base';
import { Alert, LogBox } from 'react-native';

export function NewClient({ navigation }: NavigationProps) {
  const typeUser = UserProfile.CLIENT;
  const context = useAuth();
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [isAssociating, setIsAssociating] = useState(false);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [cpfExists, setCpfExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkCpf, setCheckCpf] = useState<string>('');

  const [findUser, setFindUser] = useState<boolean>(true);

  async function handleSubmit() {
    const newErrors: Record<string, string> = {};
    if (!validation(newErrors)) {
      return;
    }
    if (!birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';

    const formData: ICreateUser = {
      name,
      email,
      password,
      birth_date: (birthDate ?? new Date()).toISOString().split('T')[0],
      cpf,
      user_profile: typeUser as UserProfile,
      professional_id: userId,
    };
    try {
      await routes.registerUser(formData);
      toast.show({
        title: 'Sucesso',
        description: 'Cadastro realizado com sucesso!',
        bg: 'green.500',
      });
      cleanFields();
      navigation.navigate('Home');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar o cadastro.';
      toast.show({
        title: 'Erro',
        description: errorMessage,
        bg: 'red.500',
      });
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
    setErrors({});
  }

  function validation(newErrors: Record<string, string>): boolean {
    if (!name) newErrors.name = 'Nome é obrigatório';
    if (!email) newErrors.email = 'E-mail é obrigatório';
    if (!birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
    if (!password) newErrors.password = 'Senha é obrigatória';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    if (!cpf) newErrors.cpf = 'CPF é obrigatório';

    if (email && !isValidEmail(email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (password && password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (cpf && cpf.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    if (cpf && !validateCpf(cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  async function checkExistingCpf() {
    const formattedCpf = checkCpf.replace(/\D/g, ''); 
    if (!validateCpf(formattedCpf)) {
      setErrors({ ...errors, checkCpf: 'CPF inválido' });
      return;
    }

    setLoadingCheck(true);
    try {
      const response = await routes.userDetailsByCpf(formattedCpf);

      if (response.data.data) {
        setFoundUser(response.data.data);
        setFindUser(true);
        setIsLoading(true);
      } else {
        clearFindUser();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar CPF.';
      toast.show({
        title: 'Erro',
        description: errorMessage,
        bg: 'red.500',
      });
    } finally {
      setLoadingCheck(false);
    }
  }

  async function associateUserWithProfessional() {
    if (!foundUser) return;
    setIsAssociating(true);
    try {
      const response = await routes.associateClientWithProfissional(foundUser.id);
      if (response.status !== 200) {
        toast.show({
          title: 'Erro',
          description: response.data.detail,
          bg: 'red.500',
        });
        return;
      }
      toast.show({
        title: 'Sucesso',
        description: 'Usuário associado com sucesso!',
        bg: 'green.500',
      });
      cleanFields();
      navigation.navigate('ManangerClients');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao associar usuário.';
      toast.show({
        title: 'Erro',
        description: errorMessage,
        bg: 'red.500',
      });
    } finally {
      setIsAssociating(false);
    }
  }
  function clearFindUser() {
    setIsLoading(false);
    setFoundUser(null);
    setCheckCpf('');
    setCpfExists(false);
    setFindUser(false);
  }

  return (
    <Layout navigation={navigation}>
      <HStack alignItems="center" justifyContent="center" px={3} py={3} bg={'white'} space={1}>
        <Icon as={MaterialIcons} name="person-add" size={5} color="indigo.600" />
        <Text fontSize="lg" fontWeight="medium" color="indigo.600" textAlign="center">
          Cadastro de Cliente
        </Text>
      </HStack>
      <VStack px={3} py={4} bg="white" space={4}>
        <FormControl isInvalid={!!errors.checkCpf && checkCpf.length === 11}>
          <HStack space={3} alignItems="center">
            <Input
              flex={1}
              variant="outline"
              placeholder="Digite o CPF (11 dígitos)"
              value={checkCpf}
              height={12}
              onChangeText={(text) => {
                setCheckCpf(text);
                if (text.length === 11) {
                  setFindUser(true);
                  setCpfExists(false);
                  setFoundUser(null);
                  setErrors((prevErrors) => ({ ...prevErrors, checkCpf: '' }));
                }
              }}
              keyboardType="numeric"
              fontSize="md"
              borderColor="coolGray.200"
              borderRadius="xl"
              bg="coolGray.50"
              _focus={{
                borderColor: 'indigo.500',
                bg: 'white',
                shadow: 1,
              }}
              _input={{
                selectionColor: 'indigo.100',
              }}
              leftElement={
                <Icon as={MaterialIcons} name="fingerprint" size={6} ml={3} color="indigo.500" />
              }
              shadow="sm"
            />
            <Button
              onPress={checkExistingCpf}
              isLoading={loadingCheck}
              bg={'white'}
              leftIcon={<Icon as={MaterialIcons} name="search" size={5} color="indigo.700" />}
            ></Button>
          </HStack>

          <FormControl.ErrorMessage
            leftIcon={<WarningOutlineIcon size="xs" color="red.500" />}
            _text={{ color: 'red.500', fontSize: 'sm' }}
          >
            {errors.checkCpf}
          </FormControl.ErrorMessage>
        </FormControl>

        {foundUser && (
          <Box
            bg="blue.50"
            p={3}
            borderRadius="xl"
            borderLeftWidth={4}
            borderColor="indigo.600"
            mt={1}
            shadow="sm"
          >
            <VStack space={2}>
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontSize="lg" fontWeight="bold" color="coolGray.800">
                  Usuário Encontrado
                </Text>
                <IconButton
                  icon={<Icon as={MaterialIcons} name="close" size={4} color="coolGray.500" />}
                  onPress={clearFindUser}
                  size="sm"
                  borderRadius="full"
                  _pressed={{
                    bg: 'coolGray.100',
                  }}
                />
              </HStack>

              <VStack space={1}>
                <Text fontSize="md" color="coolGray.700">
                  <Text fontWeight="medium">Nome:</Text> {foundUser.name}
                </Text>
                <Text fontSize="md" color="coolGray.700">
                  <Text fontWeight="medium">Email:</Text> {foundUser.email}
                </Text>
              </VStack>

              <Button.Group space={2} mt={2}>
                <Button
                  variant="outline"
                  borderColor="coolGray.300"
                  _text={{ color: 'coolGray.700' }}
                  _pressed={{ bg: 'coolGray.100' }}
                  onPress={clearFindUser}
                  flex={1}
                  borderRadius="lg"
                >
                  Cancelar
                </Button>
                <Button
                  bg="emerald.500"
                  _pressed={{ bg: 'emerald.600' }}
                  _text={{ color: 'white' }}
                  onPress={associateUserWithProfessional}
                  isLoading={isAssociating}
                  leftIcon={<Icon as={MaterialIcons} name="link" size={5} color="white" />}
                  flex={1}
                  borderRadius="lg"
                  shadow="md"
                >
                  Associar
                </Button>
              </Button.Group>
            </VStack>
          </Box>
        )}
      </VStack>

      {findUser == false && (
        <VStack space={4} p={6} bg="white" borderTopRadius="3xl" shadow={2}>
          <FormControl isInvalid={'name' in errors}>
            <Input
              variant="underlined"
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
              fontSize="md"
              pl={2}
              py={3}
              leftElement={
                <Icon as={MaterialIcons} name="person" size={5} ml={2} color="indigo.600" />
              }
              _focus={{
                borderColor: 'indigo.600',
                bg: 'coolGray.50',
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.name}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={'email' in errors}>
            <Input
              variant="underlined"
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              fontSize="md"
              pl={2}
              py={3}
              leftElement={
                <Icon as={MaterialIcons} name="email" size={5} ml={2} color="indigo.600" />
              }
              _focus={{
                borderColor: 'indigo.600',
                bg: 'coolGray.50',
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.email}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={'cpf' in errors}>
            <Input
              variant="underlined"
              placeholder="CPF"
              value={cpf}
              onChangeText={setCpf}
              keyboardType="numeric"
              fontSize="md"
              pl={2}
              py={3}
              leftElement={
                <Icon as={MaterialIcons} name="fingerprint" size={5} ml={2} color="indigo.600" />
              }
              _focus={{
                borderColor: 'indigo.600',
                bg: 'coolGray.50',
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.cpf}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={'birthDate' in errors}>
            <Pressable onPress={showDatePickerDialog}>
              <Input
                variant="underlined"
                placeholder="Data de nascimento"
                value={birthDate?.toLocaleDateString('pt-BR') || ''}
                isReadOnly
                fontSize="md"
                pl={2}
                py={3}
                leftElement={
                  <Icon as={MaterialIcons} name="event" size={5} ml={2} color="indigo.600" />
                }
                rightElement={
                  <Icon
                    as={MaterialIcons}
                    name="calendar-today"
                    size={5}
                    mr={2}
                    color="indigo.600"
                  />
                }
                _focus={{
                  borderColor: 'indigo.600',
                  bg: 'coolGray.50',
                }}
              />
            </Pressable>
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.birthDate}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={'password' in errors}>
            <Input
              type={show ? 'text' : 'password'}
              variant="underlined"
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              fontSize="md"
              pl={2}
              py={3}
              leftElement={
                <Icon as={MaterialIcons} name="lock" size={5} ml={2} color="indigo.600" />
              }
              rightElement={
                <Pressable onPress={() => setShow(!show)} mr={2}>
                  <Icon
                    as={MaterialIcons}
                    name={show ? 'visibility' : 'visibility-off'}
                    size={5}
                    color="indigo.600"
                  />
                </Pressable>
              }
              _focus={{
                borderColor: 'indigo.600',
                bg: 'coolGray.50',
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.password}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={'confirmPassword' in errors}>
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              variant="underlined"
              placeholder="Confirme a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              fontSize="md"
              pl={2}
              py={3}
              leftElement={
                <Icon as={MaterialIcons} name="lock-outline" size={5} ml={2} color="indigo.600" />
              }
              rightElement={
                <Pressable onPress={() => setConfirmShowPassword(!showConfirmPassword)} mr={2}>
                  <Icon
                    as={MaterialIcons}
                    name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                    size={5}
                    color="indigo.600"
                  />
                </Pressable>
              }
              _focus={{
                borderColor: 'indigo.600',
                bg: 'coolGray.50',
              }}
            />
            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
              {errors.confirmPassword}
            </FormControl.ErrorMessage>
          </FormControl>

          <VStack space={3} mt={6}>
            <Button
              onPress={handleSubmit}
              bg="indigo.600"
              _pressed={{ bg: 'indigo.600' }}
              leftIcon={<Icon as={MaterialIcons} name="check-circle" size="sm" color="white" />}
              shadow={3}
              borderRadius="lg"
              height={12}
              _text={{ fontSize: 'md', fontWeight: 'bold' }}
            >
              Registrar Cliente
            </Button>

            <Button
              variant="outline"
              borderColor="indigo.600"
              _text={{ color: 'indigo.600' }}
              _pressed={{ bg: 'primary.50' }}
              onPress={() => navigation.navigate('ManangerClients')}
              leftIcon={<Icon as={MaterialIcons} name="arrow-back" size="sm" color="indigo.600" />}
              borderRadius="lg"
              height={12}
            >
              Cancelar Cadastro
            </Button>
          </VStack>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={birthDate || new Date()}
              mode="date"
              display="spinner"
              onChange={onDateChange}
            />
          )}
        </VStack>
      )}
    </Layout>
  );
}
