"use client";
import React, { useEffect, useState } from "react";
import "./page.css"
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import _ from "lodash";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
export const moduleAddress = "0xc21eef93e0188165bc9f303e7f8b7f24064db5e6981d1cd092ee4a4b84ac38af"; //example address to be changed
export default function Page() {
    const aptosConfig = new AptosConfig({ network: Network.MAINNET });
    const aptos = new Aptos(aptosConfig);
    const { account, signAndSubmitTransaction } = useWallet();
    const [nfts, setNfts] = useState<any[]>([]);
    const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
    const fetchOwnedTokens = async () => {
        if (!account) return;
        const tokens = await aptos.getOwnedDigitalAssets({ ownerAddress: account.address });
        if (tokens.length == 0) {
            setNfts([])
            return
        }
        const immu = _.filter(tokens, (tkn) => {
            return tkn.current_token_data?.current_collection?.creator_address === "0x8869f49c4a9fd52eb5eb77da82da2a70cf098ce63010e515e610c0da7593419e"
        });

        if (immu.length == 0) {
            setNfts([])
            return
        }
        const newMap = await Promise.all(_.map(immu, async (nft) => {
            const image = await fetchTokenImage(nft?.current_token_data?.token_uri!)
            return {
                image,
                token_name: nft?.current_token_data?.token_name
            }
        }));
        setNfts(newMap);
    };
    const fetchTokenImage = async (ipfsLink: string) => {
        const replacedLink = ipfsLink.replace("ipfs://", "");
        const response = await fetch(`https://ipfs.io/ipfs/${replacedLink}`);
        if (response.ok) {
            const metadata = await response.json();
            return metadata.image.replace("ipfs://", "https://nftstorage.link/ipfs/");
        }
        return null;
    }
    const onLock = async (token_name: string) => {
        if (!account) return;
        try {
            setTransactionInProgress(true)
            const arg = [token_name];
            const transaction: InputTransactionData = {
                data: {
                    function: `${moduleAddress}::nft_lockup::lockup_nfts`,
                    functionArguments: [arg]
                }
            };
            const response = await signAndSubmitTransaction(transaction);
            await aptos.waitForTransaction({ transactionHash: response.hash });
            setNfts((prev)=>{
                return _.filter(prev, (nft)=> nft.token_name != token_name)
            })
        } catch (error: any) {
            console.log("error", error)
        } finally {
            setTransactionInProgress(false)
        }
    }
    useEffect(() => {
        fetchOwnedTokens()
    }, [account?.address])
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
                                <h3 className='mb-2'>& <br />For Legend</h3>
                                <WalletSelector />
                                <h3 className='mb-2'>Total NFTs Locked: 10</h3>
                            </div>
                        </div>
                        {
                            nfts && nfts.length > 0
                            &&
                            nfts.map((token_data, index) => (
                                <div className="col-md-4" key={index}>
                                    <div className="nft-box p-4 m-2">
                                        <img alt="nft" src={token_data.image} className="img-fluid" />
                                        {
                                            transactionInProgress ?
                                            <button className="btn w-100 mt-2" disabled>Lock</button>
                                            :
                                            <button className="btn w-100 mt-2" onClick={() => onLock(token_data.token_name)}>Lock</button>
                                        }
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