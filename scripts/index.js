/* eslint-disable no-console */
const axios = require('axios');
require('dotenv').config();

const allTransactions = [];
const sentryEndPoint = 'https://monkai.sentry.io';
const organizations = 'monk';
const statsPeriod = '7d';
const recordPerPage = 100;
const query = 'event.type:transaction transaction.op:"Capture Tour"';

async function getAllProjects() {
  return axios.request({
    method: 'get',
    headers: { Authorization: `Bearer ${process.env.TOKEN}` },
    url: `${sentryEndPoint}/api/0/projects/`,
  });
}

async function getTotalCounts(projectId) {
  return axios.request({
    method: 'get',
    headers: { Authorization: `Bearer ${process.env.TOKEN}` },
    url: `${sentryEndPoint}/api/0/organizations/${organizations}/events-meta/?statsPeriod=${statsPeriod}&query=${query}&referrer=api.discover.query-table&project=${projectId}&environment=${process.env.ENVIRONMENT}`,
  });
}

async function getTransactions(clusterEnd, projectId) {
  return axios.request({
    method: 'get',
    headers: { Authorization: `Bearer ${process.env.TOKEN}` },
    url: `${sentryEndPoint}/api/0/organizations/${organizations}/eventsv2/?field=id&field=transaction.op&field=transaction.status&field=task&field=inspectionId&field=timestamp&field=retakenPictures&field=takenPictures&field=percentOfNonCompliancePics&statsPeriod=${statsPeriod}&per_page=${recordPerPage}&query=${query}&referrer=api.discover.query-table&cursor=0:${clusterEnd}:0&project=${projectId}&environment=${process.env.ENVIRONMENT}`,
  });
}

async function getTommReport() {
  const allProjects = await getAllProjects();

  for (let i = 0; i < allProjects.data.length; i += 1) {
    const project = allProjects.data[i];

    if (process.env.PROJECTS && !process.env.PROJECTS.split(',').includes(project.id)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // eslint-disable-next-line no-await-in-loop
    const response = await getTotalCounts(project.id);
    const transactionPromises = [];
    let totalEventCount = response.data.count;
    let index = 0;
    while (totalEventCount > 0) {
      transactionPromises.push(getTransactions(index * recordPerPage, project.id));
      totalEventCount -= recordPerPage;
      index += 1;
    }

    // eslint-disable-next-line no-await-in-loop
    await Promise.all(transactionPromises).then((responses) => {
      responses.forEach((transaction) => {
        Array.prototype.push.apply(allTransactions, transaction.data.data);
      });
    });

    const totalTakenPictures = allTransactions.reduce(
      (accumulator, transaction) => accumulator + parseInt(transaction.takenPictures || 0, 10),
      0,
    );
    const totalRetakenPictures = allTransactions.reduce(
      (accumulator, transaction) => accumulator + parseInt(transaction.retakenPictures || 0, 10),
      0,
    );

    const totalPercentOfNonCompliancePics = totalTakenPictures > 0
      ? ((totalRetakenPictures / totalTakenPictures) * 100).toFixed(2) : 0;

    console.log('\n\n===========================================================');
    console.log('Project Name : ', project.name);
    console.log('Project Slug : ', project.slug);
    console.log('Total Capture Tour Transactions : ', response.data.count);
    console.log('Total Taken Pictures : ', totalTakenPictures);
    console.log('Total Retaken Pictures : ', totalRetakenPictures);
    console.log('Average Percent Of Non Compliance Pictures : ', `${totalPercentOfNonCompliancePics}%`);
  }
}

if (process.env.TOKEN) {
  getTommReport();
} else {
  console.log('Please provide access token from sentry.');
}
