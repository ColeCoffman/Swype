/*import { it } from "@jest/globals";
import React from "react";
import { handleLike } from "../screens/MainScreen";

describe('handleLike', () => {
    it('console.log the with "like"', () => {
        const consoleSpy = jest.spyOn(console, 'log');
    
        console.log('like');
    
        expect(consoleSpy).toHaveBeenCalledWith('like');
    })
});*/


import React from 'react';
import renderer from "react-test-renderer";
import PostScreen from "./screens/PostScreen";

it('renders correctly across screens', () => {
    const tree = renderer.create(<PostScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });