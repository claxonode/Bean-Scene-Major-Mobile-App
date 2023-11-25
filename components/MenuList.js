import { useEffect, useState } from 'react';
import { SafeAreaView, Pressable, StyleSheet, View, Dimensions, FlatList,Text as TextNormal, Button, SectionList, Keyboard, ScrollView, Alert } from 'react-native';
import { MENULIST, transformMenuForSectionList } from '../data/data';
import { useRoute } from '@react-navigation/native';
import { Searchbar, SegmentedButtons, List, IconButton, Portal, Modal,useTheme, Badge, DataTable,Text,TextInput} from 'react-native-paper';
import { FilterAndSortHeader } from './MenuList_FilterAndSortHeader'


import { getAllMenuItemsByCategoryQueryable } from '../services/MenuApiService';
import { AustralianCurrency,Categories } from '../services/FormatService'


/**
 * @function MenuList - A function which shows all the menu items
 * @param {object} selectedTable The order's assigned table
 * @param {Array of objects} existingOrder If we navigate from edit order, it will send a order to populate the shopping cart.
 * @returns {JSX}
 */
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

  //In cart functions
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

  //State handlers
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
  const menuItem = ({ item }) => {
    return <MenuItem item={item} inCart={isInCart} cartItemQuantity={quantity(item.name)} cartItemNote={cartItemNote(item.name)}
      onPress={() => handleAddToCart(item)}
      handleIncrease={handleIncrease} handleDecrease={handleDecrease} 
      handleRemove={handleRemoveFromCart} handleNote={handleNote}
    ></MenuItem>
  }
  const sectionHeader = ({ section }) => { return <MenuHeader section={section} /> }

  return <SafeAreaView style={styles.mainContainer}>
    <FilterAndSortHeader style={styles.filterBar}
          handleSearch={handleText} query={searchText}//SearchBar
          total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} existingOrder={existingOrder} //Shopping cart
          // categories={categories}//filter buttons
          handleCategory={handleFilterCategory} //FilterCategory
          handleSort={handleSortBy} />
    <SectionList sections={menuItems}
      renderItem={menuItem}
      renderSectionHeader={sectionHeader}
      extraData={{ quantity, orderCart }}
      keyExtractor={(item) => item.name}
      // ListHeaderComponent ={
      //   <FilterAndSortHeader 
      //     handleSearch={handleText} //SearchBar
      //     total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} existingOrder={existingOrder} //Shopping cart
      //     handleCategory={handleFilterCategory} //FilterCategory
      //     handleSort={handleSortBy} />} //SortMenuItemsButton
      // StickyHeaderComponent={<FilterAndSortHeader 
      //   handleSearch={handleText} //SearchBar
      //   total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} existingOrder={existingOrder} //Shopping cart
      //   handleCategory={handleFilterCategory} //FilterCategory
      //   handleSort={handleSortBy} />}
      // stickyHeaderIndices={[0]}
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
/**
 * @function MenuItem - An individual menu item.
 * @param {object} selectedTable The order's assigned table
 * @param {function} existingOrder If we navigate from edit order, it will send a order to populate the shopping cart.
 * @param {boolean} inCart - Check if this item exists in the cart.
 * @param {int} cartItemQuantity - The quantity of an item
 * @param {string} cartItemNote - Initial value of the note
 * @param {function} handleIncrease - A setter function which increments an item
 * @param {function} handleDecrease - A setter function which decrements an item
 * @param {function} handleRemove - A setter function which removes an item
 * @param {function} handleNote - A setter function which adds a note to an item
 * @returns {JSX}
 */
