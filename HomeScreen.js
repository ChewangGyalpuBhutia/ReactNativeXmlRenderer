import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { parseString } from 'xml2js';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { PanResponder } from 'react-native';

const App = () => {
  const [xmlInput, setXmlInput] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [drawing, setDrawing] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Predefined XML template
  const predefinedXml = `
    <form>
      <field type="text" label="Full Name" required="true" />
      <field type="date" label="Date of Birth" required="true" />
      <field type="radio" label="Gender" required="true">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </field>
      <field type="drawing" label="Signature" required="false" />
    </form>
  `;

  const handleRenderFromFile = () => {
    parseXml(predefinedXml);
  };

  const handleRenderFromInput = () => {
    if (!xmlInput.trim()) {
      Alert.alert('Error', 'XML input cannot be empty');
      return;
    }
    parseXml(xmlInput);
  };

  const parseXml = (xml) => {
    try {
      parseString(xml, (err, result) => {
        if (err) {
          Alert.alert('Error', 'Invalid XML format');
          return;
        }
        const fields = result.form.field;
        setFormFields(fields);

        // Initialize form data
        const initialData = {};
        fields.forEach(field => {
          initialData[field.$.label] = field.$.type === 'radio' ? '' : null;
        });
        setFormData(initialData);
      });
    } catch (error) {
      Alert.alert('Parsing Error', 'Could not parse XML');
    }
  };

  const updateFormData = (label, value) => {
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const renderField = (field) => {
    const label = field.$.label;
    const isRequired = field.$.required === 'true';

    switch (field.$.type) {
      case 'text':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {label} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <TextInput
              placeholder={`Enter ${label}`}
              style={styles.input}
              value={formData[label] || ''}
              onChangeText={(text) => updateFormData(label, text)}
            />
          </View>
        );

      case 'date':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {label} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                placeholder="Select Date"
                style={styles.input}
                value={selectedDate.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setSelectedDate(selectedDate);
                    updateFormData(label, selectedDate);
                  }
                }}
              />
            )}
          </View>
        );

      case 'radio':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {label} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <RadioButton.Group
              onValueChange={(value) => updateFormData(label, value)}
              value={formData[label] || ''}
            >
              {field.option.map((opt, index) => (
                <View key={index} style={styles.radioContainer}>
                  <RadioButton value={opt.$.value} />
                  <Text>{opt._}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        );

      case 'drawing':
        return (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              {label} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <DrawingPad
              onDrawingChange={(paths) => updateFormData(label, paths)}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    const missingFields = formFields
      .filter(field => field.$.required === 'true' && !formData[field.$.label])
      .map(field => field.$.label);

    if (missingFields.length > 0) {
      Alert.alert('Validation Error', `Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Submit form data
    Alert.alert('Form Submitted', JSON.stringify(formData, null, 2));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>XML Form Renderer</Text>

      <Button
        title="Render Form from XML File"
        onPress={handleRenderFromFile}
      />

      <TextInput
        placeholder="Enter XML"
        value={xmlInput}
        onChangeText={setXmlInput}
        style={styles.xmlInput}
        multiline
      />

      <Button
        title="Render Form from XML Input"
        onPress={handleRenderFromInput}
      />

      {formFields.map((field, index) => (
        <View key={index}>{renderField(field)}</View>
      ))}

      {formFields.length > 0 && (
        <Button
          title="Submit Form"
          onPress={handleSubmit}
          style={{ padding: 50 }}
        />
      )}
    </ScrollView>
  );
};

// Drawing Component
const DrawingPad = ({ onDrawingChange }) => {
  const [paths, setPaths] = React.useState([]);
  const [currentPath, setCurrentPath] = React.useState([]);

  const panResponder = React.useMemo(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([`M${locationX},${locationY}`]);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, `L${locationX},${locationY}`]);
      },
      onPanResponderRelease: () => {
        const newPaths = [...paths, currentPath.join(' ')];
        setPaths(newPaths);
        setCurrentPath([]);
        onDrawingChange(newPaths);
      }
    }),
    [paths, onDrawingChange]
  );

  return (
    <View
      style={styles.drawingContainer}
      {...panResponder.panHandlers}
    >
      <Svg height="200" width="100%">
        {paths.map((path, index) => (
          <Path
            key={index}
            d={path}
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        ))}
        {currentPath.length > 0 && (
          <Path
            d={currentPath.join(' ')}
            stroke="black"
            strokeWidth="2"
            fill="none"
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  required: {
    color: 'red'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  xmlInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 10,
    height: 100,
    padding: 10,
    borderRadius: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawingContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: 200,
    borderRadius: 5,
  }
});

export default App;