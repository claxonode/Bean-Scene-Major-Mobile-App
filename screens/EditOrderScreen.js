import { useRoute } from '@react-navigation/native';
import {View,Text} from 'react-native'
import MenuList from '../components/MenuList';

function EditOrderScreen() {
    const route = useRoute();
    const { order } = route.params;
    let selectedTable = {name: order.tableNumber}
    // console.log(order)
    // return <View><Text>Hi</Text></View>
    return <MenuList existingOrder={order} selectedTable={selectedTable}></MenuList>
    // selectedTable.name
  }
  
  export default EditOrderScreen;