import {useFocusEffect,useRoute, useNavigation} from '@react-navigation/native';
import React, { useEffect, useState} from 'react';
import { View, Text, Button, SectionList, FlatList, SafeAreaView, StyleSheet, Pressable } from 'react-native';
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

      navigation.navigate('Create', {name:`Create Order at Table ${selectedTable.name}`, selectedTable });

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
    <View style={styles.container}>
      <SafeAreaView>
        <SegmentedButtons
          value={currentArea}
          onValueChange={setCurrentArea}
          buttons={[
            { value: 'All', label: 'All' },
            { value: 'Main', label: 'Main' },
            { value: 'Balcony', label: 'Balcony' },
            { value: 'Outside', label: 'Outside' },
          ]}
        />
      </SafeAreaView>

      <FlatList
        data={groupTablesByArea()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <>
            <Text style={styles.sectionHeader}>{item.title} Area</Text>
            <View style={styles.tableGridContainer}>
              {item.data.map((table, index) => (
                <Pressable
                  key={table.id}
                  style={[
                    styles.tableButton,
                    {
                      backgroundColor:
                        selectedTable && selectedTable.id === table.id ? '#b27b43' : '#a8a8a8',
                    },
                  ]}
                  onPress={() => handleTableSelect(table)}
                >
                  <Text style={styles.tableText}>Table {table.name}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 16,
  },
  tableButton: {
    width: 80,
    height: 80,
    margin: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    fontWeight: 'bold',
  },
  tableGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});