import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { parseString } from 'xml2js';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RadioButton, Button, TextInput as PaperTextInput, Appbar, Card, Title, Paragraph } from 'react-native-paper';
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
          <Card style={styles.fieldContainer}>
            <Card.Content>
              <Title>{label} {isRequired && <Text style={styles.required}>*</Text>}</Title>
              <PaperTextInput
                label={`Enter ${label}`}
                mode="outlined"
                value={formData[label] || ''}
                onChangeText={(text) => updateFormData(label, text)}
              />
            </Card.Content>
          </Card>
        );

      case 'date':
        return (
          <Card style={styles.fieldContainer}>
            <Card.Content>
              <Title>{label} {isRequired && <Text style={styles.required}>*</Text>}</Title>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <PaperTextInput
                  label="Select Date"
                  mode="outlined"
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
            </Card.Content>
          </Card>
        );

      case 'radio':
        return (
          <Card style={styles.fieldContainer}>
            <Card.Content>
              <Title>{label} {isRequired && <Text style={styles.required}>*</Text>}</Title>
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
            </Card.Content>
          </Card>
        );

      case 'drawing':
        return (
          <Card style={styles.fieldContainer}>
            <Card.Content>
              <Title>{label} {isRequired && <Text style={styles.required}>*</Text>}</Title>
              <DrawingPad
                onDrawingChange={(paths) => updateFormData(label, paths)}
              />
            </Card.Content>
          </Card>
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
      <Appbar.Header>
        <Appbar.Content title="XML Form Renderer" />
      </Appbar.Header>

      <Card style={styles.card}>
        <Card.Content>
          <Button mode="contained" onPress={handleRenderFromFile}
          >
            Render Form from XML File
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <PaperTextInput
            label="Enter XML"
            mode="outlined"
            value={xmlInput}
            onChangeText={setXmlInput}
            multiline
            style={styles.xmlInput}
          />
          <Button mode="contained" onPress={handleRenderFromInput} style={{marginTop: 20}}>
            Render Form from XML Input
          </Button>
        </Card.Content>
      </Card>

      {formFields.map((field, index) => (
        <View key={index}>{renderField(field)}</View>
      ))}

      {formFields.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Button mode="contained" onPress={handleSubmit}>
              Submit Form
            </Button>
          </Card.Content>
        </Card>
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
  },
  fieldContainer: {
    margin: 10,
  },
  required: {
    color: 'red'
  },
  xmlInput: {
    height: 100,
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