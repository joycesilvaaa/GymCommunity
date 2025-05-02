import React, { useState } from 'react';
import { NativeBaseProvider, Box, Center } from 'native-base';
import { StackNavigator } from '@/navigation/stackNavigation';
import { AuthProvider } from '@/context/auth';

export default function Index() {
  return (
    <AuthProvider>
      <NativeBaseProvider>
        <StackNavigator />
      </NativeBaseProvider>
    </AuthProvider>
  );
}
