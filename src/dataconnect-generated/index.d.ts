import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddCommentToComplaintData {
  complaintComment_insert: ComplaintComment_Key;
}

export interface AddCommentToComplaintVariables {
  complaintId: UUIDString;
  text: string;
}

export interface ComplaintComment_Key {
  id: UUIDString;
  __typename?: 'ComplaintComment_Key';
}

export interface Complaint_Key {
  id: UUIDString;
  __typename?: 'Complaint_Key';
}

export interface CreateComplaintData {
  complaint_insert: Complaint_Key;
}

export interface CreateComplaintVariables {
  title: string;
  description: string;
  category: string;
}

export interface FoundItem_Key {
  id: UUIDString;
  __typename?: 'FoundItem_Key';
}

export interface GetMyProfileData {
  user?: {
    id: UUIDString;
    displayName: string;
    email?: string | null;
    hostelRoomNumber?: string | null;
    role: string;
  } & User_Key;
}

export interface ListComplaintsData {
  complaints: ({
    id: UUIDString;
    title: string;
    description: string;
    category: string;
    createdAt: TimestampString;
    status: string;
    reporter: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & Complaint_Key)[];
}

export interface LostItem_Key {
  id: UUIDString;
  __typename?: 'LostItem_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateComplaintRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateComplaintVariables): MutationRef<CreateComplaintData, CreateComplaintVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateComplaintVariables): MutationRef<CreateComplaintData, CreateComplaintVariables>;
  operationName: string;
}
export const createComplaintRef: CreateComplaintRef;

export function createComplaint(vars: CreateComplaintVariables): MutationPromise<CreateComplaintData, CreateComplaintVariables>;
export function createComplaint(dc: DataConnect, vars: CreateComplaintVariables): MutationPromise<CreateComplaintData, CreateComplaintVariables>;

interface ListComplaintsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListComplaintsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListComplaintsData, undefined>;
  operationName: string;
}
export const listComplaintsRef: ListComplaintsRef;

export function listComplaints(): QueryPromise<ListComplaintsData, undefined>;
export function listComplaints(dc: DataConnect): QueryPromise<ListComplaintsData, undefined>;

interface AddCommentToComplaintRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToComplaintVariables): MutationRef<AddCommentToComplaintData, AddCommentToComplaintVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCommentToComplaintVariables): MutationRef<AddCommentToComplaintData, AddCommentToComplaintVariables>;
  operationName: string;
}
export const addCommentToComplaintRef: AddCommentToComplaintRef;

export function addCommentToComplaint(vars: AddCommentToComplaintVariables): MutationPromise<AddCommentToComplaintData, AddCommentToComplaintVariables>;
export function addCommentToComplaint(dc: DataConnect, vars: AddCommentToComplaintVariables): MutationPromise<AddCommentToComplaintData, AddCommentToComplaintVariables>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect): QueryPromise<GetMyProfileData, undefined>;

