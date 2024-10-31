import { View, Text, StyleSheet, Button } from 'react-native';
const Setting = ({navigation} :any)=>{
    return(
        <View>
            <Button title="ホーム" onPress={() => navigation.navigate('Home')}/>
        </View>
    )
}

export default Setting;