# Voting Application

This is a simple voting application to answer the age old question. 

Which do people like more cake or pie?

We currently deploy two services.

## Voting Service
This service is a Node JS service written with Hapi JS. This is where the user
goes to vote. It takes care of writing the votes to the database.

## Result Service
This service is a Python 2 flask service. It takes care of visualizing the
results to the user.

## Database
This application uses Redis as its backing data store.

