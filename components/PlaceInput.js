import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard
} from "react-native";
import axios from "axios";
import _ from "lodash";

export default class PlaceInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      predictions: [],
      destinationInput: ""
    };
    this.getPlaces = this.getPlaces.bind(this);
    this.getPlacesDebounced = _.debounce(this.getPlaces, 1000);
    this.setDestination = this.setDestination.bind(this);
  }

  async getPlaces(input) {
    const result = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBx4jdXqTV6sX6IiFx1lC50l_0b_32Neys&input=${input}&location=37.422356, -122.084068&radius=2000`
    );
    this.setState({ predictions: result.data.predictions });
  }

  setDestination(main_text) {
    Keyboard.dismiss();
    this.setState({ destinationInput: main_text, predictions: [] });
  }

  render() {
    const {
      suggestionStyle,
      main_textStyle,
      secondary_textStyle,
      placeInputStyle
    } = styles;
    const predictions = this.state.predictions.map(prediction => {
      const { id, structured_formatting } = prediction;
      return (
        <TouchableOpacity
          key={id}
          onPress={() => this.setDestination(structured_formatting.main_text)}
        >
          <View style={suggestionStyle}>
            <Text style={main_textStyle}>
              {structured_formatting.main_text}
            </Text>
            <Text style={secondary_textStyle}>
              {structured_formatting.secondary_text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
    return (
      <View>
        <TextInput
          value={this.state.destinationInput}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={input => {
            this.setState({ destinationInput: input });
            this.getPlacesDebounced(input);
          }}
          style={placeInputStyle}
          placeholder="Where to?"
        />
        {predictions}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeInputStyle: {
    height: 40,
    marginTop: 50,
    padding: 5,
    backgroundColor: "white"
  },
  secondary_textStyle: {
    color: "#777"
  },
  main_textStyle: {
    color: "#000"
  },
  suggestionStyle: {
    borderTopWidth: 0.5,
    backgroundColor: "white",
    borderColor: "#777",
    padding: 15
  }
});
