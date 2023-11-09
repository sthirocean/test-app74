import React, { useState, useEffect, useReducer } from 'react'
import { ActivityIndicator, StyleSheet, ScrollView, View } from 'react-native'

import { actionCreators, initialState, reducer } from './reducer'
import { api } from './api'
import { data } from './data'
import * as items from './chat_data'
import ChatList from './ChatList'

function Chat({ navigation, route }){ 
const url = (api.chat ?? "chat/") + (route?.params?.id ?? '')
const [state, dispatch] = useReducer(reducer, initialState)

const { item, history, loading, error } = state



async function getItem() {
      dispatch(actionCreators.loading())

      try {
        if (url in history){
           dispatch(actionCreators.local(history[url]))
        } else if (url.indexOf('http') > -1){
          const response = await fetch(url)
          const json = await response.json()
          if(json){
            dispatch(actionCreators.success(route.params?.id ? json : json[0], url))
          }   
        } else {
          const json = route.params?.id ? data[route.params?.id] : items.item
          dispatch(actionCreators.success(json, url))
        }
      } catch (e) {
        dispatch(actionCreators.failure())
      }
    }

useEffect(() => {
    getItem();
}, []);
  
if (loading) {
    return (
        <View style={styles.center}>
        <ActivityIndicator animating={true} />
        </View>
    )
}

return(
<ScrollView style={styles.chat} showsVerticalScrollIndicator={false}>
<ChatList item={'chat_list' in item ? item.chat_list: item} navigation={navigation}/>
<View style={{flexDirection: 'row'}}>
{<View
    style={[styles.new_chat,{ backgroundColor: item.new_chat ? 'red' : 'black' }]}
   />}
{<View
    style={[styles.search,{ backgroundColor: item.search ? 'red' : 'black' }]}
   />}
</View>
</ScrollView>
)}

export default Chat;

const styles = StyleSheet.create({
center:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
new_chat: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginTop: 5
  },
search: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginTop: 5
  }
});