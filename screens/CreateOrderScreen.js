import { useRoute } from '@react-navigation/native';
import MenuList from './MenuList';


function CreateScreen() {
  const route = useRoute();
  const { selectedTable } = route.params;

  return <MenuList selectedTable={selectedTable} existingOrder={null}></MenuList>
}

export default CreateScreen;