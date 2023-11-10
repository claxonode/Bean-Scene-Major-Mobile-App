import { Searchbar, SegmentedButtons, IconButton, Portal, Modal, Badge } from 'react-native-paper';
import { View, SafeAreaView, Pressable, Text,Dimensions,StyleSheet,Button,Alert } from 'react-native';
import {useState } from 'react';
import {useNavigation} from '@react-navigation/native';
import AustralianCurrency from '../services/CurrencyFormat'
import {postNewOrder} from '../services/OrderApiService'


function FilterSearch({ text, onChange }) {
    return (
        <Searchbar
            placeholder="Search menu"
            onChangeText={onChange}
            value={text}
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


function SortOrderButton({ onChange }) {
    const [expand, setExpand] = useState(false)
    const handleExpand = () => setExpand(!expand)
    const handleSelectOption = (sortParam) => {
        onChange(sortParam)
        handleExpand()
    }
    //key not working here??
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

function ShoppingCart({ total, itemCount, orderCart, selectedTable}) {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const showModal = () => { setVisible(true) }
    const hideModal = () => { setVisible(false) }

    const orderItems = orderCart.map((item,index) => {
        return <View key={`${item.id}_cart_${index}`}>
            <View  style={{ flexDirection: 'row', gap: 40 }}>
                <Text style={styles.shoppingCartOrderItemsName}>{item.name}</Text>
                <Text>x{item.quantity}</Text>
                <Text>{AustralianCurrency(item.price)}</Text>
            </View>
        </View>
    });
    const handleSubmission = async()=> {
        let post = {
            tableNumber: selectedTable.name,
            orderItems: orderCart,
            orderStatus: "PENDING"
        }
        postNewOrder(post).then((data)=> {
            hideModal()
            Alert.alert(`Created order `, '', [
                {
                  text: "Ok",
                  onPress: () => navigation.navigate("Home")
                },
            ])
        }).catch((error)=> {
            Alert.alert(`${error}`+" could not create order")
        })
        
    }

    return (
        <View style={styles.shoppingCartView}>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalBoxContainer}>
                    <Text style={styles.modalHeader}>Total: {AustralianCurrency(total)}</Text>
                    <Text style={styles.modalSubHeader}>Table: {selectedTable.name} at Area: {selectedTable.area}</Text>
                    {orderItems}
                    <Button title="Submit" onPress={handleSubmission}></Button>
                </Modal>
            </Portal>
            {/* <View style={{flexDirection:'row'}}> */}
            <IconButton icon="cart" onPress={itemCount && showModal} style={styles.shoppingCartIcon}></IconButton>
            {itemCount !== 0 && <Badge>{itemCount}</Badge>}

        </View>
    );
}

export function FilterAndSortHeader({ handleSearch, currentFilter, handleCategory, handleSort, total, itemCount, orderCart, selectedTable }) {
    //To Do needs to be sticky
    return <View>
        {/* <SelectedTableDetails></SelectedTableDetails> */}
        <View style={{ flexDirection: 'row' }}>
            <FilterSearch onChange={handleSearch} currentFilter={currentFilter}></FilterSearch>
            <SortOrderButton onChange={handleSort}></SortOrderButton>
            {/*Geoff ToDo: Add a shopping cart icon, that uses modal to confirm order.. when you click submit it post to the server*/}
            {/* Also button style for each item can change. */}
            <ShoppingCart total={total} itemCount={itemCount} orderCart={orderCart} selectedTable={selectedTable} ></ShoppingCart>
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
    shoppingCartOrderItemsName: {
        width: screenWidth/2
    },
    sortOrderByPopup: {
        flexDirection:'column',
        position:'absolute',
        right:60, width:'250%',top:5, 
        backgroundColor:'white',zIndex:1,
        borderWidth: 3, borderRadius:4,
          
    },
    sortOrderByContainer: {
        flexDirection: 'column', 
        position: 'relative'
    },
    filterTextInputBox: {
        width: screenWidth/1.5
    }
});

