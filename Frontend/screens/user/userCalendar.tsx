import { Layout } from '@/components/layout';
import { NavigationProps } from '@/interfaces/navigation';
import { Box, Text, HStack, VStack, Spinner, Circle } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { useAuth } from '@/hooks/auth';

// Tipos para os dados de treino e dieta
type TrainingSchedule = {
  startDate: string;
  endDate: string;
  daysPerWeek: number; // Número de dias por semana para treino (ex: 4)
};

type DietSchedule = {
  startDate: string;
  endDate: string;
};

type MarkedDates = {
  [date: string]: {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
    dots?: { key: string; color: string }[];
  };
};

function UserCalendar({ navigation }: NavigationProps) {
  // const { user } = useAuth() as { user?: { id: number } };
  const [loading, setLoading] = useState(true);
  const [trainingSchedule, setTrainingSchedule] = useState<TrainingSchedule | null>(null);
  const [dietSchedule, setDietSchedule] = useState<DietSchedule | null>(null);
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetchUserSchedule();
  }, []);

  LocaleConfig.locales['pt-br'] = {
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],
    dayNames: [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje',
  };
  LocaleConfig.defaultLocale = 'pt-br';
  
  const fetchUserSchedule = async () => {
    setLoading(true);

    // Usando datas atuais para melhor visualização
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Definir data de início para o primeiro dia do mês atual
    const startDate = new Date(currentYear, currentMonth, 1);
    // Definir data de fim para o último dia do mês seguinte
    const endDate = new Date(currentYear, currentMonth + 2, 0);

    // Formato de string para as datas (YYYY-MM-DD)
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Simulando uma chamada de API
    setTimeout(() => {
      // Dados mockados que simulariam a resposta do backend
      const mockTrainingSchedule: TrainingSchedule = {
        startDate: startDateStr,
        endDate: endDateStr,
        daysPerWeek: 4, // Agora recebemos apenas o número de dias por semana
      };

      const mockDietSchedule: DietSchedule = {
        startDate: startDateStr,
        endDate: endDateStr,
      };

      setTrainingSchedule(mockTrainingSchedule);
      setDietSchedule(mockDietSchedule);

      // Processar as datas para marcar no calendário
      processScheduleDates(mockTrainingSchedule, mockDietSchedule);

      setLoading(false);
    }, 1000);
  };

  // Função para distribuir os dias de treino na semana
  const distributeDaysInWeek = (daysPerWeek: number): number[] => {
    // Distribuir os dias de forma equilibrada
    // Começamos com segunda-feira (1) até completar o número de dias solicitado
    const weekDays: number[] = [];

    // Se tiver 7 dias, usar todos
    if (daysPerWeek >= 7) {
      return [0, 1, 2, 3, 4, 5, 6]; // Domingo a Sábado
    }

    // Para outros casos, distribuir uniformemente
    // Exemplo para 4 dias: segunda, terça, quinta, sexta
    // Exemplo para 3 dias: segunda, quarta, sexta
    // Exemplo para 2 dias: terça, quinta

    if (daysPerWeek === 1) {
      return [3]; // Quarta-feira
    } else if (daysPerWeek === 2) {
      return [2, 4]; // Terça e quinta
    } else if (daysPerWeek === 3) {
      return [1, 3, 5]; // Segunda, quarta, sexta
    } else if (daysPerWeek === 4) {
      return [1, 2, 4, 5]; // Segunda, terça, quinta, sexta
    } else if (daysPerWeek === 5) {
      return [1, 2, 3, 4, 5]; // Segunda a sexta
    } else if (daysPerWeek === 6) {
      return [0, 1, 2, 3, 4, 5]; // Domingo a sexta
    }

    return weekDays;
  };

  // Função para processar e marcar as datas no calendário
  const processScheduleDates = (training: TrainingSchedule, diet: DietSchedule) => {
    const marked: MarkedDates = {};

    // Processar datas de treino
    if (training) {
      // Distribuir os dias de treino na semana
      const weekDays = distributeDaysInWeek(training.daysPerWeek);

      const startDate = new Date(training.startDate);
      const endDate = new Date(training.endDate);

      // Resto da lógica permanece igual, mas agora usamos weekDays calculado
      for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        if (weekDays.includes(day.getDay())) {
          const dateString = day.toISOString().split('T')[0];
          marked[dateString] = {
            marked: true,
            dotColor: '#3949ab', // Azul para treinos
            selected: false,
          };
        }
      }
    }

    // Processar datas de dieta
    if (diet) {
      const startDate = new Date(diet.startDate);
      const endDate = new Date(diet.endDate);

      for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
        const dateString = day.toISOString().split('T')[0];

        if (marked[dateString]) {
          // Se já é um dia de treino, usar cor rosa para indicar ambos
          marked[dateString] = {
            marked: true,
            dotColor: '#d53f8c', // Rosa para treino + dieta
            selected: false,
          };
        } else {
          // Se é só dia de dieta
          marked[dateString] = {
            marked: true,
            dotColor: '#43a047', // Verde para dieta
            selected: false,
          };
        }
      }
    }

    console.log('Datas marcadas:', marked);
    setMarkedDates(marked);
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);

    // Você pode implementar aqui uma lógica para mostrar detalhes do dia selecionado
    // Por exemplo, detalhes do treino ou da dieta para aquele dia específico
  };

  return (
    <Layout navigation={navigation}>
      <Box flex={1} bg="coolGray.50" px={4} py={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={4} color="indigo.600" textAlign="center">
          Meu Calendário
        </Text>

        {loading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Spinner size="lg" color="indigo.600" />
            <Text mt={2} color="coolGray.500">
              Carregando seu calendário...
            </Text>
          </Box>
        ) : (
          <VStack space={4}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType="dot"
              localization="pt-br"
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#6b7280',
                selectedDayBackgroundColor: '#3949ab',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3949ab',
                dayTextColor: '#2d3748',
                textDisabledColor: '#d1d5db',
                dotColor: '#3949ab',
                selectedDotColor: '#ffffff',
                arrowColor: '#3949ab',
                monthTextColor: '#3949ab',
                indicatorColor: '#3949ab',
              }}
              // Adicione a propriedade locale para português
              locale="pt-br"
            />

            <Box bg="white" p={4} borderRadius="md" shadow={1}>
              <Text fontSize="lg" fontWeight="bold" mb={3} color="coolGray.800">
                Legenda
              </Text>

              <VStack space={2}>
                <HStack alignItems="center" space={2}>
                  <Circle size={4} bg="indigo.600" />
                  <Text>Dias de Treino</Text>
                </HStack>

                <HStack alignItems="center" space={2}>
                  <Circle size={4} bg="green.600" />
                  <Text>Dias de Dieta</Text>
                </HStack>

                <HStack alignItems="center" space={2}>
                  <Circle size={4} bg="pink.500" />
                  <Text>Treino e Dieta</Text>
                </HStack>
              </VStack>
            </Box>

            {selectedDate && (
              <Box
                bg="white"
                p={4}
                borderRadius="md"
                shadow={1}
                borderColor={
                  markedDates[selectedDate]?.dots &&
                  markedDates[selectedDate].dots.some((dot) => dot.key === 'training') &&
                  markedDates[selectedDate].dots.some((dot) => dot.key === 'diet')
                    ? 'pink.500'
                    : 'white'
                }
                borderWidth={2}
              >
                <Text fontSize="lg" fontWeight="bold" mb={2} color="coolGray.800">
                  {new Date(selectedDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                {markedDates[selectedDate]?.dotColor && (
                  <VStack space={2}>
                    {markedDates[selectedDate].dotColor === '#d53f8c' ? (
                      <Box bg="pink.100" p={2} borderRadius="md">
                        <Text color="pink.700" fontWeight="medium">
                          Dia de Treino e Dieta
                        </Text>
                      </Box>
                    ) : markedDates[selectedDate].dotColor === '#3949ab' ? (
                      <Text color="indigo.600" fontWeight="medium">
                        Dia de Treino
                      </Text>
                    ) : markedDates[selectedDate].dotColor === '#43a047' ? (
                      <Text color="green.600" fontWeight="medium">
                        Dia de Dieta
                      </Text>
                    ) : (
                      <Text>Nenhum evento neste dia</Text>
                    )}
                  </VStack>
                )}
              </Box>
            )}
            <Box bg="white" p={4} borderRadius="md" shadow={1}>
              <Text fontSize="lg" fontWeight="bold" mb={2} color="coolGray.800">
                Detalhes do Seu Plano
              </Text>

              <VStack space={2}>
                <Text>
                  <Text fontWeight="bold">Treino: </Text>
                  {trainingSchedule?.startDate && trainingSchedule?.endDate ? (
                    <Text>
                      {new Date(trainingSchedule.startDate).toLocaleDateString('pt-BR')} até{' '}
                      {new Date(trainingSchedule.endDate).toLocaleDateString('pt-BR')}
                    </Text>
                  ) : (
                    <Text>Nenhum plano de treino ativo</Text>
                  )}
                </Text>

                <Text>
                  <Text fontWeight="bold">Dias de treino: </Text>
                  {trainingSchedule?.daysPerWeek ? (
                    <Text>
                      {trainingSchedule.daysPerWeek} dias por semana
                      {distributeDaysInWeek(trainingSchedule.daysPerWeek)
                        .map((day) => {
                          const weekDay = [
                            'Domingo',
                            'Segunda',
                            'Terça',
                            'Quarta',
                            'Quinta',
                            'Sexta',
                            'Sábado',
                          ][day];
                          return ' ' + weekDay + ',';
                        })
                        .toString()
                        .slice(0, -1)}
                    </Text>
                  ) : (
                    <Text>Nenhum dia definido</Text>
                  )}
                </Text>

                <Text>
                  <Text fontWeight="bold">Dieta: </Text>
                  {dietSchedule?.startDate && dietSchedule?.endDate ? (
                    <Text>
                      {new Date(dietSchedule.startDate).toLocaleDateString('pt-BR')} até{' '}
                      {new Date(dietSchedule.endDate).toLocaleDateString('pt-BR')}
                    </Text>
                  ) : (
                    <Text>Nenhum plano de dieta ativo</Text>
                  )}
                </Text>
              </VStack>
            </Box>
          </VStack>
        )}
      </Box>
    </Layout>
  );
}

export default UserCalendar;
