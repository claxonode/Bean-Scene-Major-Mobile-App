import { useEffect, useState } from 'react';
import { SafeAreaView, Pressable, StyleSheet, View, Text, TextInput, Dimensions, FlatList, Button, SectionList, Keyboard, ScrollView, Alert } from 'react-native';
import { MENULIST, transformMenuForSectionList } from '../data/data';
import { useRoute } from '@react-navigation/native';
import { Searchbar, SegmentedButtons, List, IconButton, Portal, Modal, Badge, DataTable } from 'react-native-paper';
import { FilterAndSortHeader } from './MenuList_FilterAndSortHeader';


import { getAllMenuItemsByCategoryQueryable } from '../services/MenuApiService';
import { AustralianCurrency } from '../services/FormatService'



function MenuList({selectedTable,existingOrder}) {
  // console.log(selectedTable)
  // console.log(existingOrder)
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
  console.log("Check cart")
  
  console.log(menuItems.find(x => x.name === "Strawberry Milkshake"))
  const isInCart = (name) => orderCart.some(x => x.name === name)
  const quantity = (name)=>isInCart(name) ?  orderCart.find(x=>x.name===name).quantity:  0
  // console.log(isInCart())
  const total = orderCart.reduce((acc, item) => {
    acc += item.quantity * item.price
    return acc
  }, 0)
  const itemCount = orderCart.reduce((acc, item) => {
    acc += item.quantity
    return acc
  }, 0)


  const menuItem = ({ item }) => {
    return <MenuItem item={item} inCart={isInCart} onPress={() => handleAddToCart(item)}
      handleIncrease={handleIncrease} handleDecrease={handleDecrease} quantity={quantity(item.name)}
      handleRemove={handleRemoveFromCart}
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
          handleSearch={handleText}
          total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} existingOrder={existingOrder}
          handleCategory={handleFilterCategory}
          handleSort={handleSortBy} />}
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

function MenuItem({ item, onPress, inCart, quantity, handleIncrease, handleDecrease, handleRemove }) {
  return (<View style={styles.menuItem}>
    <View>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Price: {AustralianCurrency(item.price)}</Text>
      {inCart(item.name)
        ? <View>
          <Text>Quantity: {quantity}</Text>
          <Button title="Increase" onPress={() => { handleIncrease(item.name) }}></Button>
          <Button disabled={quantity === 1} title="Decrease" onPress={() => { handleDecrease(item.name) }}></Button>
          <Button disabled={!inCart(item.name)} title="Remove" onPress={() =>
            // {handleRemove(item._id)}
            Alert.alert(`Are you sure you want to remove \n${item.name} x${quantity}?`, '', [
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
        </View>
        : <Button title={inCart(item.name) ? "In cart" : "Add To Cart"} onPress={() => {onPress(item) }}>
        </Button>
      }

      {/* <Text>Quantity: {quantity}</Text>
      <Button title="Increase" onPress={()=>{handleIncrease(item._id)}}></Button>
      <Button disabled={quantity===1} title="Decrease" onPress={()=>{handleDecrease(item._id)}}></Button>
      <Button disabled={!inCart(item._id)} title="Remove" onPress={()=>handleRemove(item._id)} />
      <Button disabled={inCart(item._id)} title={inCart(item._id)?"In cart":"Add To Cart"} onPress={()=>onPress(item)}></Button> */}
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