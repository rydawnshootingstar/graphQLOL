# This Repo

Will hold my notes and projects related to learning GraphQL.

<hr />
<br />
<hr />

# GraphQL

How GraphQL backends work:

-  exposes one endpoint so client needs to specify exactly what info they want rather than the server determining what comes back from an endpoint
-  database agnostic. Doesn't matter what kinda db you use, if it's sql or nosql or what.

## Why

Speed - makes fewer HTTP requests
Flexibility
Easy to maintain - client only needs to change its query to alter what gets sent back from requests rather than necessitate a rewrite of the API endpoint

## WTF is a graph

It's a way to think about our data and how it relates to each other.

**Types** like User, Post, Comment are root objects. Types have fields. Users might have an id, a name, an age. A post might also have an id, a title, a body, a publishedStatus. There are also relationships between types like a user's list of posts, and a relationship between a post and its author.
