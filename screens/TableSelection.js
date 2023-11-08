import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, { useEffect, useState} from 'react';
import { View, Text, Button, SectionList } from 'react-native';
import {getAllTables} from "../services/TableApiService"



export default function TableSelection() {
  const navigation = useNavigation();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  function onTableSelect(selectedTable) {
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
    onTableSelect(table); // Pass the selected table back to the parent component
  };

  // Group tables by area
  const groupedTables = tables.reduce((acc, table) => {
    acc[table.area] = acc[table.area] || [];
    acc[table.area].push(table);
    return acc;
  }, {});

  const sections = Object.keys(groupedTables).map((area) => ({
    title: area,
    data: groupedTables[area],
  }));

  return (
    <View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={`Table ${item.id}: ${item.name}`}
            onPress={() => handleTableSelect(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ fontWeight: 'bold' }}>{title}</Text>
        )}
      />
      {selectedTable && (
        <Text>
          Selected Table: Table {selectedTable.id} - {selectedTable.name} in {selectedTable.area}
        </Text>
      )}
    </View>
  );
}