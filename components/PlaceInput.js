import React, { Component } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import axios from "axios";

export default class PlaceInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      predictions: []
    };
    this.getPlaces = this.getPlaces.bind(this);
  }

  async getPlaces(input) {
    const result = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyBx4jdXqTV6sX6IiFx1lC50l_0b_32Neys&input=${input}&location=37.422356, -122.084068&radius=2000`
    );
    this.setState({ predictions: result.data.predictions });
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
        <View key={id} style={suggestionStyle}>
          <Text style={main_textStyle}>{structured_formatting.main_text}</Text>
          <Text style={secondary_textStyle}>
            {structured_formatting.secondary_text}
          </Text>
        </View>
      );
    });
    return (
      <View>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={input => this.getPlaces(input)}
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
