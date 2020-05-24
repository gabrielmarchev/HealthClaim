import React, { Fragment } from 'react';
import Form from './Form';
import Tweets from '../twitter/Tweets'

export default function Dashboard() {
  return (
    <Fragment>
      <Form />
      <Tweets />
    </Fragment>
  );
}