import React from 'react';
import renderer from "react-test-renderer";
import AddPostScreen from "./screens/AddPostScreen";

it('renders correctly across screens', () => {
    const tree = renderer.create(<AddPostScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });