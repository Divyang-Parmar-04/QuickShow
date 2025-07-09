const { Inngest } = require('inngest');
const USER = require('../models/userModel');
const dotenv = require('dotenv')
dotenv.config()

// Create a client to send and receive events
const inngest = new Inngest({
  id: "movie-ticket-booking",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY, 
});



// Inngest function to create user :
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clrek" },
    { event: "clerk/user.created" },
    async ({event}) => {
       const {id,first_name,last_name,email_addresses,image_url}=event.data

       const userData = {
        _id:id,
        name:first_name + ' ' + last_name,
        email:email_addresses[0].email_address,
        image:image_url
       }

       await USER.create(userData);
    },
);

// Inngest function to delete user :
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clrek" },
    { event: "clerk/user.deleted" },
    async ({event}) => {
       const {id} = event.data
       await USER.findByIdAndDelete(id)
    },
);

// Inngest function to update user :
const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clrek" },
    { event: "clerk/user.updated" },
    async ({event}) => {

       const {id,first_name,last_name,email_addresses,image_url}=event.data

       const userData = {
        _id:id,
        name:first_name + ' ' + last_name,
        email:email_addresses[0].email_address,
        image:image_url
       }

       await USER.findByIdAndUpdate(id,userData);
    },
);


// Create an empty array where we'll export future Inngest functions
const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];

module.exports = { inngest, functions }