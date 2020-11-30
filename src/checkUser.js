import { Auth } from 'aws-amplify';

const checkUser = async (updateUser) => {

    try {
        const userData = await Auth.currentSession()

        console.log(userData);

        // Complex destructuring... E.g. Nested property destructuring... Could use userData.idToken.payload
        const { idToken: { payload }} = userData;

        // Use JS property indexer operator, similar to array index operator...
        //
        // The && is a 'boolean short-circut' technique...
        //
        // includes() is an array method, much like map(), filter(), reduce()...
        //
        const isAuthorized =
            payload['cognito:groups']
            && payload['cognito:groups'].includes('Admin');
        
        // Calling the callback with a non-empty object.    
        updateUser({
            username: payload['cognito:username']
            , isAuthorized // isAuthorized: isAuthorized shorthand syntax...
        });
    }

    catch (err) {
        console.error(err);
        updateUser({});
    }
}

export default checkUser;