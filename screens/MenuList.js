import { useEffect, useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, View, Text,TextInput,Dimensions, FlatList,Button,SectionList,Keyboard ,ScrollView, Alert} from 'react-native';
import {MENULIST,transformMenuForSectionList} from '../data/data';
import { useRoute } from '@react-navigation/native';
import { Searchbar,SegmentedButtons,List,IconButton,Portal,Modal,Badge,DataTable  } from 'react-native-paper';
import { FilterAndSortHeader } from './MenuList_FilterAndSortHeader';


import { getAllMenuItemsByCategoryQueryable } from '../services/MenuApiService';
import AustralianCurrency from '../services/CurrencyFormat'

function MenuList({navigation}){
  const route = useRoute();
  const { selectedTable } = route.params;

  const [searchText,setSearchText] = useState("")
  const [sortBy,setSortBy] = useState("pricedes")  //nameasc,namedes,priceasc,pricedes
  const [filterCategory,setFilterCategory] = useState("All") //"All,Drink,Main"
  
  const [orderCart,setOrderCart] = useState([]) //order items
  const [menuItems,setMenuItems] = useState([])
  
  useEffect(()=>{
    async function fetchData() {
      try {
        const menuData = await getAllMenuItemsByCategoryQueryable(filterCategory,sortBy,searchText);
        setMenuItems(menuData);
      } catch (error) {
        console.error("Error fetching menu:",error)
      }
    }fetchData()
  },[searchText,sortBy,filterCategory])

  const isInCart = (id)=>orderCart.some(x=>x.id===id )
  const quantity = (id)=>isInCart(id) ?  orderCart.find(x=>x.id===(id)).quantity:  0

  const total = orderCart.reduce((acc,item)=>{
    acc += item.quantity * item.price
    return acc
  },0)
  const itemCount = orderCart.reduce((acc,item)=> {
    acc+=item.quantity
    return acc
  },0)


  const menuItem = ({item})=>{
    return <MenuItem item={item} inCart={isInCart} onPress={()=>handleAddToCart(item)} 
    handleIncrease={handleIncrease} handleDecrease={handleDecrease} quantity={quantity(item.id)}
    handleRemove={handleRemoveFromCart}
    ></MenuItem>}
  const sectionHeader = ({section}) => {return <MenuHeader section={section}/>}

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
    setOrderCart([...orderCart,{id:item.id,name:item.name,price:item.price,quantity:1,}])
  }
  function handleRemoveFromCart(id) {
    setOrderCart(orderCart.filter(x=>x.id !== id))
  }
  function handleIncrease(id) {
    setOrderCart(orderCart.map(item=>{
      if (item.id===id) {
        return {
          ...item,quantity: item.quantity + 1
        }
      }
      else {
        return item
      }
    }))
  }
  function handleDecrease(id) {
    setOrderCart(orderCart.map(item=>{
      if (item.id===id) {
        return {
          ...item,
          quantity: item.quantity -1
        }
      }
      else {
        return item
      }
    }));
  }
    return <View style={styles.mainContainer} >
      <SafeAreaView>
      <SectionList sections={menuItems}
      renderItem={menuItem}
      renderSectionHeader={sectionHeader}
      extraData={{quantity,orderCart}}
      keyExtractor={(item)=>item.id}
      ListHeaderComponent={
      <FilterAndSortHeader handleSearch={handleText} 
      total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable}
      currentFilter={filterCategory} handleCategory={handleFilterCategory} 
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

    </View>
      
}

function MenuItem({item,onPress,inCart,handleIncrease,handleDecrease,handleRemove,quantity}) {

  return (<View style={styles.menuItem}>
    <View>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Price: {AustralianCurrency(item.price)}</Text>
      {inCart(item.id)
      ?<View>
        <Text>Quantity: {quantity}</Text>
        <Button title="Increase" onPress={()=>{handleIncrease(item.id)}}></Button>
        <Button disabled={quantity===1} title="Decrease" onPress={()=>{handleDecrease(item.id)}}></Button>
        <Button disabled={!inCart(item.id)} title="Remove" onPress={()=>
          // {handleRemove(item._id)}
          Alert.alert(`Are you sure you want to remove \n${item.name} x${quantity}?`,'',[
            {
              text:"Yes",
              onPress:()=>handleRemove(item.id)
            },
            {
              text:"No",
              onPress:()=>{}
            }
          ])
          } />
      </View>
      :<Button title={inCart(item.id)?"In cart":"Add To Cart"} onPress={()=>onPress(item)}></Button>
      }
      {/* <Text>Quantity: {quantity}</Text>
      <Button title="Increase" onPress={()=>{handleIncrease(item._id)}}></Button>
      <Button disabled={quantity===1} title="Decrease" onPress={()=>{handleDecrease(item._id)}}></Button>
      <Button disabled={!inCart(item._id)} title="Remove" onPress={()=>handleRemove(item._id)} />
      <Button disabled={inCart(item._id)} title={inCart(item._id)?"In cart":"Add To Cart"} onPress={()=>onPress(item)}></Button> */}
    </View>
  </View>);
}

function MenuHeader({section}) {
  return (
    <Text style={styles.header}>{section.title}</Text>
  )
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
    menuItem: {
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
    sortBy: {
      flexDirection:'row'
    },
    sortOption: {
      height:50,
      width:50,
    },
    orderByBox: {
      flexDirection:'column',
      position:'absolute',right:60, width:'250%',top:5, backgroundColor:'white',zIndex:1,
      borderWidth: 3, borderRadius:4,
          
    }
  });

export default MenuList;