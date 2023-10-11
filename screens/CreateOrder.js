import { Pressable, StyleSheet, View, Text,TextInput, FlatList,Button,SectionList,Keyboard ,ScrollView, VirtualizedList} from 'react-native';

function OrderList({navigation,route}) {
    const {orderCart} = route.params
    // const {handleRemove} = route.params
    return <FlatList data={orderCart}
      renderItem={({item})=><OrderItem prop={item}/>}
      keyExtractor={item=>item.id}
      extraData={orderCart}
    >
    </FlatList>
  }
  
  function OrderItem({prop}) {
    const price = new Intl.NumberFormat('en-AU',{style:'currency', currency:'AUD'}).format(prop.data.price);
    return <View style={styles.item}>
      <Text>{prop.data.name}</Text>
        <Text>Price: {price}</Text>
        <Text>Quantity: {prop.quantity}</Text>
        
    </View>
  }

  const styles = StyleSheet.create({
    mainContainer: {
      padding:5,
      margin:10,
    },
      container: {
        // flex: 1,
        padding: 10,
        margin: 10,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
      },
      item: {
        flex: 1,
        padding: 10,
        margin: 10,
        borderStyle: 'solid',
        backgroundColor: 'pink',
        borderWidth: 5,
        // borderColor: 'black',
  
      },
      header: {
        fontSize:25
      }, 
      input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
    });

    export default OrderList;