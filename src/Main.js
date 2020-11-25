import React
    , { 
        useState
        , useEffect 
} from 'react';

import Container from './Container';

import { API } from 'aws-amplify';

import { List } from 'antd';

import checkUser from './checkUser';

const Main = () => {

    const [state, setState] = useState(
        {
            products: []
            , loading: true
        }
    );

    const [user, updateUser] = useState({});

    let didCancel = false;

    useEffect(
        () => {
            getProducts();
            checkUser(updateUser);
            
            // Return lambda that runs as cleanup code when this React component goes away...
            return () => didCancel = true
        }
        , []
    );

    const getProducts = async () => {
        
        const data = await API.get(
            'ecommerceapi20f'
            , '/products'
        );

        console.log('data: ', data);

        // Sentinal... Return, stop this function if they cancelled.
        if (didCancel) {
            return;
        }

        setState(
            {
                products: data.data.Items
                , loading: false
            }
        );
    };

    const deleteItem = async (id) => {
        try {
            // Yea... Author using filter()...
            const products = state.products.filter(p => p.id !== id);

            // Updating local component state, removing the item, before it is deleted... Optimistic again....
            setState(
                { 
                    ...state
                    , products  // Shorthand for products: products
                }
            );

            await API.del(
                'ecommerceapi20f'
                , '/products'
                , { 
                    body: { 
                        id // Shorthand for id: id 
                    } 
                }
            );

            console.log('successfully deleted item');

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container>
            <List
                itemLayout="horizontal"
                dataSource={state.products}
                loading={state.loading}
                renderItem={
                    item => (
                        <List.Item
                            actions={
                                user.isAuthorized ? 
                                [
                                    <p 
                                        onClick={() => deleteItem(item.id)} 
                                        key={item.id}
                                    >
                                        delete
                                    </p>
                                ] : 
                                null
                            }
                        >
                            <List.Item.Meta
                                title={item.name}
                                description={item.price}
                            />
                        </List.Item>
                    )
                }
            />
        </Container>
    );
}

export default Main;