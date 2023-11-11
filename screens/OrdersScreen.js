import { View,Text,FlatList,StyleSheet,Button } from "react-native";
import { Portal, Searchbar,Modal } from "react-native-paper";
import { useEffect,useState, } from "react";
import { getOrders } from "../services/OrderApiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { AustralianCurrency,AustralianDate,ShortDate } from "../services/FormatService";
import { useNavigation } from "@react-navigation/native";

export default function OrdersScreen() {
    const [orders,setOrders] = useState([])

    // console.log(AustralianDate('2023-11-10T12:08:04.926Z'))
    useEffect(() => {
        async function fetchData() {
          try {
            const data = await getOrders();
            setOrders(data)
          } catch (error) {
            console.error('Error fetching tables:', error);
          }
        }
    
        fetchData();
      }, [orders]);

      // const [searchQuery, setSearchQuery] = useState('');

      // const onChangeSearch = query => setSearchQuery(query);
    return (
        <SafeAreaView>
            <FlatList data={orders} renderItem={({item})=><Order order={item}/>}
                keyExtractor={(item,index)=>`orders_${index}_${item.id}`}
            >
            </FlatList>
            
        </SafeAreaView>
    );

}

function Order({order}) {
  const [visible, setVisible] = useState(false);
  const showModal = () => { setVisible(true) }
  const hideModal = () => { setVisible(false) }
  const navigation = useNavigation();
    // console.log(new Intl.DateTimeFormat('en-US',{timeStyle:'medium',dateStyle:'short'}).format(isoDate));
    // console.log(item.orderDate)
    // // console.log(AustralianDate(item.orderDate))
    // console.log(order)
    const orderItems = order.orderItems.map((item,index) => {
      return <View key={`${item.id}_cart_${index}`}>
          <View  style={{ flexDirection: 'row', gap: 40 }}>
              <Text style={{flex:3}}>{item.name}</Text>
              <Text style={{flex:1}}>x{item.quantity}</Text>
              <Text style={{flex:2,textAlign:'right'}}>{AustralianCurrency(item.price)}</Text>
          </View>
      </View>
  });

  order["name"] = "mond"
    return (
        <View style={styles.orderItem}>
            <Text>OrderId: {order.orderId}</Text>
            <Text>Date created: {AustralianDate(order.orderDate)}</Text>
            <Text>Status: {order.orderStatus}</Text>
            <Text>Table: {order.tableNumber}</Text>
            <Text>Created By: {order.createdBy}</Text>
            {order.notes&&<Text>Notes: {order.notes}</Text>}
            <Button title="Show order" onPress={showModal}></Button>
            <Portal>
              <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBoxContainer}>
                <View style={{flexDirection:'row',gap:50}}>
                <Text 
                // style={{styles.modalHeader}}
                >Total: {AustralianCurrency(order.totalPrice)}</Text>
                <Text 
                // style={styles.modalSubHeader}
                >Table: {order.tableNumber}</Text>
                </View>
                {orderItems}
                {order.notes&&<Text>Notes: {order.notes}</Text>}
                <Button title="Edit order" onPress={()=>{
                  hideModal()
                  navigation.navigate('UpdateOrder',{order: order, name:`Edit order ${ShortDate(order.orderDate)}`});
                }}></Button>
                
              </Modal>
            </Portal>
        </View>
    );
}


const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    margin: 10,
  },
  orderItem: {
    flex: 1,
    padding: 10,
    margin: 10,
    borderStyle: 'solid',
    backgroundColor: 'pink',
    borderWidth: 5,
    // borderColor: 'black',
  },
  menuHeader: {
    fontSize: 25
  },
  modalBoxContainer: {
    backgroundColor: 'white', padding: 20 
  },
  shoppingCartOrderItemsName: {
    flex:1
  }
});