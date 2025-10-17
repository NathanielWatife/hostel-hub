const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'hostel-hub',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createComplaintRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComplaint', inputVars);
}
createComplaintRef.operationName = 'CreateComplaint';
exports.createComplaintRef = createComplaintRef;

exports.createComplaint = function createComplaint(dcOrVars, vars) {
  return executeMutation(createComplaintRef(dcOrVars, vars));
};

const listComplaintsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListComplaints');
}
listComplaintsRef.operationName = 'ListComplaints';
exports.listComplaintsRef = listComplaintsRef;

exports.listComplaints = function listComplaints(dc) {
  return executeQuery(listComplaintsRef(dc));
};

const addCommentToComplaintRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToComplaint', inputVars);
}
addCommentToComplaintRef.operationName = 'AddCommentToComplaint';
exports.addCommentToComplaintRef = addCommentToComplaintRef;

exports.addCommentToComplaint = function addCommentToComplaint(dcOrVars, vars) {
  return executeMutation(addCommentToComplaintRef(dcOrVars, vars));
};

const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';
exports.getMyProfileRef = getMyProfileRef;

exports.getMyProfile = function getMyProfile(dc) {
  return executeQuery(getMyProfileRef(dc));
};
