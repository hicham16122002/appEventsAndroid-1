import React, { memo, useMemo, useState, useEffect } from 'react'
import { Text, View } from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'
import { generateDataSet } from '../helpers'
import { db } from './FireBaseConn';
import { ref, onValue } from 'firebase/database'

export const LocalDataSet = memo((props) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [operationCopy, setOperationCopy] = useState(props.operation);
  const locals = props.data;
  const operation = props.operation;
  const dataSet = generateDataSet();
  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const handleSelectItem = (item) => {
    props.onItemSelected(item);
  };

  useEffect(() => {
    if (operationCopy !== operation) {
      setSelectedItem(null);
      setOperationCopy(operation);
      setAutocompleteKey(autocompleteKey + 1); // Increment the key to force re-render
    }
  }, [operation]);

  return (
    <>
      <AutocompleteDropdown
        key={autocompleteKey} // Update the key to force re-render
        clearOnFocus={false}
        closeOnBlur={true}
        initialValue={{ id: '1' }} // or just '2'
        onSelectItem={handleSelectItem}
        dataSet={locals}
        ItemSeparatorComponent={<View style={{ height: 1, width: '100%', backgroundColor: '#d8e1e6' }} />}
        getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
      />
    </>
  )
})

