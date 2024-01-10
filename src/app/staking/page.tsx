import React from "react";
import "./page.css"
export default function Page() {
    return (
        <React.Fragment>
            <section className='staking'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="staking-wrapper text-center mb-4">
                                <div className="staking-con">
                                    <h2 className='mb-1'>Stake your Legends</h2>
                                </div>
                                <h3 className='mb-2'>& <br />Earn rewards</h3>
                                <button className="btn border-0" disabled>Connect Wallet</button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="nft-box p-4">
                            <img src="https://cdn.discordapp.com/attachments/1189076379023724645/1193850772622954546/goon.jpg?ex=65ae372c&is=659bc22c&hm=372f8300f6fcb21dbbf1b23a76e5878ee80c42900ada9b517a0001aadd13524a&" className="img-fluid"/>
                            <button className="btn w-100 mt-2">Stake</button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </React.Fragment>
    )
}