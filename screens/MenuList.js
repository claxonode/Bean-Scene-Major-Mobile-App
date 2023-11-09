import { useState } from 'react';
import {SafeAreaView, Pressable, StyleSheet, View, Text,TextInput,Dimensions, FlatList,Button,SectionList,Keyboard ,ScrollView, Alert} from 'react-native';
import {MENULIST,transformMenuForSectionList} from '../data/data';
import { useRoute } from '@react-navigation/native';
import { Searchbar,SegmentedButtons,List,IconButton,Portal,Modal,Badge,DataTable  } from 'react-native-paper';

const filterMain = MENULIST.filter(x=>x.category==="MAIN")
const filterDrink = MENULIST.filter(x=>x.category==="DRINK")
// const array= [{title:"MAIN",data:filterMain},{title:"DRINK",data:filterDrink}]


// function SelectedTableDetails() {
//   const route = useRoute();
//   const {selectedTable} = route.params;
//   return (
//     <View>
//       <Text style={{fontSize:30}}>Ordering for Table {selectedTable.name} in the {selectedTable.area} area</Text>
//       {/* You can add more details about the table if needed */}
//     </View>
//   );
// };

function FilterSearch({text,onChange}) {
  const barWidth = Dimensions.get('window').width /1.5
  return (
    <Searchbar
      placeholder="Search menu"
      onChangeText={onChange}
      value={text}
      style={{width:barWidth}}
    />
  
  );
  
}
function FilterCategory({onChange})  {
  //TO DO: make it dynamic..
  const buttonList = [
    {value:"All",label:'All'},
    {value:"Drink",label:'Drink'},
    {value:"Main",label:'Main'}]
  const [value, setValue] = useState('');
  return (<SafeAreaView>
    <SegmentedButtons
      value={value}
      onValueChange={(value)=>{
        onChange(value)
      }}
      buttons={buttonList}
    />
  </SafeAreaView>)
}
function SortOrderButton({onChange}) {
  const [expand,setExpand] = useState(false)
  const handleExpand = ()=> setExpand(!expand)
  const handleSelectOption = (sortParam)=> {
    onChange(sortParam)
    handleExpand()
  }
  const sortTypes = [
    {text:"Name ascending",param:"sortAscendName"},
    {text:"Name descending",param:"sortDescendName"},
    {text:"Price ascending",param:"sortAscendPrice"},
    {text:"Price descending",param:"sortDescendPrice"},]

  const listSortTypes = sortTypes.map(item=>
    <View key={item=>item.name}>
      <Pressable onPress={() => handleSelectOption(item.param)}>
        <Text>{item.text}</Text>
      </Pressable>
    </View>
    )
  return (
    // <IconButton icon="sort" size={30} onPress={handlePress}>
      <View style={{flexDirection:'column',position:'relative'}}>
        <View>
          <IconButton icon="sort" size={30} onPress={handleExpand}></IconButton>
        </View>
        {expand===true
        ? 
        <View style={
          {flexDirection:'column',
          position:'absolute',right:60, width:'250%',bottom:5, backgroundColor:'white',zIndex:1,
          borderWidth: 3, borderRadius:4,
          }
          }>
            {listSortTypes}
        </View>
        :<></>}
        
      </View>
  );
}

function ShoppingCart({total,itemCount,orderCart,selectedTable}){
  const [visible, setVisible] = useState(false);
  const showModal = ()=> {setVisible(true)}
  const hideModal = ()=> {setVisible(false)}
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const currencyFormat = new Intl.NumberFormat('en-AU',{style:'currency', currency:'AUD'})
  // console.log(total)
  // console.log(itemCount)
  // console.log(orderCart)
  console.log(selectedTable)
  const productNameWidth = Dimensions.get('window').width /2
  const orderItems = orderCart.map(item=> {
    return <View >
      <View style={{flexDirection:'row',gap:40}}>
        <Text style={{width:productNameWidth}}>{item.name}</Text>
        <Text>x{item.quantity}</Text>
        <Text>{currencyFormat.format(item.price)}</Text>
        
      </View>
      
    </View>});
  // const orderItems = orderCart.map(item=>{
  //     return <DataTable.Row key={item=>item.id}>
  //       <DataTable.Cell>{item.name}</DataTable.Cell>
  //       <DataTable.Cell>x {item.quantity}</DataTable.Cell>
  //       <DataTable.Cell>{currencyFormat.format(item.price)}</DataTable.Cell>
  //     </DataTable.Row>
  //   })
    
  

  return (
    <View style={{position:'relative'}}>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal}  contentContainerStyle={containerStyle}>
          <Text style={{fontSize:35}}>Total: {currencyFormat.format(total)}</Text>
          <Text style={{fontSize:20}}>Table: {selectedTable.name} at Area: {selectedTable.area}</Text>
          {/* {orderItems} */}
            {orderItems}
          <Button title="Submit"></Button>
        </Modal>
      </Portal>
      {/* <View style={{flexDirection:'row'}}> */}
        <IconButton icon="cart" onPress={itemCount&&showModal} style={{position:'absolute'}}></IconButton>
        {itemCount===0?<></>:<Badge>{itemCount}</Badge>}
        
      {/* </View> */}
      
      
    </View>
  );
}

