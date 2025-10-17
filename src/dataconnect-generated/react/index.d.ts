import { CreateComplaintData, CreateComplaintVariables, ListComplaintsData, AddCommentToComplaintData, AddCommentToComplaintVariables, GetMyProfileData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateComplaint(options?: useDataConnectMutationOptions<CreateComplaintData, FirebaseError, CreateComplaintVariables>): UseDataConnectMutationResult<CreateComplaintData, CreateComplaintVariables>;
export function useCreateComplaint(dc: DataConnect, options?: useDataConnectMutationOptions<CreateComplaintData, FirebaseError, CreateComplaintVariables>): UseDataConnectMutationResult<CreateComplaintData, CreateComplaintVariables>;

export function useListComplaints(options?: useDataConnectQueryOptions<ListComplaintsData>): UseDataConnectQueryResult<ListComplaintsData, undefined>;
export function useListComplaints(dc: DataConnect, options?: useDataConnectQueryOptions<ListComplaintsData>): UseDataConnectQueryResult<ListComplaintsData, undefined>;

export function useAddCommentToComplaint(options?: useDataConnectMutationOptions<AddCommentToComplaintData, FirebaseError, AddCommentToComplaintVariables>): UseDataConnectMutationResult<AddCommentToComplaintData, AddCommentToComplaintVariables>;
export function useAddCommentToComplaint(dc: DataConnect, options?: useDataConnectMutationOptions<AddCommentToComplaintData, FirebaseError, AddCommentToComplaintVariables>): UseDataConnectMutationResult<AddCommentToComplaintData, AddCommentToComplaintVariables>;

export function useGetMyProfile(options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
export function useGetMyProfile(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyProfileData>): UseDataConnectQueryResult<GetMyProfileData, undefined>;
