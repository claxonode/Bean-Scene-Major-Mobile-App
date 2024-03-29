import { View,Text as TextNormal, FlatList,Alert, StyleSheet, Button } from "react-native";
import { Portal,Text, Searchbar, Modal, ActivityIndicator,Button as ButtonPaper, useTheme } from "react-native-paper";
import { useCallback, useEffect, useState, } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getOrders,getOrdersPast24Hours,getOrdersByTable,getTablesWithPendingOrders,completeOrder } from "../services/OrderApiService";
import { SafeAreaView } from "react-native-safe-area-context";
import { AustralianCurrency, AustralianDate, ShortDate } from "../services/FormatService";
import { useNavigation } from "@react-navigation/native";


/**
 * @function OrdersScreen Represents the orders screen for viewing orders
 * @returns {JSX}
 */
export default function OrdersScreen() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [table,setTable] = useState("")
  const [buttonList, setButtonList] = useState([])

  useFocusEffect(
    useCallback(()=>{
      async function fetchData() {
      try {
        const data = await getOrdersPast24Hours();
        setOrders(data)
        setIsLoading(false)

      } catch (error) {
        setIsLoading(false).

        console.error('Error fetching orders:', error);
        setIsLoading(false)
      }
    }

    fetchData();
    },[])
  );
  useEffect(()=>{
    async function fetchDataByTable() {
      try {
        const data = await getOrdersByTable(table,"ALL")
        setOrders(data)
        setIsLoading(false)
      } catch (error){
        console.error("Error fetching orders", error)
        setIsLoading(false)
      }
    }
    async function fetchData() {
      try {
        const data = await getOrdersPast24Hours();
        setOrders(data)
        setIsLoading(false)

      } catch (error) {
        setIsLoading(false).

        console.error('Error fetching orders:', error);
        setIsLoading(false)
      }
    }
    if (table===""){
      fetchData()
    }
    else if (table==="ALL") {
      fetchData()
    }
    else {
      fetchDataByTable();
    }
  },[table])
  useEffect(()=>{
    async function fetchData() {
      try {
        const data = await getOrdersPast24Hours();
        const tables = await getTablesWithPendingOrders();
        setButtonList(tables)
        setOrders(data)
        setIsLoading(false)

      } catch (error) {
        setIsLoading(false).

        console.error('Error fetching orders:', error);
        setIsLoading(false)
      }
    }
    fetchData()
  },[isLoading])
  
  return (

    <SafeAreaView>
      {isLoading === true ? <ActivityIndicator animating={isLoading} />
        :
        <FlatList data={orders} renderItem={({ item }) => <OrderItem order={item} handleCompletedOrder={setIsLoading}/>}
          keyExtractor={(item, index) => `orders_${index}_${item.id}`}
          extraData={{orders,isLoading}}
          ListHeaderComponent={ 
          <SelectTable handlePress={setTable} buttonList={buttonList}></SelectTable>
          }>
        </FlatList>

        
      }


    </SafeAreaView>
  );
}

/**
 * @function SelectTable A component that shows the tables that have pending orders
 * @param {function} handlePress When pressed the orders shown will be that selected table
 * @param {Array of Objects} buttonList Initial values of the select table button list.
 * @returns {JSX}
 */
function SelectTable({handlePress,buttonList}) {
    // const [buttonList, setButtonList] = useState([])


    // useEffect(() => {
    //     async function fetchData() {
    //         const data = await getTablesWithPendingOrders();
    //         setButtonList(data)
    //     } fetchData()
    // }, [])

    const renderItem = ({ item }) => {
        return <View>
            <ButtonPaper onPress={() => { handlePress(item.label) }}>{item.label}</ButtonPaper>
        </View>
    }
    return (
        <View >
            <FlatList horizontal data={buttonList} keyExtractor={item => `${item.label}`}
                renderItem={renderItem} ListHeaderComponent={<ButtonPaper onPress={()=>handlePress("ALL")}>All tables</ButtonPaper>}
            />
        </View>
    );
};

