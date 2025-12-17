import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, TouchableOpacity } from 'react-native';
import { ApiClient } from '@arkansas-flow/shared';

const client = new ApiClient({ baseUrl: 'http://localhost:4000' });

export default function App() {
  const [stations, setStations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    client.getStations().then(setStations).catch(console.error);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Arkansas Flow Tracker</Text>
      <FlatList
        data={stations}
        keyExtractor={(item) => item.siteId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={async () => setSelected(await client.getRealtime(item.siteId))}>
            <Text style={{ paddingVertical: 8 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      {selected && (
        <Text>Current: {selected.discharge} cfs ({selected.classification?.label})</Text>
      )}
    </SafeAreaView>
  );
}
