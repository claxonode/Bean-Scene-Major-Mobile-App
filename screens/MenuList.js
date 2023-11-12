import { useEffect, useState } from 'react';
import { SafeAreaView, Pressable, StyleSheet, View, Text, Dimensions, FlatList, Button, SectionList, Keyboard, ScrollView, Alert } from 'react-native';
import { MENULIST, transformMenuForSectionList } from '../data/data';
import { useRoute } from '@react-navigation/native';
import { Searchbar, SegmentedButtons, List, IconButton, Portal, Modal, Badge, DataTable,TextInput} from 'react-native-paper';
import { FilterAndSortHeader } from './MenuList_FilterAndSortHeader';


import { getAllMenuItemsByCategoryQueryable } from '../services/MenuApiService';
import { AustralianCurrency } from '../services/FormatService'



function MenuList({selectedTable,existingOrder}) {

  const [searchText, setSearchText] = useState("")
  const [sortBy, setSortBy] = useState("pricedes")  //nameasc,namedes,priceasc,pricedes
  const [filterCategory, setFilterCategory] = useState("All") //"All,Drink,Main"

  // 
  const [orderCart, setOrderCart] = useState(existingOrder===null?[]:existingOrder.orderItems) //order items
  const [menuItems, setMenuItems] = useState([])


  useEffect(() => {
    async function fetchData() {
      try {
        const menuData = await getAllMenuItemsByCategoryQueryable(filterCategory, sortBy, searchText);
        setMenuItems(menuData);
      } catch (error) {
        console.error("Error fetching menu:", error)
      }
    } fetchData()
  }, [searchText, sortBy, filterCategory])
  const isInCart = (name) => orderCart.some(x => x.name === name)
  const quantity = (name)=>isInCart(name) ?  orderCart.find(x=>x.name===name).quantity:  0
  const cartItemNote = (name)=> isInCart(name) ? orderCart.find(x=>x.name===name).note : ""

  const total = orderCart.reduce((acc, item) => {
    acc += item.quantity * item.price
    return acc
  }, 0)
  const itemCount = orderCart.reduce((acc, item) => {
    acc += item.quantity
    return acc
  }, 0)


  const menuItem = ({ item }) => {
    return <MenuItem item={item} inCart={isInCart} cartItemQuantity={quantity(item.name)} cartItemNote={cartItemNote(item.name)}
      onPress={() => handleAddToCart(item)}
      handleIncrease={handleIncrease} handleDecrease={handleDecrease} 
      handleRemove={handleRemoveFromCart} handleNote={handleNote}
    ></MenuItem>
  }
  const sectionHeader = ({ section }) => { return <MenuHeader section={section} /> }

  function handleText(text) {
    setSearchText(text)
  }
  function handleFilterCategory(text) {
    setFilterCategory(text)
  }
  function handleSortBy(text) {
    setSortBy(text)
  }
  function handleAddToCart(item) {
    setOrderCart([...orderCart, { name: item.name, price: item.price, quantity: 1, }])
  }
  function handleRemoveFromCart(name) {
    setOrderCart(orderCart.filter(x => x.name !== name))
  }
  function handleIncrease(name) {
    setOrderCart(orderCart.map(item => {
      if (item.name === name) {
        return {
          ...item, quantity: item.quantity + 1
        }
      }
      else {
        return item
      }
    }))
  }
  function handleNote(name,text) {
    setOrderCart(orderCart.map(item => {
      if (item.name === name) {
        return {
          ...item, note: text
        }
      }
      else {
        return item
      }
    }))
  }
  function handleDecrease(name) {
    setOrderCart(orderCart.map(item => {
      if (item.name === name) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      else {
        return item
      }
    }));
  }
  return <SafeAreaView style={styles.mainContainer}>
    <SectionList sections={menuItems}
      renderItem={menuItem}
      renderSectionHeader={sectionHeader}
      extraData={{ quantity, orderCart }}
      keyExtractor={(item) => item.name}
      ListHeaderComponent={
        <FilterAndSortHeader
          handleSearch={handleText} //SearchBar
          total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} existingOrder={existingOrder} //Shopping cart
          handleCategory={handleFilterCategory} //FilterCategory
          handleSort={handleSortBy} />} //SortMenuItemsButton
    // ListFooterComponent={
    // <Button disabled={orderCart.length===0} title={"View Order"} 
    // onPress={()=>navigation.
    //   navigate("New Order",{
    //     orderCart: orderCart,
    //     total:total,
    //     selectedTable: selectedTable
    //   })}/>}
    >
    </SectionList >
  </SafeAreaView>


}

function MenuItem({ item, onPress, inCart, cartItemQuantity,cartItemNote, handleIncrease, handleDecrease, handleRemove,handleNote }) {
  const [text,setText] = useState((cartItemNote!==undefined &&cartItemNote!==null )?cartItemNote:"")
  const [visible,setVisible] = useState(false)
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (<View style={styles.menuItem}>
    <View>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Price: {AustralianCurrency(item.price)}</Text>
      {inCart(item.name)
        ? <View>
          <Text>Quantity: {cartItemQuantity}</Text>
          {cartItemNote!==undefined &&cartItemNote!==null &&<Text>Notes: {cartItemNote}</Text>} 
          <Button title="Increase" onPress={() => { handleIncrease(item.name) }}></Button>
          <Button disabled={cartItemQuantity === 1} title="Decrease" onPress={() => { handleDecrease(item.name) }}></Button>
          <Button disabled={!inCart(item.name)} title="Remove" onPress={() =>
            // {handleRemove(item._id)}
            Alert.alert(`Are you sure you want to remove \n${item.name} x${cartItemQuantity}?`, '', [
              {
                text: "Yes",
                onPress: () => handleRemove(item.name)
              },
              {
                text: "No",
                onPress: () => { }
              }
            ])
          } />
          {/* This is menu items.. not note */}
          <Button title={(cartItemNote!==undefined&&cartItemNote!==null)?"Edit note":"Add note"} onPress={showModal}></Button>
          
          <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{backgroundColor:'white',padding:20}}>
              <TextInput label='Notes' value={text} onChangeText={setText}></TextInput>
              <Button title='Submit' onPress={()=>{
                handleNote(item.name,text)
                hideModal()
              }}></Button>
              <Button title='Cancel' onPress={()=>{
                hideModal()
              }}></Button>
            </Modal>
          </Portal>
        </View>
        : <Button title={inCart(item.name) ? "In cart" : "Add To Cart"} onPress={() => {onPress(item) }}>
        </Button>
        
      }

    </View>
  </View>);
}

function MenuHeader({ section }) {
  return (
    <Text style={styles.menuHeader}>{section.title}</Text>
  )
}


const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    margin: 10,
  },
  menuItem: {
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

});

export default MenuList;