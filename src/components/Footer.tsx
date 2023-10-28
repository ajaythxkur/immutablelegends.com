import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Footer = () => {
    const location = useLocation();
    return(
        <React.Fragment>
            <section className="footer-section pb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-center">
                                <div className="footer-box p-2 rounded border d-flex gap-2">
                                            <Link to="/">
                                                <button className={`btn border rounded ${location.pathname == "/" ? 'active' :''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512" height="22" width="22" fill="none"><path d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212"  stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/><path d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256M400 179V64h-48v69" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>
                                                </button>
                                            </Link>
                                            <Link to="/staking">
                                                <button className={`btn border rounded ${location.pathname == "/staking" ? 'active' :''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512" height="22" width="22" fill="none"><ellipse cx="256" cy="128" rx="192" ry="80" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"/><path d="M448 214c0 44.18-86 80-192 80S64 258.18 64 214M448 300c0 44.18-86 80-192 80S64 344.18 64 300" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"/><path d="M64 127.24v257.52C64 428.52 150 464 256 464s192-35.48 192-79.24V127.24" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"/></svg>
                                                </button>
                                            </Link>
                                            <Link to="/daily-rewards">
                                                <button className={`btn border rounded ${location.pathname == "/daily-rewards" ? 'active' :''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512" height="22" width="22" fill="none"><path d="M256 104v56h56a56 56 0 10-56-56zM256 104v56h-56a56 56 0 1156-56z" fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32"/><rect x="64" y="160" width="384" height="112" rx="32" ry="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/><path d="M416 272v144a48 48 0 01-48 48H144a48 48 0 01-48-48V272M256 160v304" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>
                                                </button>
                                            </Link>
                                            <Link to="/bump-exchange">
                                                <button className={`btn border rounded ${location.pathname == "/bump-exchange" ? 'active' :''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512" height="22" width="22" fill="none"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M320 120l48 48-48 48"/><path d="M352 168H144a80.24 80.24 0 00-80 80v16M192 392l-48-48 48-48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/><path d="M160 344h208a80.24 80.24 0 0080-80v-16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>
                                                </button>
                                            </Link>
                                            {/* <Link to="/airdrop-market">
                                                <button className={`btn border rounded ${location.pathname == "/airdrop-market" ? 'active' :''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512" height="22" width="22" fill="none"><path d="M461.93 261.05c-2-4.76-6.71-7.83-11.67-9.49l-187.18-74.48a23.78 23.78 0 00-14.17 0l-187 74.52c-5 1.56-9.83 4.77-11.81 9.53s-2.94 9.37-1 15.08l46.53 119.15a7.46 7.46 0 007.47 4.64c26.69-1.68 50.31-15.23 68.38-32.5a7.66 7.66 0 0110.49 0C201.29 386 227 400 256 400s54.56-14 73.88-32.54a7.67 7.67 0 0110.5 0c18.07 17.28 41.69 30.86 68.38 32.54a7.45 7.45 0 007.46-4.61l46.7-119.16c1.98-4.78.99-10.41-.99-15.18z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/><path d="M416 473.14a6.84 6.84 0 00-3.56-6c-27.08-14.55-51.77-36.82-62.63-48a10.05 10.05 0 00-12.72-1.51c-50.33 32.42-111.61 32.44-161.95.05a10.09 10.09 0 00-12.82 1.56c-10.77 11.28-35.19 33.3-62.43 47.75a7.15 7.15 0 00-3.89 5.73 6.73 6.73 0 007.92 7.15c20.85-4.18 41-13.68 60.2-23.83a8.71 8.71 0 018-.06A185.14 185.14 0 00340 456a8.82 8.82 0 018.09.06c19.1 10 39.22 19.59 60 23.8a6.72 6.72 0 007.95-6.71z"/><path d="M320 96V72a24.07 24.07 0 00-24-24h-80a24.07 24.07 0 00-24 24v24M416 233v-89a48.14 48.14 0 00-48-48H144a48.14 48.14 0 00-48 48v92M256 183.6v212.85" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>
                                                </button>
                                            </Link> */}
                                           
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}
export default Footer;