function FilterAndSortHeader({handleSearch,handleCategory,handleSort,total,itemCount,orderCart,selectedTable}) {
  //To Do needs to be sticky
  return <View>
    {/* <SelectedTableDetails></SelectedTableDetails> */}
    <View style={{flexDirection:'row'}}>
      <FilterSearch onChange={handleSearch}></FilterSearch>
      <SortOrderButton onChange={handleSort}></SortOrderButton>
      {/*Geoff ToDo: Add a shopping cart icon, that uses modal to confirm order.. when you click submit it post to the server*/}
      {/* Also button style for each item can change. */}
      <ShoppingCart total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} ></ShoppingCart>
    </View>
    <FilterCategory onChange={handleCategory}></FilterCategory>
    
  </View>
}

function MenuList({navigation}){
  const route = useRoute();
  const { selectedTable } = route.params;

  const [searchText,setSearchText] = useState("")
  const [sortBy,setSortBy] = useState("sortDescendPrice")  //sortAscendName,sortDescendName,sortAscendPrice,sortDescendPrice
  const [filterCategory,setFilterCategory] = useState("all") //"All,Drink,Main"
  const [orderCart,setOrderCart] = useState([]) //order items
  //not sure how to store data to share between screens
  

  const data = transformMenuForSectionList(MENULIST,searchText,sortBy,filterCategory)
  
  const isInCart = (id)=>orderCart.some(x=>x.id===id)
  const quantity = (id)=>isInCart(id) ?  orderCart.find(x=>x.id===id).quantity:  0
  const total = orderCart.reduce((acc,item)=>{
    acc += item.quantity * item.price
    return acc
  },0)
  const itemCount = orderCart.reduce((acc,item)=> {
    acc+=item.quantity
    return acc
  },0)
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
    setOrderCart([...orderCart,{id:item._id,name:item.name,price:item.price,quantity:1,}])
  }
  function handleRemoveFromCart(id) {
    setOrderCart(orderCart.filter(x=>x.id !== id))
  }
  function handleIncrease(id) {
    setOrderCart(orderCart.map(item=>{
      if (item.id===id) {
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

    <SectionList sections={data}
      renderItem={renderItem}
      renderSectionHeader={sectionHeader}
      extraData={{quantity,orderCart}}
      keyExtractor={(item,index)=>`${index}+${item.id}`}
      ListHeaderComponent={
      <FilterAndSortHeader handleSearch={handleText} 
      total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable}
      handleCategory={handleFilterCategory} handleSort={handleSortBy} />}
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
    {/* <FlatList data={MENULIST}
    renderItem={renderItem}
    extraData={quantity}
    keyExtractor={item=>item._id}
    ListFooterComponent={<Button disabled={orderCart.length===0} title={"View Order"} 
    onPress={()=>navigation.
      navigate("New Order",{
        orderCart: orderCart,
        total:total
      })}/>}
    >
    </FlatList> */}

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
      {inCart(item._id)
      ?<View>
        <Text>Quantity: {quantity}</Text>
        <Button title="Increase" onPress={()=>{handleIncrease(item._id)}}></Button>
        <Button disabled={quantity===1} title="Decrease" onPress={()=>{handleDecrease(item._id)}}></Button>
        <Button disabled={!inCart(item._id)} title="Remove" onPress={()=>
          // {handleRemove(item._id)}
          Alert.alert(`Are you sure you want to remove \n${item.name} x${quantity}?`,'',[
            {
              text:"Yes",
              onPress:()=>handleRemove(item._id)
            },
            {
              text:"No",
              onPress:()=>{}
            }
          ])
          } />
      </View>
      :<Button title={inCart(item._id)?"In cart":"Add To Cart"} onPress={()=>onPress(item)}></Button>
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
    sortBy: {
      flexDirection:'row'
    },
    sortOption: {
      height:50,
      width:50,
    }
  });

export default MenuList;