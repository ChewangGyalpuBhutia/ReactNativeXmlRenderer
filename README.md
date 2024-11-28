# XML Form Renderer React Native App

## Overview

This React Native application provides a dynamic XML-based form rendering system. Users can generate forms by inputting XML, with support for various field types including text inputs, date pickers, radio buttons, and even a custom drawing signature pad.

## Features

- Dynamic form generation from XML
- Supports multiple field types:
  - Text input
  - Date selection
  - Radio button groups
  - Custom drawing signature
- Form validation
- Predefined XML template
- Flexible XML input method

## Screenshots

| ![Screenshot_1732824742](https://github.com/user-attachments/assets/cf105e5c-6533-49a3-a629-f414c5bd3d5f) | ![Screenshot_1732824739](https://github.com/user-attachments/assets/13b1a584-fe66-4fbb-9d42-b83d70fd907e) | ![Screenshot_1732824725](https://github.com/user-attachments/assets/06b74ef4-37e3-4c27-a03a-134b78512a65) |
|---|---|---|

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Android Studio (for Android development)
- Xcode (for iOS development)

## Installation

### Step 1: Clone the Repository

```sh
git clone https://github.com/your-username/xml-form-renderer.git
cd xml-form-renderer
```

### Step 2: Install Dependencies

```sh
npm install
```

### Step 3: Install Peer Dependencies

```sh
npm install @react-native-community/datetimepicker react-native-paper react-native-svg
```

### Step 4: Start Metro Server

```sh
npm start
```

### Step 5: Run the App

```sh
# For Android
npm run android

# For iOS
npm run ios
```

## Dependencies

- React Native
- xml2js (for XML parsing)
- @react-native-community/datetimepicker
- react-native-paper
- react-native-svg

## Test XML Data

Here are some test XML templates you can use to generate forms:

### Basic Contact Form XML
```xml
<form>
  <field type="text" label="Full Name" required="true" />
  <field type="text" label="Email" required="true" />
  <field type="text" label="Phone Number" required="false" />
</form>
```

### Employee Registration Form XML
```xml
<form>
  <field type="text" label="First Name" required="true" />
  <field type="text" label="Last Name" required="true" />
  <field type="date" label="Hire Date" required="true" />
  <field type="radio" label="Department" required="true">
    <option value="hr">Human Resources</option>
    <option value="it">Information Technology</option>
    <option value="sales">Sales</option>
    <option value="marketing">Marketing</option>
  </field>
  <field type="drawing" label="Employee Signature" required="false" />
</form>
```

### Survey Form XML
```xml
<form>
  <field type="text" label="Name" required="true" />
  <field type="radio" label="Satisfaction Level" required="true">
    <option value="very_satisfied">Very Satisfied</option>
    <option value="satisfied">Satisfied</option>
    <option value="neutral">Neutral</option>
    <option value="dissatisfied">Dissatisfied</option>
    <option value="very_dissatisfied">Very Dissatisfied</option>
  </field>
  <field type="text" label="Additional Comments" required="false" />
</form>
```

## Customization

You can create custom form fields by modifying the XML structure. The current implementation supports:

- `type="text"`: Text input fields
- `type="date"`: Date picker fields
- `type="radio"`: Radio button groups
- `type="drawing"`: Signature drawing pad

Each field supports a `required` attribute to mark mandatory fields.

## Limitations

- Current version supports only the predefined field types
- No dynamic addition of fields in the UI
- Minimal styling options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Insert Your License Here]
