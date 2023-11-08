import { Pressable, StyleSheet, View, Text,TextInput, FlatList,Button,SectionList,Keyboard ,ScrollView, VirtualizedList} from 'react-native';

function OrderList({navigation,route}) {

  
  const { orderCart, total, selectedTable } = route.params;
  
    // const {handleRemove} = route.params
    return (
      <View style={styles.mainContainer}>
        <Text>Table Name: {selectedTable.name}</Text>
        <Text>Table Area: {selectedTable.area}</Text>
        <FlatList
          data={orderCart}
          renderItem={({ item }) => <OrderItem item={item} />}
          keyExtractor={(item) => item.id}
          extraData={orderCart}
          ListHeaderComponent={<OrderHeader total={total} />}
        />
      </View>
    );
  }
  
  function OrderItem({item}) {
    const price = new Intl.NumberFormat('en-AU',{style:'currency', currency:'AUD'}).format(item.price);
    return <View style={styles.item}>
      <Text>{item.name}</Text>
        <Text>Price: {price}</Text>
        <Text>Quantity: {item.quantity}</Text>
        
    </View>
  }

  function OrderHeader({total}) {
    const price = new Intl.NumberFormat('en-AU',{style:'currency', currency:'AUD'}).format(total);
    return <View>
      <Text style={styles.header}>Total {price}</Text>
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