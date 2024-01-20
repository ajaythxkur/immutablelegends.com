"use client";
import React, { useEffect, useState } from "react";
import "./page.css"
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
export default function Page() {
    const aptosConfig = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(aptosConfig);
    const { account } = useWallet();
    const [nfts, setNfts] = useState<any[]>([]);
    const fetchOwnedTokens = async () => {
        if (!account) return;
        const tokens = await aptos.getOwnedDigitalAssets({ ownerAddress: account.address });
        if (tokens.length == 0) {
            setNfts([])
            return
        }
        const immu = tokens.filter((tkn) => {
            return tkn.current_token_data?.current_collection?.creator_address === "0x8869f49c4a9fd52eb5eb77da82da2a70cf098ce63010e515e610c0da7593419e"
        });
        if (immu.length == 0) {
            setNfts([])
            return
        }
        setNfts(immu);
    };
    const fetchTokenImage = (ipfsLink: string) => {
        const pngLink = ipfsLink.replace(".json", ".png");
        //pending
        return pngLink;
    }
    useEffect(() => {
        fetchOwnedTokens()
    }, [account?.address])
    console.log(nfts)
    return (
        <React.Fragment>
            <section className='staking'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="staking-wrapper text-center mb-4">
                                <div className="staking-con">
                                    <h2 className='mb-1'>Lock your NFT</h2>
                                </div>
                                <h3 className='mb-2'>& <br />Claim Legend</h3>
                                <WalletSelector />
                            </div>
                        </div>
                        {
                            nfts && nfts.length > 0
                            &&
                            nfts.map((token_data, index) => (
                                <div className="col-md-4" key={index}>
                                    <div className="nft-box p-4">
                                        {
                                            fetchTokenImage(token_data?.current_token_data?.token_uri)
                                            &&
                                            <img src={fetchTokenImage(token_data?.current_token_data?.token_uri)} className="img-fluid" />

                                        }
                                        <button className="btn w-100 mt-2">Lock</button>
                                        <button className="btn w-100 mt-2" disabled>Claim</button>
                                    </div>
                                </div>
                            ))
                        }

                    </div>

                </div>
            </section>
        </React.Fragment>
    )
}