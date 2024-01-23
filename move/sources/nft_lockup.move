/// This contract locks up an NFT forever in an object.
module nft_admin::nft_lockup {
    use std::signer;
    use std::string;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_vector;
    use aptos_std::smart_vector::{SmartVector, push_back};
    use aptos_std::string_utils;
    use aptos_framework::object;
    use aptos_framework::object::ExtendRef;
    use aptos_token::token;
    use aptos_token::token::{
        TokenId,
        create_token_data_id,
        get_tokendata_largest_property_version,
        create_token_id,
        Token
    };
    use aptos_std::table::{Table,Self};

    /// The creator of the collection
    const CREATOR: address = @0x8869f49c4a9fd52eb5eb77da82da2a70cf098ce63010e515e610c0da7593419e;
    /// The name of the collection
    const COLLECTION_NAME: vector<u8> = b"Immutable Legends";
    /// The seed prefix for the contract
    const LOCKUP_PREFIX: vector<u8> = b"nft_lockup";

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// This is an NFT locker, the NFTs are meant to be locked here forever.
    ///
    /// This will be in the user's account
    ///
    /// The NFTs cannot be taken out unless the contract is changed.  It's an object
    /// so that it can be extended upon.
    struct NFTLockup has key {
        /// The NFTs that have been locked up
        locked: SmartVector<Token>,
        /// Count for convenience
        count: u64,
        /// Extend ref for the object
        extend_ref: ExtendRef,
        // Address and number of nfts stored
        users: Table<address, u64>
    }

    /// Allow for locking up multiple NFTs at once
    entry fun lockup_nfts(account: &signer, names: vector<String>) acquires NFTLockup {
        lockup_nfts_internal(account, names);
    }

    /// Withdraws the token from the account for locking
    inline fun withdraw_one_token(account: &signer, addr: address, name: String): Token {
        let token_data_id = create_token_data_id(CREATOR, string::utf8(COLLECTION_NAME), name);
        let token_property_version = get_tokendata_largest_property_version(addr, token_data_id);
        let token_id = create_token_id(token_data_id, token_property_version);

        token::withdraw_token(account, token_id, 1)
    }

    /// Creates the lockup object if it doesn't exist
    inline fun ensure_lockup_object(account: &signer, addr: address): address {
        let seed_bytes = get_seed_bytes();
        let object_addr = object::create_object_address(&addr, *seed_bytes);

        // Create object if it doesn't exist
        if (!exists<NFTLockup>(object_addr)) {
            let constructor_ref = object::create_named_object(account, *seed_bytes);
            let extend_ref = object::generate_extend_ref(&constructor_ref);
            let object_signer = object::generate_signer(&constructor_ref);

            // Ensure people can't transfer this object around, similar to soulbound
            object::disable_ungated_transfer(&object::generate_transfer_ref(&constructor_ref));
            let nft_lockup = NFTLockup {
                locked: smart_vector::new(),
                count: 0,
                extend_ref,
                //initializing users
                users: table::new(),
            };

            move_to(&object_signer, nft_lockup);
        };

        object_addr
    }

    /// Locks up the NFTs
    inline fun lockup_nfts_internal(account: &signer, names: vector<String>) {
        // Withdraw the nfts
        let addr = signer::address_of(account);
        let tokens = vector::map<String, Token>(names, |name| {
            withdraw_one_token(account, addr, name)
        });

        // Ensure that there is a lockup object to throw them in
        let object_addr = ensure_lockup_object(account, addr);

        // Now add the NFTs to the lockup
        let lockup = get_lockup_object_mut(object_addr);
        vector::for_each(tokens, |token| {
            push_back(&mut lockup.locked, token);
            lockup.count = lockup.count + 1;
            // Saving addresses and nft count in table
            if(table::contains(& lockup.users, addr)){
                *table::borrow_mut(&mut lockup.users, addr) + 1;
            }else{
                table::upsert(&mut lockup.users, addr, 1);
            }
        });

        // TODO: At this point, add whatever wanted to give when a user locks up a token

    }

    /// Gets the seed bytes for the lockup object, ensures they're unique on collection
    inline fun get_seed_bytes(): &vector<u8> {
        let seed = string_utils::format3(&b"{}-{}-{}", LOCKUP_PREFIX, CREATOR, COLLECTION_NAME);
        string::bytes(&seed)
    }

    /// Retrieves the address for the lockup object
    inline fun get_lockup_object_address(addr: address): address {
        let seed_bytes = get_seed_bytes();

        object::create_object_address(&addr, *seed_bytes)
    }

    inline fun get_lockup_object_mut(object_addr: address): &mut NFTLockup {
        borrow_global_mut<NFTLockup>(object_addr)
    }

    inline fun get_lockup_object(object_addr: address): &NFTLockup {
        borrow_global<NFTLockup>(object_addr)
    }

    #[view]
    /// Shows the count of the locked tokens
    fun num_locked(account: address): u64 acquires NFTLockup {
        let object_addr = get_lockup_object_address(account);

        if (!exists<NFTLockup>(object_addr)) {
            0
        } else {
            let lockup = get_lockup_object(object_addr);
            lockup.count
        }
    }

    #[view]
    /// Shows the token ids of the locked tokens
    fun locked_tokens(account: address, size: u64, offset: u64): vector<TokenId> acquires NFTLockup {
        let object_addr = get_lockup_object_address(account);
        let tokens = vector[];
        if (!exists<NFTLockup>(object_addr)) {
            tokens
        } else {
            let lockup = get_lockup_object(object_addr);
            let i = size * offset;
            let size = lockup.count;
            while (i < size) {
                let token = smart_vector::borrow(&lockup.locked, i);
                vector::push_back(&mut tokens, token::get_token_id(token));
                i = i + 1;
            };

            tokens
        }
    }

    // TODO: Build a claim based off of that
}
