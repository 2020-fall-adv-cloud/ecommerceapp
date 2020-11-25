import React
    , { useState } 
from 'react';

import './App.css';

import { 
    Input
    , Button 
} from 'antd';

import { API } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';

const initialState = {
  name: ''
  , price: ''
};

const Admin = () => {

    const [itemInfo, updateItemInfo] = useState(initialState);

    //
    // Called when any of the input controls change. Updated the state with
    // the latest name or price that is changing as the user types in the input control.
    //
    const updateForm = (e) => {
        
        const formData = {
            ...itemInfo
            , [e.target.name]: e.target.value
        };
    
        updateItemInfo(formData);
    };


    const addItem = async () => {
        try {

            // Setup the payload to call the REST endpoint.
            const data = {
                body: { 
                    ...itemInfo
                    , price: parseInt(itemInfo.price)
                }
            };

            // Blank out (or reset) the input controls after adding... Very optimistic...
            updateItemInfo(initialState);

            // Call the REST endpoint...
            await API.post(
                'ecommerceapi20f'
                , '/products'
                , data
            );

        } catch (err) {
            console.log('error adding item...');
        }
    };

    return (
        <div style={containerStyle}>
            <Input
                name='name'
                onChange={updateForm}
                value={itemInfo.name}
                placeholder='Item name'
                style={inputStyle}
            />
            <Input
                name='price'
                onChange={updateForm}
                value={itemInfo.price}
                style={inputStyle}
                placeholder='Item price'
            />
            <Button
                style={buttonStyle}
                onClick={addItem}
            >
                Add Product
            </Button>
        </div>
    );
}

const containerStyle = { 
    width: 400
    , margin: '20px auto' 
};

const inputStyle = { marginTop: 10 };
const buttonStyle = { marginTop: 10 };

export default withAuthenticator(Admin);