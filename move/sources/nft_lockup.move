/// This contract locks up an NFT forever in an object.
module nft_admin::nft_lockup {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_std::smart_vector::{Self, SmartVector, push_back};
    use aptos_std::string_utils;
    use aptos_framework::object::{Self, ExtendRef};
    use aptos_token::token::{
        Self,
        TokenId,
        create_token_data_id,
        get_tokendata_largest_property_version,
        create_token_id,
        Token
    };
    use aptos_std::smart_table::{Self, SmartTable};

    /// Not admin, can't initialize stats object
    const E_NOT_ADMIN: u64 = 1;

    /// The creator of the collection
    const CREATOR: address = @0x8869f49c4a9fd52eb5eb77da82da2a70cf098ce63010e515e610c0da7593419e;
    /// The name of the collection
    const COLLECTION_NAME: vector<u8> = b"Immutable Legends";
    /// The seed prefix for the contract
    const LOCKUP_PREFIX: vector<u8> = b"nft_lockup_2";

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
        /// Extend ref for the object
        extend_ref: ExtendRef,
    }

    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Centralized stats of all the NFTs stored
    struct NFTLockupStats has key {
        /// Address and number of nfts stored
        users: SmartTable<address, u64>,
        /// Total number of NFTs locked
        total_locked: u64,
        /// Extend ref for the object
        extend_ref: ExtendRef,
    }

    /// Initializes common stats table
    fun init_module(publisher: &signer) {
        create_stats_object(publisher);
    }

    /// Allow for locking up multiple NFTs at once
    entry fun lockup_nfts(account: &signer, names: vector<String>) acquires NFTLockup, NFTLockupStats {
        // Withdraw the nfts
        let addr = signer::address_of(account);
        let tokens = vector::map<String, Token>(names, |name| {
            withdraw_one_token(account, name)
        });

        // Ensure that there is a lockup object to throw them in
        let object_addr = ensure_lockup_object(account, addr);

        // Now add the NFTs to the lockup
        let lockup = get_lockup_object_mut(object_addr);
        let stats = get_stats_object_mut();
        vector::for_each(tokens, |token| {
            push_back(&mut lockup.locked, token);

            // Saving addresses and nft count in table
            let table = smart_table::borrow_mut_with_default(&mut stats.users, addr, 0);
            *table = *table + 1;
            stats.total_locked = stats.total_locked + 1;
        });

        // TODO: At this point, add whatever wanted to give when a user locks up a token
    }

    /// Withdraws the token from the account for locking
    inline fun withdraw_one_token(account: &signer, name: String): Token {
        let token_data_id = create_token_data_id(CREATOR, string::utf8(COLLECTION_NAME), name);
        let token_property_version = get_tokendata_largest_property_version(CREATOR, token_data_id);
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
                extend_ref,
            };

            move_to(&object_signer, nft_lockup);
        };

        object_addr
    }

    /// Creates centralized stats object
    fun create_stats_object(account: &signer) {
        let account_address = signer::address_of(account);
        assert!(account_address == @nft_admin, E_NOT_ADMIN);
        let seed_bytes = get_stats_seed_bytes();
        let constructor_ref = object::create_named_object(account, *seed_bytes);
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let object_signer = object::generate_signer(&constructor_ref);

        move_to(&object_signer, NFTLockupStats {
            users: smart_table::new(),
            total_locked: 0,
            extend_ref
        })
    }

    /// Gets the seed bytes for the lockup object, ensures they're unique on collection
    inline fun get_seed_bytes(): &vector<u8> {
        let seed = string_utils::format3(&b"{}-{}-{}", LOCKUP_PREFIX, CREATOR, COLLECTION_NAME);
        string::bytes(&seed)
    }

    inline fun get_stats_seed_bytes(): &vector<u8> {
        let seed = string_utils::format3(&b"{}-{}-{}-stats", LOCKUP_PREFIX, CREATOR, COLLECTION_NAME);
        string::bytes(&seed)
    }

    /// Retrieves the address for the lockup object
    inline fun get_lockup_object_address(addr: address): address {
        let seed_bytes = get_seed_bytes();

        object::create_object_address(&addr, *seed_bytes)
    }

    /// Retrieves the address for the lockup stats object
    inline fun get_lockup_stats_address(addr: address): address {
        let seed_bytes = get_stats_seed_bytes();

        object::create_object_address(&addr, *seed_bytes)
    }

    inline fun get_lockup_object_mut(object_addr: address): &mut NFTLockup {
        borrow_global_mut<NFTLockup>(object_addr)
    }

    inline fun get_lockup_object(object_addr: address): &NFTLockup {
        borrow_global<NFTLockup>(object_addr)
    }

    inline fun get_stats_object_mut(): &mut NFTLockupStats acquires NFTLockupStats {
        let stats_address = get_lockup_stats_address(@nft_admin);
        borrow_global_mut<NFTLockupStats>(stats_address)
    }

    inline fun get_stats_object(): & NFTLockupStats acquires NFTLockupStats {
        let stats_address = get_lockup_stats_address(@nft_admin);
        borrow_global<NFTLockupStats>(stats_address)
    }

    #[view]
    /// Shows total locked NFTs
    public(friend) fun total_locked(): u64 acquires NFTLockupStats {
        let stats = get_stats_object();
        stats.total_locked
    }

    #[view]
    /// Shows the count of the locked tokens for a user
    public(friend) fun num_locked(account: address): u64 acquires NFTLockupStats {
        let stats = get_stats_object();
        *smart_table::borrow_with_default(&stats.users, account, &0)
    }

    #[view]
    /// Shows the number of users locked
    public(friend) fun num_users_locked(): u64 acquires NFTLockupStats {
        let stats = get_stats_object();
        smart_table::length(&stats.users)
    }

    #[view]
    /// Shows the token ids of the locked tokens
    public(friend) fun locked_tokens(account: address, size: u64, offset: u64): vector<TokenId> acquires NFTLockup {
        let object_addr = get_lockup_object_address(account);
        let tokens = vector[];
        if (!exists<NFTLockup>(object_addr)) {
            tokens
        } else {
            let lockup = get_lockup_object(object_addr);
            let i = size * offset;
            let size = smart_vector::length(&lockup.locked);
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
