import React from 'react';
import Menu from './Menu';
import { NavLink } from 'react-router-dom';


export default class MainPage extends React.Component {

    render() {

        return (
            <div>
                <Menu />
                <h1>Главная страница</h1>
            </div>
        )
    }
}
