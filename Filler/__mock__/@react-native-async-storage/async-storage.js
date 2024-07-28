export * from '@react-native-async-storage/async-storage/jest/async-storage-mock';

import MockAsyncStorage from "mock-async-storage";

jest.mock(
  "@react-native-async-storage/async-storage",
  () => new MockAsyncStorage()
);