import {useFocusEffect} from '@react-navigation/native';
import React, { useState} from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import {getAllTables} from "../services/TableApiService"


export default function TableSelection() {
  const [tables, setTables] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          const tablesData = await getAllTables();
          setTables(tablesData);
        } catch (error) {
          console.error('Error fetching tables:', error);
        }
      }

      fetchData();
    }, [])
  );

  
  return (
    <FlatList
      data={tables}
      renderItem={({ item }) => {
        return (
          <Text>
            Table {item.id}: {item.name} in {item.area} area.
          </Text>
        );
      }}
    />
  ); 
}


// function TableSelection({ onTableSelect }) {
//   const [tables, setTables] = useState([]);
//   const [selectedTable, setSelectedTable] = useState(null);

//   useEffect(() => {
//     // Fetch available tables from the API
//     fetch('https://124.171.239.233/api/mobiletables')
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       setTables(data);
//     })
//     .catch((error) => {
//       console.error('Error fetching tables:', error);
//     });
// }, []);

//   const handleTableSelect = (table) => {
//     setSelectedTable(table);
//     onTableSelect(table); // Pass the selected table back to the parent component
//   };

//   return (
//     <View>
//     <Text>Select a Table: {tables}</Text>
//     <FlatList
//       data={tables}
//       keyExtractor={(table) => table.id.toString()}
//       renderItem={({ table }) => (
//         <Button
//           title={`Table ${table.id}: ${table.Name} in ${table.Area}`}
//           onPress={() => handleTableSelect(item)}
//         />
//       )}
//     />
//     {selectedTable && (
//       <Text>
//         Selected Table: Table {selectedTable.id} - {selectedTable.Name} in {selectedTable.Area}
//       </Text>
//     )}
//   </View>
// );
// }