function MenuItem({ item, onPress, inCart, cartItemQuantity,cartItemNote, handleIncrease, handleDecrease, handleRemove,handleNote }) {
  const theme = useTheme()
  const [text,setText] = useState((cartItemNote!==undefined &&cartItemNote!==null )?cartItemNote:"")
  const [visible,setVisible] = useState(false)
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onRemovePress = () => Alert.alert(`Are you sure you want to remove \n${item.name} x${cartItemQuantity}?`, '', [
    {
      text: "Yes",
      onPress: () => handleRemove(item.name)
    },
    {
      text: "No",
      onPress: () => { }
    }
  ])

  const handleSubmit = (itemName,text)=>{
    handleNote(itemName,text)
    hideModal()
  }

return (
  <View style={(inCart(item.name))?[styles.menuItem,{backgroundColor:theme.colors.secondaryContainer}]:[styles.menuItem,{backgroundColor:theme.colors.primaryContainer}]}>
  {/* // <View style={[styles.menuItemInCart]}> */}
    <View style={{flexDirection:'row'}}>
      {/* <View style={inCart(item.name)?styles.menuItemLeftBoxWidthIcon:styles.menuItemLeftBoxNormal}> */}
      <View style={styles.menuItemDescription}>
        <Text>{item.name}</Text>
        <Text>{item.description}</Text>
        <Text>Price: {AustralianCurrency(item.price)}</Text>
        {inCart(item.name) && cartItemNote!==undefined &&cartItemNote!==null &&<Text>Notes: {cartItemNote}</Text>}
      </View>
      {inCart(item.name)
    && 
    <View style={styles.menuItemIconContainer}>
        <View style={styles.menuItemIconRow}>
        <IconButton disabled={cartItemQuantity === 1} size={30} icon={"minus-circle"} onPress={() => { handleDecrease(item.name) }}></IconButton>
        <Text style={{fontWeight:'bold'}}>{cartItemQuantity}</Text>
        <IconButton icon={"plus-circle"} size={30} onPress={() => { handleIncrease(item.name) }}></IconButton>
        
        </View>
        <View style={styles.menuItemIconRow}>
        <IconButton disabled={!inCart(item.name)} size={30} icon="delete" onPress={() => onRemovePress()} />
        <IconButton icon="comment-edit" onPress={showModal} size={30}></IconButton>
        </View>
        

        <Portal>
          <OrderItemNotesModal item={item} cartItemQuantity={cartItemQuantity} text={text} setText={setText} handleSubmit={handleSubmit}
          hideModal={hideModal} visible={visible}
         ></OrderItemNotesModal>
        </Portal>
        
      </View>
    }
    </View>
    {!inCart(item.name) &&<Button title="Add To Cart" onPress={() => {onPress(item) }}></Button>}
  </View>
);
}

/**
 * @function MenuHeader - The header for each menu list's section
 * @param {Array of objects} section The order's assigned table
 * @returns {JSX}
 */
function MenuHeader({ section }) {
  return (
    <Text style={styles.menuHeader}>{section.title}</Text>
  )
}

/**
 * @function OrderItemNotesModal A component used to edit an individual menu items note.
 * @param {object} item - The item
 * @param {int} cartItemQuantity - The item's quantity
 * @param {string} text - The text of the note
 * @param {function} setText - The setter function for the note
 * @param {function} handleSubmit - The function that adds a note into the ordercart
 * @param {function} hideModal - A function that hide the modal
 * @param {boolean} visible - Check whether the modal should be visible or not
 * @returns {JSX}
 */
function OrderItemNotesModal({item,cartItemQuantity,text,setText,handleSubmit,hideModal,visible}) {
  return (
    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{backgroundColor:'white',padding:20}}>
      <TextNormal>{item.name} x{cartItemQuantity} {AustralianCurrency(item.price)}</TextNormal>
      <TextInput label='Notes' value={text} onChangeText={setText} multiline={true} maxLength={250}
      right={text&&<TextInput.Icon icon="close" onPress={()=>setText("")}></TextInput.Icon>}
      ></TextInput>
      <Button title='Submit' onPress={()=>handleSubmit(item.name,text)}></Button>
      <Button title='Cancel' onPress={hideModal}></Button>
    </Modal>

  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    margin: 2,
    flex:1
  },
  menuItem: {
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
  menuItemDescription: {
    flex:4
  },
  menuItemIconContainer: {
    flex:2,alignItems:'center',
  },
  menuItemIconRow: {
    flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'
  },
  menuItemLeftBoxNormal: {
  },
  menuHeader: {
    fontSize: 25
  },

});

export default MenuList;