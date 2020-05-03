import React, { Fragment } from 'react';
import Form from './Form';
import Claims from './Claims';
import Tweets from '../twitter/Tweets'

export default function Dashboard() {
  return (
    <Fragment>
      <Form />
      <Tweets />
      <Claims />
    </Fragment>
  );
}