-- ============================================================================
-- ALGERIA SMART TAXI & MOBILITY PLATFORM
-- File: seed.sql
-- Description: System General Ledger accounts and reference data seeding
-- ============================================================================

-- 1. SEED SYSTEM GENERAL LEDGER (GL) WALLETS
-- Account 1010: Cash In Transit (Physical driver pocket liability)
-- Account 1020: Digital Escrow (Chargily Pay settlement clearing)
-- Account 4010: Platform Revenue (CNRC 604103 Booking Fee & Commission)

INSERT INTO public.wallets (
    id, 
    user_id, 
    account_type, 
    system_account_code, 
    balance_dzd, 
    min_allowed_balance_dzd, 
    currency, 
    is_frozen
)
VALUES
    (
        '00000000-0000-0000-0000-000000001010', 
        NULL, 
        'system_cash_transit', 
        '1010', 
        0.00, 
        -100000000.00, -- Cash in transit can accumulate negative liability until cash settled
        'DZD', 
        false
    ),
    (
        '00000000-0000-0000-0000-000000001020', 
        NULL, 
        'system_escrow', 
        '1020', 
        0.00, 
        0.00, 
        'DZD', 
        false
    ),
    (
        '00000000-0000-0000-0000-000000004010', 
        NULL, 
        'system_revenue', 
        '4010', 
        0.00, 
        0.00, 
        'DZD', 
        false
    )
ON CONFLICT (system_account_code) DO NOTHING;

-- 2. SEED INITIAL WILAYA BOUNDARIES & REFERENCE POINTS
-- (Coordinates: WGS84 for key transport hubs)
-- Algiers Central Station (16), Oran Station (31), Constantine Station (25), Blida Station (09)
-- These allow instant unit testing of distance matrix and spatial H3 lookups.
