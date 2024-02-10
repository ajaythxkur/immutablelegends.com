"use client";

import React, { useEffect, useState } from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Aptos, AptosConfig, InputViewRequestData, Network } from "@aptos-labs/ts-sdk";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import "./page.css"
import _ from "lodash";
import { capitalizeUnderScoredStr, random_color } from "@/libs/main";
type LockData = {
    total_locked: number,
    num_locked: number, //locked by user
    num_users_locked: number, //number of users locked
}


export default function Page() {
    const LOCK_CONTRACT_ADDRESS = process.env.LOCK_CONTRACT_ADDRESS?.toString();
    const CREATOR_ADDRESS = process.env.CREATOR_ADDRESS?.toString();
    const TOTAL_NFTS = 1212;
    const COLLECTION_NAME = "Immutable Legends"

    const aptosConfig = new AptosConfig({ network: Network.DEVNET });
    const aptos = new Aptos(aptosConfig);

    const { account, signAndSubmitTransaction } = useWallet();

    const [NFTs, setNFTs] = useState<any[]>([])
    const [nftsToLock, setNftsToLock] = useState<string[]>([]);
    const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);

    const [viewData, setViewData] = useState<LockData>({
        total_locked: 0,
        num_locked: 0,
        num_users_locked: 0
    })
    const fetchNft = async () => {
        if (!account) return;
        try {
            const ownedToken = await aptos.getOwnedDigitalAssets({ ownerAddress: account.address });
            if (ownedToken.length == 0) return;
            const nftsToLock = ownedToken.filter((token) => token.current_token_data?.current_collection?.collection_name == COLLECTION_NAME);
            const nftsWithImage = nftsToLock.map(async(token)=>{
                return {
                    ...token,
                    image: await fetchTokenImage(token?.current_token_data?.token_uri!)
                }
            })
            Promise.all(nftsWithImage).then((images)=>{
                setNFTs(images)

            })
        } catch (error: any) {
            setNFTs([])
            console.log("error: ", error);
        }

    }
    const onNFTLock = async () => {
        if (!account) return;
        const argument = nftsToLock;
        const transaction: InputTransactionData = {
            data: {
                function: `${LOCK_CONTRACT_ADDRESS}::nft_lockup::lockup_nfts`,
                functionArguments: [argument],
            },
        };
        setTransactionInProgress(true)
        try {
            const response = await signAndSubmitTransaction(transaction);
            await aptos.waitForTransaction({ transactionHash: response.hash })
            setNFTs((prev) => prev.filter((token) => !nftsToLock.includes(token?.current_token_data?.token_name)));
            setNftsToLock([])
            await fetchViewFunction()
        } catch (error: any) {
            console.log("error: ", error)
        } finally {
            setTransactionInProgress(false)
        }
    }
    const nftLockSelect = (token: string) => {
        setNftsToLock((prev) => {
            const nfts = [...prev];
            if (nfts.includes(token)) {
                return nfts.filter((nftName) => nftName != token)
            }
            nfts.push(token)
            return nfts;
        })
    }

    const fetchViewFunction = async () => {
        try {
            const modules = await aptos.getAccountModules({ accountAddress: LOCK_CONTRACT_ADDRESS! });
            const moduleExists = modules.some((v) => v.abi?.name == "nft_lockup")
            if (!moduleExists) return;
            const viewFnData: LockData = {
                total_locked: 0,
                num_locked: 0,
                num_users_locked: 0
            }
            const totalLockedTxn: InputViewRequestData = {
                function: `${LOCK_CONTRACT_ADDRESS}::nft_lockup::total_locked`,
                functionArguments: [],
            }
            const usersLockedTxn: InputViewRequestData = {
                function: `${LOCK_CONTRACT_ADDRESS}::nft_lockup::num_users_locked`,
                functionArguments: [],
            }
            if (account) {
                const userLockedTxn: InputViewRequestData = {
                    function: `${LOCK_CONTRACT_ADDRESS}::nft_lockup::num_locked`,
                    functionArguments: [account?.address],
                };
                const num_locked = await aptos.view({ payload: userLockedTxn });
                viewFnData.num_locked = Number(num_locked.at(0));
            }
            const total_locked = await aptos.view({ payload: totalLockedTxn });
            viewFnData.total_locked = Number(total_locked.at(0));
            const num_users_locked = await aptos.view({ payload: usersLockedTxn });
            viewFnData.num_users_locked = Number(num_users_locked.at(0));
            setViewData(viewFnData);
        } catch (error: any) {
            console.log("error: ", error)
        }
    }
    const fetchTokenImage = async (str: string) => {
        try {
            const ipfsLink = str;
            const replacedLink = ipfsLink.replace("ipfs://", "");
            const response = await fetch(`https://ipfs.io/ipfs/${replacedLink}`);
            if (response.ok) {
                const metadata = await response.json();
                return metadata.image!.replace("ipfs://", "https://nftstorage.link/ipfs/");
            }
            return null;
        } catch (error) {
            console.log(str)
            return str;
        }

    }
    useEffect(() => {
        fetchNft()
        fetchViewFunction()
    }, [account?.address])
    return (
        <React.Fragment>
            <section className='staking'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="staking-wrapper text-center mb-5">
                                <div className="staking-con">
                                    <h2 className='mb-1'>Lock & Burn your NFT</h2>
                                </div>
                                <h3 className='mb-2'>& <br />For Legend</h3>
                                <WalletSelector />
                            </div>
                        </div>
                        {
                            _.map(Object.keys(viewData) as (keyof LockData)[], (key, index) => (
                                <div className="col-md-4" key={index}>
                                    <div className="info-box p-4 m-2" key={index} style={{backgroundColor:`${random_color()}`, borderColor:`${random_color()}`}}>
                                        <h4 className="mb-3 cubano">{capitalizeUnderScoredStr(key)}</h4>
                                        <p>{viewData[key]}</p>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            NFTs.length > 0 && <p className="text-center cubano my-4">your nfts</p>
                        }
                        {
                            NFTs.map((token, index) => {
                                return (
                                    <div className="col-md-3" key={index}>
                                        <div className="nft-box p-4 m-2" style={{border: `3px solid ${random_color()}`}}>
                                            <div className="text-center">
                                            <img alt="nft" src={token?.image} className="img-fluid mb-3" />
                                            </div>
                                            <p className="text-center cubano mb-1">{token?.current_token_data?.token_name}</p>
                                            <button className="btn w-100 mt-2" style={{backgroundColor: `${random_color()}`}} disabled={transactionInProgress} onClick={() => nftLockSelect(token?.current_token_data?.token_name)}>
                                                {
                                                    nftsToLock.includes(token?.current_token_data?.token_name) ? "Remove" : "Add"
                                                }
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            nftsToLock.length > 0
                            &&
                            <div className="text-center">
                                {
                                    transactionInProgress
                                        ?
                                        <button className="btn confirm-btn" disabled>Confirm Lock</button>
                                        :
                                        <button className="btn confirm-btn" onClick={onNFTLock}>Confirm Lock</button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}