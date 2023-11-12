import { Searchbar, SegmentedButtons, IconButton, Portal, Modal, Badge, TextInput } from 'react-native-paper';
import { View, SafeAreaView, Pressable, Text, Dimensions, StyleSheet, Button, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AustralianCurrency } from '../services/FormatService'
import { postNewOrder,updateOrder } from '../services/OrderApiService'


function FilterSearch({ onChange }) {
    const [query, setQuery] = useState('')
    return (
        <Searchbar
            placeholder="Search menu"
            onChangeText={(text) => {
                setQuery(text)
                onChange(text)
            }}
            value={query}
            style={styles.filterTextInputBox}

        />
    );
}

function FilterCategory({ onChange }) {
    //TO DO: make it dynamic..
    const [currentFilter, setCurrentFilter] = useState("All")
    const buttonList = [
        { value: "All", label: 'All' },
        { value: "Drink", label: 'Drink' },
        { value: "Main", label: 'Main' }]
    return (<SafeAreaView>
        <SegmentedButtons
            value={currentFilter}
            onValueChange={(value) => {
                setCurrentFilter(value)
                onChange(value)
            }}
            buttons={buttonList}
        />
    </SafeAreaView>)
}


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
        <View key={`Id_${item.param}`}>
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

function ShoppingCart({ total, itemCount, orderCart, selectedTable, existingOrder }) {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [notes, setNotes] = useState(existingOrder===null?"":existingOrder.notes)
    const showModal = () => { setVisible(true) }
    const hideModal = () => { setVisible(false) }

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
        if (existingOrder===null) {
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

    return (
        <View style={styles.shoppingCartView}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBoxContainer}>
                    <Text style={styles.modalHeader}>Total: {AustralianCurrency(total)}</Text>
                    <Text style={styles.modalSubHeader}>Table: {selectedTable.name} at Area: {selectedTable.area}</Text>
                    {orderItems}
                    <TextInput label="Additional Notes" value={notes} onChangeText={setNotes} multiline={true} maxLength={250}></TextInput>
                    <Button title="Submit" onPress={() => handleSubmission(existingOrder)}></Button>
                </Modal>
            </Portal>
            {/* <View style={{flexDirection:'row'}}> */}
            <IconButton icon="cart" onPress={itemCount && showModal} style={styles.shoppingCartIcon}></IconButton>
            {itemCount !== 0 && <Badge>{itemCount}</Badge>}

        </View>
    );
}


export function FilterAndSortHeader({ handleSearch, handleCategory, handleSort, total, itemCount, orderCart, selectedTable, existingOrder }) {
    //To Do needs to be sticky
    return <View>
        {/* <SelectedTableDetails></SelectedTableDetails> */}
        <View style={{ flexDirection: 'row' }}>
            <FilterSearch onChange={handleSearch} >
            </FilterSearch>
            <SortMenuItemsButton onChange={handleSort}></SortMenuItemsButton>
            {/*Geoff ToDo: Add a shopping cart icon, that uses modal to confirm order.. when you click submit it post to the server*/}
            {/* Also button style for each item can change. */}
            <ShoppingCart total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} existingOrder={existingOrder} ></ShoppingCart>
        </View>
        <FilterCategory onChange={handleCategory}></FilterCategory>

    </View>
}

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
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
        right: 60, width: '250%', top: 5,
        backgroundColor: 'white', zIndex: 1,
        borderWidth: 3, borderRadius: 4,

    },
    sortOrderByContainer: {
        flexDirection: 'column',
        position: 'relative'
    },
    filterTextInputBox: {
        width: screenWidth / 1.5
    }
});

