import { Searchbar, SegmentedButtons, IconButton, Portal, Modal, Badge, TextInput, Button, Divider } from 'react-native-paper';
import { View, SafeAreaView, Pressable, Text, Dimensions, StyleSheet, Button as ButtonNormal, Alert, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AustralianCurrency } from '../services/FormatService'
import { postNewOrder, updateOrder } from '../services/OrderApiService'
import { getMenuCategories } from '../services/MenuApiService'

/**
 * @function FilterSearch - A component that is used to filter the menu items via the menu item's name
 * @param {useState} onChange - A function that sets the query's state
 * @param {string} query - The text within the query
 * @param {string} placeholder - Placeholder text for the search bar
 * @returns {JSX}
 */
export function FilterSearch({ onChange,query,placeholder }) {
    return (
        <Searchbar
            placeholder={placeholder}
            onChangeText={(text) => {
                onChange(text)
            }}
            value={query}
            style={styles.filterTextInputBox}

        />
    );
}

/**
 * @function FilterCategory - A component that is used to filter the menu items via category
 * @param {useState} onChange - A function that sets the state for which category we want to filter
 * @returns {JSX}
 */
function FilterCategory({ onChange }) {
    const [buttonList, setButtonList] = useState([])
    // const buttonList = [
    //     { value: "All", label: 'All' },
    //     { value: "Drink", label: 'Drink' },
    //     { value: "Main", label: 'Main' },
    //     { value: "Burger", label: 'Burger' },
    //     { value: "Pasta", label: 'Pasta' },
    //     { value: "Dessert", label: 'Dessert' },
    //     { value: "Noodle", label: 'Noodle' },
    //     { value: "Rice", label: 'Rice' },
    //     { value: "Breakfast", label: 'Breakfast' }]
    const onValueChange = (value) => {
        onChange(value)
    }

    useEffect(() => {
        async function fetchData() {
            const data = await getMenuCategories();
            setButtonList(data)
        } fetchData()
    }, [])

    const renderItem = ({ item }) => {
        return <View>
            <Button onPress={() => { onValueChange(item.value) }}>{item.label}</Button>
        </View>
    }
    return (
        <SafeAreaView >
            <FlatList horizontal data={buttonList} keyExtractor={item => `${item.label}`}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
};


/**
 * @function SortMenuItemsButton - A component that is used to sort the order of the menu items being displayed
 * @param {useState} onChange - A function that sets the state for how to we want to sort the menu items being displayed
 * @returns {JSX}
 */
function SortMenuItemsButton({ onChange }) {
    const [expand, setExpand] = useState(false)
    const handleExpand = () => setExpand(!expand)
    const handleSelectOption = (sortParam) => {
        onChange(sortParam)
        handleExpand()
    }
    const sortTypes = [
        { text: "Name ascending", param: "nameasc" },  //nameasc,namedes,priceasc,pricedes
        { text: "Name descending", param: "namedes" },
        { text: "Price ascending", param: "priceasc" },
        { text: "Price descending", param: "pricedes" },]

    const listSortTypes = sortTypes.map(item =>
        <View style={{ flex: 1, alignItems: 'center' }} key={`Id_${item.param}`}>
            <Pressable onPress={() => handleSelectOption(item.param)}>
                <Text>{item.text}</Text>
            </Pressable>
        </View>
    )
    return (
        <View style={styles.sortOrderByContainer}>
            <View>
                <IconButton icon="sort" size={30} onPress={handleExpand}></IconButton>
            </View>
            {expand === true &&
                <View style={styles.sortOrderByPopup}>
                    {listSortTypes}
                </View>
            }
        </View>
    );
}
/**
 * @function ShoppingCart - A component that represents the shopping cart icon. When pressed it displays a modal which is used to confirm the order
 * @param {int} total - The total price for the entire order
 * @param {int} itemCount - The item count within an order
 * @param {Array of objects} orderCart - The order cart
 * @param {object} selectedTable - The order that the table is selected for
 * @param {Array of objects} existingOrder - Used to populate data when it is used for editting an order.
 * @returns {JSX}
 */
function ShoppingCart({ total, itemCount, orderCart, selectedTable, existingOrder }) {
    // const navigation = useNavigation();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [notes, setNotes] = useState(existingOrder === null ? "" : existingOrder.notes)
    const showModal = () => { setVisible(true) }
    const hideModal = () => { setVisible(false) }

    
    return (
        <View style={styles.shoppingCartView}>
            <Portal>
                <ConfirmShoppingCartModal visible={visible} 
                hideModal={hideModal} total={total} notes={notes} setNotes={setNotes} selectedTable={selectedTable}
                orderCart={orderCart} existingOrder={existingOrder} navigation={navigation}
                />
            </Portal>
            {/* <View style={{flexDirection:'row'}}> */}
            <IconButton icon="cart" onPress={itemCount && showModal} style={styles.shoppingCartIcon}></IconButton>
            {itemCount !== 0 && <Badge><Text style={{fontWeight:'bold'}}>{itemCount}</Text></Badge>}

        </View>
    );
}
/**
 * @function ConfirmShoppingCartModal - A modal that displays data to confirm an order.
 * @param {boolean} visible - Determines whether the modal is visible
 * @param {function} hideModal - The function that hides the modal
 * @param {int} total - The total price for the entire order
 * @param {string} notes - The initial value of the notes
 * @param {function} setNotes - A setter function that sets the note
 * @param {object} selectedTable - The order that the table is selected for
 * @param {Array of objects} orderCart - A representation of the current order
 * @param {Array of objects} existingOrder - Used to populate data when it is used for editting an order and to determine it is going to POST or do PUT call
 * @param {object} navigation - It is the useNavigation() function for navigating between screens
 * @returns {JSX}
 */
function ConfirmShoppingCartModal({visible,hideModal,total,notes,setNotes,selectedTable,orderCart,existingOrder,navigation}) {
    const handleSubmission = async (existingOrder) => {
        let jsonData = {
            tableNumber: selectedTable.name,
            orderItems: orderCart,
            orderStatus: "PENDING",
            notes: notes
        }
        if (existingOrder !== null) {
            jsonData["orderId"] = existingOrder.orderId
            updateOrder(jsonData).then((data) => {
                hideModal()
                Alert.alert(`Updated order at ${jsonData.tableNumber}`, '', [
                    {
                        text: "Ok",
                        onPress: () => navigation.navigate("Home")
                    },
                ])
            }).catch((error) => {
                Alert.alert(`${error}` + " could not update order")
            })
        }
        if (existingOrder === null) {
            postNewOrder(jsonData).then((data) => {
                hideModal()
                Alert.alert(`Created order at ${jsonData.tableNumber}`, '', [
                    {
                        text: "Ok",
                        onPress: () => navigation.navigate("Home")
                    },
                ])
            }).catch((error) => {
                Alert.alert(`${error}` + " could not create order")
            })
        }
    }
    const orderItems = orderCart.map((item, index) => {
        return <View key={`${item.id}_cart_${index}`}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={styles.shoppingCartOrderItemsName}>{item.name}</Text>
                <Text style={styles.shoppingCartQuantity}>x{item.quantity}</Text>
                <Text style={styles.shoppingCartCurrency}>{AustralianCurrency(item.price)}</Text>
            </View>
            {item.note && <Text>&#10148;Notes: {item.note}</Text>}
        </View>
    });
    return (
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBoxContainer}>
            <Text style={styles.modalHeader}>Total: {AustralianCurrency(total)}</Text>
            <Text style={styles.modalSubHeader}>Table: {selectedTable.name} at Area: {selectedTable.area}</Text>
            {orderItems}
            <TextInput label="Additional Notes" value={notes} onChangeText={setNotes} multiline={true} maxLength={250}
            right={notes&&<TextInput.Icon icon="close" onPress={()=>setNotes("")}></TextInput.Icon>}
            ></TextInput>
            <ButtonNormal title="Submit" onPress={() => handleSubmission(existingOrder)}></ButtonNormal>
        </Modal>
    );
}

/**
 * @function FilterAndSortHeader - A sticky header bar which is used to filter/sort the menu items as well as create/update an order.
 * @param {string} query - The text within the query
 * @param {function} handleSearch - Function that sets the query
 * @param {function} handleCategory - Function that sets the category
 * @param {function} handleSort - Function that sets the the sort value
 * @param {int} total - The total price for the entire order
 * @param {int} itemCount - The initial value of the notes
 * @param {object} selectedTable - The order that the table is selected for
 * @param {Array of objects} orderCart - A representation of the current order
 * @param {Array of objects} existingOrder - Used to populate data when it is used for editting an order and to determine it is going to POST or do PUT call
 * @returns {JSX}
 */
export function FilterAndSortHeader({ query,handleSearch, handleCategory, handleSort, total, itemCount, orderCart, selectedTable, existingOrder }) {

    return <View style={styles.filterAndSortHeader}>
        <View style={{ flexDirection: 'row' }}>
            <FilterSearch onChange={handleSearch} query={query} placeholder={"Search menu"}>
            </FilterSearch>
            <SortMenuItemsButton onChange={handleSort}></SortMenuItemsButton>
            <ShoppingCart total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} existingOrder={existingOrder} ></ShoppingCart>
        </View>
        <FilterCategory onChange={handleCategory}></FilterCategory>
    </View>
}


const styles = StyleSheet.create({
    filterAndSortHeader: {
        paddingBottom: 10
    },
    modalHeader: {
        fontSize: 35
    },
    modalSubHeader: {
        fontSize: 20
    },
    modalBoxContainer: {
        backgroundColor: 'white', padding: 20
    },
    shoppingCartView: {
        position: 'relative'
    },
    shoppingCartIcon: {
        position: 'absolute'
    },
    // shoppingCartOrderItemsName: {
    //     flex:1
    // },
    // shoppingCartQuantity: {
    //     flex:1
    // },
    // shoppingCartCurrency: {
    //     flex:1
    // },
    shoppingCartComment: {
        // position:'absolute',
        bottom: 12
    },
    sortOrderByPopup: {
        flexDirection: 'column',
        position: 'absolute',
        right: -60, width: '250%', top: 50,
        backgroundColor: 'white', zIndex: 1,
        borderWidth: 1, borderRadius: 4,

    },
    sortOrderByContainer: {
        flexDirection: 'column',
        position: 'relative'
    },
    filterTextInputBox: {
        width: '66.66%'
    }
});

