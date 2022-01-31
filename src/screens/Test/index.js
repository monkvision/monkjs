import React from 'react';
import { Capture } from '@monkvision/camera';
import { StatusBar, SafeAreaView } from 'react-native';

export default function Test() {
  return (
    <SafeAreaView>
      <StatusBar hidden />
      <Capture
        sightIds={[
          'PLh198NC', 'xsuH1g5T', 'xfbBpq3Q', 'm1rhrZ88', 'LE9h1xh0',
          'IVcF1dOP', 'xQKQ0bXS', 'zjAIjUgU', 'chSQvJEk', 'eOkUJUBk',
          'Q7vIg3d7', 'UHZkpCuK', 'aO4iBxeM', '7MWNpxhQ', 'ClEZSucK',
          'GvCtVnoD', 'dTy7YRvT', 'dQOmxo13', '3vKXafwc', 'GHbWVnMB',
          'j8YHvnDP', 'XyeyZlaU', 'j3E2UHFc', 'LDRoAPnk', '36qmcrgr',
          'Cce1KCd3', 'dOAqz0uT', 'eWZsEThb', 'AoO-nOoM', 'QqBpHiVP',
          'rN39Y3HR', 'B5s1CWT-', 'OEEnUjNK', 'JkOuYHqN', '0U14gFyk',
          'Pzgw0WGe', 'PuIw17h0', 'lxxEbNrd', 'Z1MTGFVX', 'WWZsroCu',
          'jqJOb6Ov', 'CELBsvYD', 'jgB-cu5G', 'EqLDVYj3', 'vLcBGkeh',
          'Fh972HlF', 'RMeCZRbd', 'oIk8RQ3w',
        ]}
      />
    </SafeAreaView>
  );
}
