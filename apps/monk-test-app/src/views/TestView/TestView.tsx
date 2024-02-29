import React, { useState } from 'react';
import { PhotoCapture } from '@monkvision/inspection-capture-web';
import { sights } from '@monkvision/sights';
import './TestView.css';

const captureSights = [
  sights['haccord-8YjMcu0D'],
  sights['haccord-DUPnw5jj'],
  sights['haccord-hsCc_Nct'],
  sights['haccord-GQcZz48C'],
  sights['haccord-QKfhXU7o'],
  sights['haccord-mdZ7optI'],
  sights['haccord-bSAv3Hrj'],
  sights['haccord-W-Bn3bU1'],
  sights['haccord-GdWvsqrm'],
  sights['haccord-ps7cWy6K'],
  sights['haccord-Jq65fyD4'],
  sights['haccord-OXYy5gET'],
  sights['haccord-5LlCuIfL'],
  sights['haccord-Gtt0JNQl'],
  sights['haccord-cXSAj2ez'],
  sights['haccord-KN23XXkX'],
  sights['haccord-Z84erkMb'],
];

const inspectionId = 'b072ff42-6244-ef3b-b018-5d3d6562c1bd';

const apiConfig = {
  apiDomain: 'api.preview.monk.ai/v1',
  authToken:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNLUnpaNm01WDFzOWFBZWRudnBrWSJ9.eyJpc3MiOiJodHRwczovL2lkcC5wcmV2aWV3Lm1vbmsuYWkvIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDY5MzYxMTEwMDU4MDYxODA1NTYiLCJhdWQiOlsiaHR0cHM6Ly9hcGkubW9uay5haS92MS8iLCJodHRwczovL21vbmstcHJldmlldy5ldS5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzA3NDcxNzU5LCJleHAiOjE3MDc0Nzg5NTksImF6cCI6InNvWjdQMmM2YjlJNWphclFvUnJoaDg3eDlUcE9TYUduIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsInBlcm1pc3Npb25zIjpbIm1vbmtfY29yZV9hcGk6Y29tcGxpYW5jZXMiLCJtb25rX2NvcmVfYXBpOmRhbWFnZV9kZXRlY3Rpb24iLCJtb25rX2NvcmVfYXBpOmRhc2hib2FyZF9vY3IiLCJtb25rX2NvcmVfYXBpOmltYWdlc19vY3IiLCJtb25rX2NvcmVfYXBpOmluc3BlY3Rpb25zOmNyZWF0ZSIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6ZGVsZXRlIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpkZWxldGVfYWxsIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpkZWxldGVfb3JnYW5pemF0aW9uIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpyZWFkIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpyZWFkX2FsbCIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6cmVhZF9vcmdhbml6YXRpb24iLCJtb25rX2NvcmVfYXBpOmluc3BlY3Rpb25zOnVwZGF0ZSIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6dXBkYXRlX2FsbCIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6dXBkYXRlX29yZ2FuaXphdGlvbiIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6d3JpdGUiLCJtb25rX2NvcmVfYXBpOmluc3BlY3Rpb25zOndyaXRlX2FsbCIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6d3JpdGVfb3JnYW5pemF0aW9uIiwibW9ua19jb3JlX2FwaTpyZXBhaXJfZXN0aW1hdGUiLCJtb25rX2NvcmVfYXBpOnVzZXJzOnJlYWQiLCJtb25rX2NvcmVfYXBpOnVzZXJzOnJlYWRfYWxsIiwibW9ua19jb3JlX2FwaTp1c2VyczpyZWFkX29yZ2FuaXphdGlvbiIsIm1vbmtfY29yZV9hcGk6dXNlcnM6dXBkYXRlIiwibW9ua19jb3JlX2FwaTp1c2Vyczp1cGRhdGVfYWxsIiwibW9ua19jb3JlX2FwaTp1c2Vyczp1cGRhdGVfb3JnYW5pemF0aW9uIiwibW9ua19jb3JlX2FwaTp1c2Vyczp3cml0ZSIsIm1vbmtfY29yZV9hcGk6dXNlcnM6d3JpdGVfYWxsIiwibW9ua19jb3JlX2FwaTp1c2Vyczp3cml0ZV9vcmdhbml6YXRpb24iLCJtb25rX2NvcmVfYXBpOndoZWVsX2FuYWx5c2lzIl19.m38G5NaCD_pcGptJdLPa_TVtD08yRY9qdp-5pCELd8Ekzma0kCWMctwHvlrv2OsjynlXyAutIK2uhDMrdLdnPk_6bU4rZheej2s0obXaXqZCUTbUOh8scL-81tbH_ZlKN3oSXfqUVMnwvpa1bnXZHmjeHi2e3bhvjxW-Jg5DrBB9gNfstxK0hugrlxtNL96y6ImEITOxOMEbURYGwOLQQtLkRqFo7AeZCu-_w6UbtFZfLJc5FlsWpTKy7I3_xMynzDGGaADRQeyazL_7DfemCb_VPXkR9aV67tF4pt6jevCetYI5CfN5X2JJrp7XNES_M2d7wGdJl5C6lbBPs3n3SA',
};

export function TestView() {
  const [complete, setComplete] = useState(false);

  return (
    <div className='test-view-container'>
      {complete ? (
        'Inspection Complete!'
      ) : (
        <PhotoCapture
          sights={captureSights}
          inspectionId={inspectionId}
          apiConfig={apiConfig}
          onComplete={() => setComplete(true)}
          onClose={() => console.log('coucou')}
        />
      )}
    </div>
  );
}
