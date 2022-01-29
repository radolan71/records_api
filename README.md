# Challenge

## Local set up

1. `npm i`
2. `npm run start`

## Calling the API

- This api has a basic token based auth method using the fixed token `getir-challenge`.
- This api has a basic pagination implemented the default is 100 rows per page, it can be modified trough the query string parameter `?limit=10`
  
## Test

This project uses jest and supertest for testing. 

- `npm run test`  Run all test
- `npm run test:int` Run Integration Tests
- `npm run test:unit` Run unit tests

## Deploy

- Make sure you have the aws cli configured.
- Create IAM user for serverless frawework. And create a policy for it using the least previlege principle. Learn more about this is [here](https://www.serverless.com/blog/abcs-of-iam-permissions/#managing-permissions-for-the-serverless-framework-user).
- Generate AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
- [Configure aws cli](https://aws.amazon.com/getting-started/guides/setup-environment/module-three/) to use the recently created keys or export them inline as follows:

```console	
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
export AWS_DEFAULT_REGION=us-west-2
```
- run `npm run build`
- run `serverless deploy`

## What went well
- Set up project
- Set up unit tests
- Set up communication with the db

## What did not went well
- Building the mongo query was a bit challenging.
- Seeting up the in memory db, there was some compatibility issues.

## Shorcuts used

- This project uses serverless framework to provision and deploy, instead of Terradorm or Cloudformation to provision and a proper pipeline to deploy.
- This API runs using Lambda for computing instead of ECS or EC2. Colds starts can be solved by using Provisioned Concurrency.
- Basic authentication is implemented.

## Arquitecture

- This API is using `typescript`.
- This API is usign `mongodb` library to communicate with the database.
- The API code is organized by modules. This is means each endpoint will have its own sufolder inside the `src/app` folder.
- It is intented that each module has the following files: 
  - Routes -> Middleware(optional) -> Controller -> Service -> Entity.
- Integration tests use in memory db, see `src/common/tests/TestFactory.ts`

# TODO

## Crucial 
- [ ] Delivering a Working RESTful API. 
- [ ] Clean and Production Ready Code 
- [x] Error Handling 
- [x] Comments and Documentation 
- [x] Unit and/or Integration Tests (Jest is preferable but Mocha also works) 
- [x] Avoid Over Engineering 

## My tasks
- [x] Set up
- [x] Connect to DB
- [x] Build Service, Repo ( modular app )
- [x] Tests
- [ ] Deploy
- [x] Pagination
- [x] Authentication