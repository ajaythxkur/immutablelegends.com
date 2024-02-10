import React from "react";
import Link from "next/link";
import "./navbar.css";
import { random_color } from "@/libs/main.ts";
export default function Navbar() {
    return (
        <React.Fragment>
            <nav className="navbar">
                <div className="container-fluid container-md d-block d-md-flex text-center">
                    <Link href="/" className="navbar-brand retro" tabIndex={-1} style={{backgroundColor: random_color()}}>immutable legends</Link>
                    <div className="menus d-flex gap-2 justify-content-center mt-2">
                        <Link href="/locking">Lock</Link>
                    </div>
                </div>
            </nav>
        </React.Fragment>
    )
}