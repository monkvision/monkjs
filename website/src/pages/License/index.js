import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Layout from '@theme/Layout';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function License() {
  const context = useDocusaurusContext();
  const { siteConfig: { customFields = {}, tagline } = {} } = context;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Layout title={tagline} description={customFields.description}>
        <Container maxWidth={false}>
          <Typography p component="h2" variant="h3">
            The Clear BSD License
          </Typography>
          <Typography p component="h3" variant="h5">
            Copyright (c)
            {new Date().getFullYear()}
            Monk All rights reserved.
          </Typography>
          <Typography p>
            Redistribution and use in source and binary forms, with or without
            modification, are permitted (subject to the limitations in the disclaimer
            below) provided that the following conditions are met:
          </Typography>
          <Typography p>
            * Redistributions of source code must retain the above copyright notice,
            this list of conditions and the following disclaimer.
          </Typography>
          <Typography p>
            * Redistributions in binary form must reproduce the above copyright
            notice, this list of conditions and the following disclaimer in the
            documentation and/or other materials provided with the distribution.
          </Typography>
          <Typography p>
            * Neither the name of the copyright holder nor the names of its
            contributors may be used to endorse or promote products derived from this
            software without specific prior written permission.
          </Typography>
          <Typography p variant="body2">
            NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
            THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
            CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
            LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
            PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
            CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
            EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
            PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
            BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
            IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
            ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
            POSSIBILITY OF SUCH DAMAGE.
          </Typography>
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default License;
