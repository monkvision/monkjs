import monk, { MonitoringProvider } from '@monkvision/corejs';
import { name, version } from '@package/json';
import App from 'components/App';
import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import './i18n';

const config = {
  dsn: Constants.manifest.extra.SENTRY_DSN,
  environment: Constants.manifest.extra.ENV,
  debug: Constants.manifest.extra.ENV !== 'production',
  tracesSampleRate: 0.025,
  release: `${name}@${version}`,
  tracingOrigins: ['localhost', 'cna.dev.monk.ai', 'cna-staging.dev.monk.ai', 'cna.preview.monk.ai', 'cna.monk.ai'],
};

monk.config.accessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkFpTm1DMC13QW5ISklzTFc2bjRPVCJ9.eyJpc3MiOiJodHRwczovL2lkcC5zdGFnaW5nLm1vbmsuYWkvIiwic3ViIjoiYXV0aDB8NjE5MjgzODFkNmUzZjMwMDZiNTg0ZjIyIiwiYXVkIjpbImh0dHBzOi8vYXBpLm1vbmsuYWkvdjEvIiwiaHR0cHM6Ly9tb25rLXN0YWdpbmcuZXUuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NDgzMjIzOCwiZXhwIjoxNjg0ODM5NDM4LCJhenAiOiJEQWVaV3FlZU9mZ0l0WUJjUXpGZUZ3U3Jsdm1VZE43TCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJwZXJtaXNzaW9ucyI6WyJtb25rX2NvcmVfYXBpOmRhbWFnZV9kZXRlY3Rpb24iLCJtb25rX2NvcmVfYXBpOmRhc2hib2FyZF9vY3IiLCJtb25rX2NvcmVfYXBpOmltYWdlX2VkaXRpbmciLCJtb25rX2NvcmVfYXBpOmltYWdlc19vY3IiLCJtb25rX2NvcmVfYXBpOmluc3BlY3Rpb25zOmNyZWF0ZSIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6ZGVsZXRlIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpkZWxldGVfYWxsIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpkZWxldGVfb3JnYW5pemF0aW9uIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpyZWFkIiwibW9ua19jb3JlX2FwaTppbnNwZWN0aW9uczpyZWFkX2FsbCIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6cmVhZF9vcmdhbml6YXRpb24iLCJtb25rX2NvcmVfYXBpOmluc3BlY3Rpb25zOnVwZGF0ZSIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6dXBkYXRlX2FsbCIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6dXBkYXRlX29yZ2FuaXphdGlvbiIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6d3JpdGUiLCJtb25rX2NvcmVfYXBpOmluc3BlY3Rpb25zOndyaXRlX2FsbCIsIm1vbmtfY29yZV9hcGk6aW5zcGVjdGlvbnM6d3JpdGVfb3JnYW5pemF0aW9uIiwibW9ua19jb3JlX2FwaTpyZXBhaXJfZXN0aW1hdGUiLCJtb25rX2NvcmVfYXBpOnVzZXJzOnJlYWQiLCJtb25rX2NvcmVfYXBpOnVzZXJzOnJlYWRfYWxsIiwibW9ua19jb3JlX2FwaTp1c2VyczpyZWFkX29yZ2FuaXphdGlvbiIsIm1vbmtfY29yZV9hcGk6dXNlcnM6dXBkYXRlIiwibW9ua19jb3JlX2FwaTp1c2Vyczp1cGRhdGVfYWxsIiwibW9ua19jb3JlX2FwaTp1c2Vyczp1cGRhdGVfb3JnYW5pemF0aW9uIiwibW9ua19jb3JlX2FwaTp1c2Vyczp3cml0ZSIsIm1vbmtfY29yZV9hcGk6dXNlcnM6d3JpdGVfYWxsIiwibW9ua19jb3JlX2FwaTp1c2Vyczp3cml0ZV9vcmdhbml6YXRpb24iLCJtb25rX2NvcmVfYXBpOndoZWVsX2FuYWx5c2lzIl19.c_11ApPf7N3RB6iYz5Sn1mFWOwDZaqdGCFYNIfCOSHeBqTVLa5kg7kYH8Tf4-mfWWfseT5LjBHD6KFaAaZ7YQIURkX1kwXi3MwgooDsUYQUnRT_NnzlMFb__9w8xfAmuZ76OtDEP_jAfbfVD38uU5pcDlCHfD-WmUde2wGqjHQfKJTGBbacZkqMTycvnBYwwkO9tNrCOPgNxPr6ZvNK479AiXkyPEfhpIn4splRziZyYK6KgzUWGUSOQQPyw0gVZJItofyR5rCmO8yy4nMgI3oqRSpjVWXBMWNODltejDWjhLRUQEZ9VzRIbKWGIH05wNxqMZ6MdhT8D7OE7044_2w';

if (Platform.OS === 'web') {
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(<MonitoringProvider config={config}><App /></MonitoringProvider>);
} else {
  registerRootComponent(Sentry.Native.wrap(App));
}
