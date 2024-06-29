import React from 'react';
import renderer from 'react-test-renderer';

import Turtle from '../components/Turtle';

test('renders correctly', () => {
    const tree = renderer.create(<Turtle />).toJSON();
    expect(tree).toMatchSnapshot();
  });
