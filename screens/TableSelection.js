import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, { useEffect, useState} from 'react';
import { View, Text, Button, SectionList, SafeAreaView, StyleSheet, Pressable } from 'react-native';
import {getAllTables} from "../services/TableApiService"
import { SegmentedButtons } from 'react-native-paper';



export default function TableSelection() {
  const navigation = useNavigation();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentArea,setCurrentArea] = useState("Main")

  const onTableSelect = (selectedTable) => {
    // Handle the selected table
    console.log('Selected table:', selectedTable);
    // Add your logic for handling the selected table
    navigation.navigate('MenuList', { selectedTable });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const tablesData = await getAllTables();
        setTables(tablesData);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    }

    fetchData();
  }, []);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    onTableSelect(table);
  };

 
  const groupTablesByArea = () => {
    const groupedTables = tables.reduce((acc, table) => {
      acc[table.area] = acc[table.area] || [];
      acc[table.area].push(table);
      return acc;
    }, {});

    if (currentArea === 'All') {
      return Object.keys(groupedTables).map((area) => ({
        title: area,
        data: groupedTables[area],
      }));
    } else {
      return [
        {
          title: currentArea,
          data: groupedTables[currentArea] || [],
        },
      ];
    }
  };

  return (
    <View>
      <SafeAreaView >
        <SegmentedButtons
          value={currentArea}
          onValueChange={setCurrentArea}
          buttons={[
            {
              value: 'All',
              label: 'All'
            },
            {
              value: 'Main',
              label: 'Main'
            },
            {
              value: 'Balcony',
              label: 'Balcony'
            },
            {
              value: 'Outside',
              label: 'Outside'
            }
            
          ]}
        />
      </SafeAreaView>

      <SectionList
        sections={groupTablesByArea()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.button} onPress={() => handleTableSelect(item)}>
           <Text style={styles.text}>Table {item.name}: {item.area} area</Text>           
          </Pressable>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ fontWeight: 'bold' }}>{title} Area</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#b27b43',
    margin: 3
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});