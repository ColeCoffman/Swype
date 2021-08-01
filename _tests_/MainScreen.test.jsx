import React from "react";
import renderer from "react-test-renderer";
import MainScreen from "./screens/MainScreen";

it('renders correctly across screens', () => {
    const tree = renderer.create(<MainScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });