# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListComplaints*](#listcomplaints)
  - [*GetMyProfile*](#getmyprofile)
- [**Mutations**](#mutations)
  - [*CreateComplaint*](#createcomplaint)
  - [*AddCommentToComplaint*](#addcommenttocomplaint)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListComplaints
You can execute the `ListComplaints` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listComplaints(): QueryPromise<ListComplaintsData, undefined>;

interface ListComplaintsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListComplaintsData, undefined>;
}
export const listComplaintsRef: ListComplaintsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listComplaints(dc: DataConnect): QueryPromise<ListComplaintsData, undefined>;

interface ListComplaintsRef {
  ...
  (dc: DataConnect): QueryRef<ListComplaintsData, undefined>;
}
export const listComplaintsRef: ListComplaintsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listComplaintsRef:
```typescript
const name = listComplaintsRef.operationName;
console.log(name);
```

### Variables
The `ListComplaints` query has no variables.
### Return Type
Recall that executing the `ListComplaints` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListComplaintsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListComplaints`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listComplaints } from '@dataconnect/generated';


// Call the `listComplaints()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listComplaints();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listComplaints(dataConnect);

console.log(data.complaints);

// Or, you can use the `Promise` API.
listComplaints().then((response) => {
  const data = response.data;
  console.log(data.complaints);
});
```

### Using `ListComplaints`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listComplaintsRef } from '@dataconnect/generated';


// Call the `listComplaintsRef()` function to get a reference to the query.
const ref = listComplaintsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listComplaintsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.complaints);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.complaints);
});
```

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyProfile(): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyProfileData {
  user?: {
    id: UUIDString;
    displayName: string;
    email?: string | null;
    hostelRoomNumber?: string | null;
    role: string;
  } & User_Key;
}
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@dataconnect/generated';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@dataconnect/generated';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateComplaint
You can execute the `CreateComplaint` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createComplaint(vars: CreateComplaintVariables): MutationPromise<CreateComplaintData, CreateComplaintVariables>;

interface CreateComplaintRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateComplaintVariables): MutationRef<CreateComplaintData, CreateComplaintVariables>;
}
export const createComplaintRef: CreateComplaintRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createComplaint(dc: DataConnect, vars: CreateComplaintVariables): MutationPromise<CreateComplaintData, CreateComplaintVariables>;

interface CreateComplaintRef {
  ...
  (dc: DataConnect, vars: CreateComplaintVariables): MutationRef<CreateComplaintData, CreateComplaintVariables>;
}
export const createComplaintRef: CreateComplaintRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createComplaintRef:
```typescript
const name = createComplaintRef.operationName;
console.log(name);
```

### Variables
The `CreateComplaint` mutation requires an argument of type `CreateComplaintVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateComplaintVariables {
  title: string;
  description: string;
  category: string;
}
```
### Return Type
Recall that executing the `CreateComplaint` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateComplaintData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateComplaintData {
  complaint_insert: Complaint_Key;
}
```
### Using `CreateComplaint`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createComplaint, CreateComplaintVariables } from '@dataconnect/generated';

// The `CreateComplaint` mutation requires an argument of type `CreateComplaintVariables`:
const createComplaintVars: CreateComplaintVariables = {
  title: ..., 
  description: ..., 
  category: ..., 
};

// Call the `createComplaint()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createComplaint(createComplaintVars);
// Variables can be defined inline as well.
const { data } = await createComplaint({ title: ..., description: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createComplaint(dataConnect, createComplaintVars);

console.log(data.complaint_insert);

// Or, you can use the `Promise` API.
createComplaint(createComplaintVars).then((response) => {
  const data = response.data;
  console.log(data.complaint_insert);
});
```

### Using `CreateComplaint`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createComplaintRef, CreateComplaintVariables } from '@dataconnect/generated';

// The `CreateComplaint` mutation requires an argument of type `CreateComplaintVariables`:
const createComplaintVars: CreateComplaintVariables = {
  title: ..., 
  description: ..., 
  category: ..., 
};

// Call the `createComplaintRef()` function to get a reference to the mutation.
const ref = createComplaintRef(createComplaintVars);
// Variables can be defined inline as well.
const ref = createComplaintRef({ title: ..., description: ..., category: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createComplaintRef(dataConnect, createComplaintVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.complaint_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.complaint_insert);
});
```

## AddCommentToComplaint
You can execute the `AddCommentToComplaint` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addCommentToComplaint(vars: AddCommentToComplaintVariables): MutationPromise<AddCommentToComplaintData, AddCommentToComplaintVariables>;

interface AddCommentToComplaintRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCommentToComplaintVariables): MutationRef<AddCommentToComplaintData, AddCommentToComplaintVariables>;
}
export const addCommentToComplaintRef: AddCommentToComplaintRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCommentToComplaint(dc: DataConnect, vars: AddCommentToComplaintVariables): MutationPromise<AddCommentToComplaintData, AddCommentToComplaintVariables>;

interface AddCommentToComplaintRef {
  ...
  (dc: DataConnect, vars: AddCommentToComplaintVariables): MutationRef<AddCommentToComplaintData, AddCommentToComplaintVariables>;
}
export const addCommentToComplaintRef: AddCommentToComplaintRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCommentToComplaintRef:
```typescript
const name = addCommentToComplaintRef.operationName;
console.log(name);
```

### Variables
The `AddCommentToComplaint` mutation requires an argument of type `AddCommentToComplaintVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCommentToComplaintVariables {
  complaintId: UUIDString;
  text: string;
}
```
### Return Type
Recall that executing the `AddCommentToComplaint` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCommentToComplaintData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCommentToComplaintData {
  complaintComment_insert: ComplaintComment_Key;
}
```
### Using `AddCommentToComplaint`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCommentToComplaint, AddCommentToComplaintVariables } from '@dataconnect/generated';

// The `AddCommentToComplaint` mutation requires an argument of type `AddCommentToComplaintVariables`:
const addCommentToComplaintVars: AddCommentToComplaintVariables = {
  complaintId: ..., 
  text: ..., 
};

// Call the `addCommentToComplaint()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCommentToComplaint(addCommentToComplaintVars);
// Variables can be defined inline as well.
const { data } = await addCommentToComplaint({ complaintId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCommentToComplaint(dataConnect, addCommentToComplaintVars);

console.log(data.complaintComment_insert);

// Or, you can use the `Promise` API.
addCommentToComplaint(addCommentToComplaintVars).then((response) => {
  const data = response.data;
  console.log(data.complaintComment_insert);
});
```

### Using `AddCommentToComplaint`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCommentToComplaintRef, AddCommentToComplaintVariables } from '@dataconnect/generated';

// The `AddCommentToComplaint` mutation requires an argument of type `AddCommentToComplaintVariables`:
const addCommentToComplaintVars: AddCommentToComplaintVariables = {
  complaintId: ..., 
  text: ..., 
};

// Call the `addCommentToComplaintRef()` function to get a reference to the mutation.
const ref = addCommentToComplaintRef(addCommentToComplaintVars);
// Variables can be defined inline as well.
const ref = addCommentToComplaintRef({ complaintId: ..., text: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCommentToComplaintRef(dataConnect, addCommentToComplaintVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.complaintComment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.complaintComment_insert);
});
```