function SelectOrderStatus({handlePress}) {
  const buttonList = [{label:"ALL"},{label:"PENDING"},{label:"Completed"}]
  const renderItem = ({item})=> {
    return <View>
            <ButtonPaper onPress={() => { handlePress(item.label) }}>{item.label}</ButtonPaper>
        </View> 
  }
  return (
    <View >
        <FlatList horizontal data={buttonList} keyExtractor={item => `${item.label}`}
            renderItem={renderItem}
        />
    </View>
);
}

/**
 * @function OrderItem Represents a order item in the orderList
 * @param {object} order An individual order item
 * @param {function} handleCompletedOrder Function that fires when you complete the order
 * @returns {JSX}
 */
function OrderItem({ order,handleCompletedOrder }) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false);
  const showModal = () => { setVisible(true) }
  const hideModal = () => { setVisible(false) }
  const approveItem = () => {

  }
  const navigation = useNavigation();

  return (
    <View style={[styles.orderItem,{backgroundColor:theme.colors.primaryContainer}]}>
      <Text>OrderId: {order.orderId}</Text>
      <Text>Date created: {AustralianDate(order.orderDate)}</Text>
      <Text>Status: {order.orderStatus}</Text>
      <Text>Table: {order.tableNumber}</Text>
      <Text>Created By: {order.createdBy}</Text>
      {order.notes && <Text>More Notes: {order.notes}</Text>}
      <Button title="Show order" onPress={showModal}></Button>
      <Portal>
        <ViewOrderModal 
        order={order} visible={visible} hideModal={hideModal} navigation={navigation} handleCompletedOrder={handleCompletedOrder}>

        </ViewOrderModal>
      </Portal>
    </View>
  );
}

/**
 * @function ViewOrderModal When the user presses show order, this is the modal that shows.
 * @param {object} navigation The navigation prop for navigating
 * @param {object} order  An individual order item
 * @param {boolean} visible Whether the modal is visible
 * @param {function} hideModal Function that hides the modal
 * @param {function} handleCompletedOrder Function that fires when you complete the order
 * @returns {JSX}
 */
function ViewOrderModal({navigation,order,visible,hideModal,handleCompletedOrder}) {


  const orderItems = order.orderItems.map((item, index) => {
    return <View key={`${item.id}_cart_${index}`}>
      <View style={{ flexDirection: 'row', gap: 40 }}>
        <TextNormal style={{ flex: 3 }}>{item.name}</TextNormal>
        <TextNormal style={{ flex: 1 }}>x{item.quantity}</TextNormal>
        {/* <Text >{item.status}</Text> */}
        {/* <Button title={item.status} onPress={() => { }}></Button> */}
        {/* ToDo Work on approve item and approve order */}
        <TextNormal style={{ flex: 2, textAlign: 'right' }}>{AustralianCurrency(item.price)}</TextNormal>
      </View>
      {item.note && <TextNormal>&#10148;Notes: {item.note}</TextNormal>}
    </View>
  });
  return (
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBoxContainer}>
      <View style={{ flexDirection: 'row', gap: 50 }}>
        <TextNormal
        // style={{styles.modalHeader}}
        >Total: {AustralianCurrency(order.totalPrice)}</TextNormal>
        <TextNormal
        // style={styles.modalSubHeader}
        >Table: {order.tableNumber}</TextNormal>
      </View>
      {orderItems}
      {order.notes && <TextNormal>More Notes: {order.notes}</TextNormal>}
      { order.orderStatus === "PENDING" ? 
      <>
        <Button title="Edit order" onPress={() => {
        hideModal()
        navigation.navigate('UpdateOrder', { order: order, name: `Order ${ShortDate(order.orderDate)}` });
      }}></Button>
      <Button title="Complete order" onPress={() => {
        hideModal()
        Alert.alert("Completed order")
        completeOrder(order.orderId)
        handleCompletedOrder(true)
      }}></Button>
      </>
      :
      <></>
      }
      
    </Modal>
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
    marginTop:4,
    marginBottom:4,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'black',
    elevation: 3
  },
  menuHeader: {
    fontSize: 25
  },
  modalBoxContainer: {
    backgroundColor: 'white', padding: 20
  },
  shoppingCartOrderItemsName: {
    flex: 1
  }
});