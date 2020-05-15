# This Repo

Will hold my notes and projects related to learning GraphQL.

The course I'm following is on Udemy: https://www.udemy.com/course/graphql-bootcamp/

I intend to immediately start using GraphQL with projects created with the GatsbyJS framework and eventually to be able to apply the paradigm to other projects, like NodeJS projects, that would benefit from it. Getting better at API architecture is

<hr />
<br />
<hr />

# GraphQL

How GraphQL backends work:

-   exposes one endpoint so client needs to specify exactly what info they want rather than the server determining what comes back from an endpoint
-   database agnostic. Doesn't matter what kinda db you use, if it's sql or nosql or what.
-   self-documenting via a schema. Nobody has to manually keep track of what comes back from which query.

The API paradigms are query, streaming, web, flat file, RPC. There is no "best" solution that fits all scenarios. GraphQL APIs can however replace a lot of REST-hopeful APIs out there that don't quite follow the architecture or don't need to be highly scalable, long-lasting, or otherwise complex enough to take advantage of the caching abilities that REST setups have.

## Why

-   Speed - makes fewer HTTP requests
-   Flexibility
-   Easy to maintain - client only needs to change its query to alter what gets sent back from requests rather than necessitate a rewrite of the API endpoint
-   Easy to teach people so onboarding is simple and they will quickly pick up
-   Great developer experience (I agree)
-   Closer to direct SQL/db access than a REST API
-   Nice tooling available

The appeal of GraphQL seems to come when you want something very simple: to have your front-end communicate with your back-end. True REST architecture aims to solve some different problems.

## WTF is a graph

It's a way to think about our data and how it relates to each other.

**Types** like User, Post, Comment are root objects. Types have fields. Users might have an id, a name, an age. A post might also have an id, a title, a body, a publishedStatus. There are also relationships between types like a user's list of posts, and a relationship between a post and its author.

## Structure of a query

Specify type(s) you want, then what fields you want from them. You must specify what fields you want from a type. You cannot simply request an entire object. It's up to the dev to optimize the queries

### In a Schema

a ! indicates that a value will always be returned. Without it, null is a valid response
a [] indicates that a returned value will be an array.

## Creating an API

-   graphql-yoga is an easy to use graphql server

Creating a schema is the first order of business. Think about the types of data the API will be serving up. These types will be defined in a string that contains graphQL code.

```
const typeDefs = `
type Query {
        greeting: String!
    }
`
```

Resolvers are a set of functions that run for each operation on our API.

```
const resolvers = {
	Query: {
		greeting() {
			return 'Whassup';
		}
	}
};
```

4 arguments get passed to all resolver functions. Parent, args, context (ctx), info.

And that's the bare minimum. Now we have a type

## Types

There are 5 Scalar types: string, boolean, int, float, ID. These are just simple values.

## Relationships Between Types

Often you'll want to grab something from a Type that has a relationship to the one you're primarily interested in - a user's name from a post, for instance.

```
query{
  posts{
    id
    body
    title
    author{
      name
      id
    }
  }
}
```

Here we see an author being queried for each post, but since the author is of type User we actually need to specify what we want from that type of object. These relationships need to be explicitly set up in the typeDefs. This would need to exist in the Post type

```
author: User!
```

then we'd need to make a resolver function for it, because Post's a non scalar type.

```
	Post: {
		author(parent, args, ctx, info) {
			return users.find((user) => {
				return user.id === parent.author;
			});
		}
	}
```

this gives us the User object for each post on its author query. What if we wanted to also get the ability to grab all of a User's posts?

```
posts: [Post!]!
```

that array will of course call the resolver for Post for all of a user's posts. Here's what that resolver would look like:

```
	User: {
		posts(parent, args, ctx, info) {
			return proasts.filter((proast) => {
				return proast.author === parent.id;
			});
		}
	}
```

Again, the data comes in on parent.
