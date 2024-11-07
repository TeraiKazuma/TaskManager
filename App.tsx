import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
//各画面をインポート
import Login from './src/Login'
import Signup from './src/SignUp';
import Home from './src/Home';
import AddTask from './src/AddTask';
import ListTask from './src/ListTask';
import Setting from './src/Setting';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ title: 'サインイン' }} />
        <Stack.Screen name="Signup" component={Signup} options={{ title: '新規登録' }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'ホーム' }} />
        <Stack.Screen name="AddTask" component={AddTask} options={{ title: 'タスクを追加' }} />
        <Stack.Screen name="ListTask" component={ListTask} options={{ title: 'タスク一覧' }} />
        <Stack.Screen name="Setting" component={Setting} options={{ title: '設定' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;