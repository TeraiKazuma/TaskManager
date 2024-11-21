import React from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import { Divider } from 'react-native-elements'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'

interface Person {
    Title: string
    age: number
}

const Test: React.FC = () => {

    const personList: Person[] = [
        {
            Title: '一郎',
            age: 11
        },
        {
            Title: '二郎',
            age: 22
        },
        {
            Title: '三郎',
            age: 33
        },
    ]

　　 // 2
    const renderPerson = ({item}: {item: Person}) => {

        console.log(item)

        return(
            <View style={styles.container}>
                <View style={styles.item}>
                    <Text>{item.Title}</Text>
                    <Text>{item.age}</Text>
                </View>
                <Divider />
            </View>
        )
    }


    return(
        <View>
            {/* 1 */} 
            <FlatList data={personList} renderItem={renderPerson}/>  
        </View>
    )

}

export default Test

const styles = StyleSheet.create({
    container: {
        marginTop: wp('7%')
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: wp('2%'),
        marginBottom: wp('2%')
    }
})