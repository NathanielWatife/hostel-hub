import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'hostel-hub',
  location: 'us-east4'
};

export const createComplaintRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateComplaint', inputVars);
}
createComplaintRef.operationName = 'CreateComplaint';

export function createComplaint(dcOrVars, vars) {
  return executeMutation(createComplaintRef(dcOrVars, vars));
}

export const listComplaintsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListComplaints');
}
listComplaintsRef.operationName = 'ListComplaints';

export function listComplaints(dc) {
  return executeQuery(listComplaintsRef(dc));
}

export const addCommentToComplaintRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCommentToComplaint', inputVars);
}
addCommentToComplaintRef.operationName = 'AddCommentToComplaint';

export function addCommentToComplaint(dcOrVars, vars) {
  return executeMutation(addCommentToComplaintRef(dcOrVars, vars));
}

export const getMyProfileRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyProfile');
}
getMyProfileRef.operationName = 'GetMyProfile';

export function getMyProfile(dc) {
  return executeQuery(getMyProfileRef(dc));
}

