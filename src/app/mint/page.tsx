"use client";
import React from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Account, Aptos } from "@aptos-labs/ts-sdk";
import { AptosAccount, HexString } from "aptos";
export default function Mint(){
    const aptos = new Aptos();
    const { account, signAndSubmitTransaction } = useWallet();
    const onMint = async() => {
        if(!account) return;
        const privateKey = process.env.privateKey!;
        // const creatorAccount = Account.fromPrivateKeyAndAddress({ privateKey: privateKey})
        // const createCollectionTransaction = await aptos.createCollectionTransaction({
        //     creator: creatorAccount,
        // });
    }
    return(
        <React.Fragment>
            <WalletSelector />
            {
                account
                &&
                <button className="btn" onClick={onMint}>Mint NFT</button>
            }
        </React.Fragment>
    )
}