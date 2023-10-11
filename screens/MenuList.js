import { useState } from 'react';
import { Pressable, StyleSheet, View, Text,TextInput, FlatList,Button,SectionList,Keyboard ,ScrollView, VirtualizedList} from 'react-native';
import {MENULIST,transformMenuForSectionList} from '../data/data';

const filterMain = MENULIST.filter(x=>x.category==="MAIN")
const filterDrink = MENULIST.filter(x=>x.category==="DRINK")
// const array= [{title:"MAIN",data:filterMain},{title:"DRINK",data:filterDrink}]

let i = 0;
function FilterSearch({text,onChange}) {

  return <TextInput
  style={styles.input} 
  onChangeText={onChange}
  value={text}
  placeholder='Enter a menu item name'
  maxLength={40}
  >
  </TextInput>
}
function FilterCategory({onChange})  {
  return <View>
    <Button title='All' onPress={()=>onChange("All")}></Button>
    <Button title='Drink'onPress={()=>onChange("Drink")}></Button>
    <Button title='Main'onPress={()=>onChange("Main")}></Button>
  </View>
}
function SortOrderButton({onChange}) {
  return <View>
    <Button title='Sort by Name Ascending' onPress={()=>onChange("sortAscendName")}></Button>
    <Button title='Sort by Name Descending' onPress={()=>onChange("sortDescendName")}></Button>
    <Button title='Sort by Price Ascending' onPress={()=>onChange("sortAscendPrice")}></Button>
    <Button title='Sort by Price Descending' onPress={()=>onChange("sortDescendPrice")}></Button>
  </View>
}
function FilterAndSortHeader({handleSearch,handleCategory,handleSort}) {
  return <View>
    <FilterSearch onChange={handleSearch}></FilterSearch>
    <FilterCategory onChange={handleCategory}></FilterCategory>
    <SortOrderButton onChange={handleSort}></SortOrderButton>
  </View>
}

function MenuList({navigation}){
  const [searchText,setSearchText] = useState("")
  const [sortBy,setSortBy] = useState("sortDescendPrice")  //sortAscendName,sortDescendName,sortAscendPrice,sortDescendPrice
  const [filterCategory,setFilterCategory] = useState("all") //"All,Drink,Main"
  const [orderCart,setOrderCart] = useState([]) //order items
  //not sure how to store data to share between screens

  const data = transformMenuForSectionList(MENULIST,searchText,sortBy,filterCategory)
  
  const isInCart = (id)=>orderCart.some(x=>x.id===id)
  const quantity = (id)=>isInCart(id) ?  orderCart.find(x=>x.id===id).quantity:  0
  //TO DO: Style FilterSearch
  //TO DO: add <CreateOrder> at SectionList's ListFooterComponent

  const renderItem = ({item})=>{
    return <MenuItem item={item} inCart={isInCart} onPress={()=>handleAddToCart(item)} 
    handleIncrease={handleIncrease} handleDecrease={handleDecrease} quantity={quantity(item._id)}
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
    setOrderCart([...orderCart,{id:item._id,data:item,quantity:1}])
  }
  function handleRemoveFromCart(id) {
    setOrderCart(orderCart.filter(x=>x.data._id !== id))
  }
  function handleIncrease(id) {
    setOrderCart(orderCart.map(item=>{
      if (item.data._id===id) {
        // item.data.quantity++
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
      if (item.data._id===id) {
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

    <SectionList sections={data}
      renderItem={renderItem}
      renderSectionHeader={sectionHeader}
      extraData={quantity}
      keyExtractor={(item,index)=>`${index}+${item.id}`}
      ListHeaderComponent={<FilterAndSortHeader handleSearch={handleText} handleCategory={handleFilterCategory} handleSort={handleSortBy} />}
      ListFooterComponent={
      <Button disabled={orderCart.length===0} title={"View Order"} 
      onPress={()=>navigation.
        navigate("New Order",{
          orderCart: orderCart,
        })}/>}
    >
    </SectionList>

    </View>
      
}
// <FilterSearch onChange={handleText}/>
//<FilterCategory onChange={handleFilterCategory}/>
//<SortOrderButton onChange={handleSortBy}></SortOrderButton>

function MenuItem({item,onPress,inCart,handleIncrease,handleDecrease,handleRemove,quantity}) {
  const price = new Intl.NumberFormat('en-AU',{style:'currency', currency:'AUD'}).format(item.price);
  return (<View style={styles.item}>
    {/* <Pressable></Pressable> */}
    <View>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Price: {price}</Text>
      <Text>Quantity: {quantity}</Text>
      <Button title="Increase" onPress={()=>{handleIncrease(item._id)}}></Button>
      <Button disabled={quantity===1} title="Decrease" onPress={()=>{handleDecrease(item._id)}}></Button>
      <Button disabled={!inCart(item._id)} title="Remove" onPress={()=>handleRemove(item._id)} />
      <Button disabled={inCart(item._id)} title={inCart(item._id)?"In cart":"Add To Cart"} onPress={()=>onPress(item)}></Button>
    </View>
  </View>);
}

function MenuHeader({section}) {
  return <Text style={styles.header}>{section.title}</Text>
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

export default MenuList;