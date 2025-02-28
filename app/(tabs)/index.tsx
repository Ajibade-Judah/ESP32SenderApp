import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Switch, ActivityIndicator } from 'react-native';

export default function App() {
  const [text, setText] = useState('');
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Replace with your ESP32's IP address
  const ESP32_IP = '000.00.0.00';

  useEffect(() => {
    // Send toggle state whenever it changes
    sendToggleState();
  }, [isToggleOn]);

  const sendToggleState = async () => {
    try {
      const state = isToggleOn ? 'ON' : 'OFF';
      const response = await fetch(`http://${ESP32_IP}/toggle?state=${state}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        console.log(`Toggle state sent: ${state}`);
        setIsConnected(true);
      } else {
        console.error('Failed to send toggle state');
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error sending toggle state:', error);
      setIsConnected(false);
    }
  };

  const sendText = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://${ESP32_IP}/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `message=${encodeURIComponent(text)}`,
      });
      
      if (response.ok) {
        console.log('Text sent successfully');
        setInputText(text);
        setText('');
        setIsConnected(true);
      } else {
        console.error('Failed to send text');
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error sending text:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ESP32 Control</Text>
      
      <View style={styles.statusContainer}>
        <Text>Connection Status: </Text>
        <Text style={isConnected ? styles.connected : styles.disconnected}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
      
      <View style={styles.controlContainer}>
        <Text style={styles.label}>Toggle Switch:</Text>
        <View style={styles.toggleContainer}>
          <Switch
            value={isToggleOn}
            onValueChange={setIsToggleOn}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isToggleOn ? "#f5dd4b" : "#f4f3f4"}
          />
          <Text style={styles.toggleState}>{isToggleOn ? 'ON' : 'OFF'}</Text>
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter text to send"
        />
        <Button 
          title={isLoading ? "Sending..." : "Send"}
          onPress={sendText}
          disabled={isLoading || !text.trim()}
        />
      </View>
      
      <View style={styles.displayContainer}>
        <Text style={styles.label}>Last Sent Text:</Text>
        <Text style={styles.displayText}>{inputText || "None"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  connected: {
    color: 'green',
    fontWeight: 'bold',
  },
  disconnected: {
    color: 'red',
    fontWeight: 'bold',
  },
  controlContainer: {
    width: '100%',
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  toggleState: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  displayContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  displayText: {
    fontSize: 16,
  },
});