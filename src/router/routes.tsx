import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeView from "../pages/HomeView.tsx";
import Staking from "../pages/Staking.tsx";
import BumpDaily from "../pages/BumpDaily.tsx";
import BumpExchange from "../pages/BumpExchange.tsx";
// import AirdropMarket from "../pages/AirdropMarket.tsx";
export default function AppRoutes(){
    const routes = [
        {
            path:"/",
            Component: HomeView
        },
        {
            path:"/staking",
            Component: Staking,
        },
        {
            path:"/daily-rewards",
            Component: BumpDaily
        },
        {
            path:"/bump-exchange",
            Component: BumpExchange
        },
        // {
        //     path:"/airdrop-market",
        //     Component: AirdropMarket
        // },
    ]
    return (
        <React.Fragment>
            <Routes>
            {routes.map(({path, Component}, index)=>{
                return(
                    <Route key={index} path={path} element={<Component />}/>
                )
            })}
            </Routes>
        </React.Fragment>
    )
}